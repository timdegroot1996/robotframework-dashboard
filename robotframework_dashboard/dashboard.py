from os.path import join, abspath, dirname, basename, normpath, relpath
from pathlib import Path
from datetime import datetime
from json import dumps
from zlib import compress
from base64 import b64encode
from re import sub, compile, MULTILINE, DOTALL
from .version import __version__

DEPENDENCIES = {
    "chartjs": {
        "type": "js",
        "cdn": "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js",
        "local": "dependencies/chart.js",
    },
    "datalabels": {
        "type": "js",
        "cdn": "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0",
        "local": "dependencies/chartjs-plugin-datalabels.js",
    },
    "adapter_date_fns": {
        "type": "js",
        "cdn": "https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js",
        "local": "dependencies/chartjs-adapter-date-fns.js",
    },
    "boxplot": {
        "type": "js",
        "cdn": "https://unpkg.com/@sgratzl/chartjs-chart-boxplot@3.6.0/build/index.umd.min.js",
        "local": "dependencies/chartjs-chart-boxplot.js",
    },
    "matrix": {
        "type": "js",
        "cdn": "https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@2.0.1/dist/chartjs-chart-matrix.min.js",
        "local": "dependencies/chartjs-chart-matrix.js",
    },
    "gridstack_css": {
        "type": "css",
        "cdn": "https://cdn.jsdelivr.net/npm/gridstack@12.2.1/dist/gridstack.min.css",
        "local": "dependencies/gridstack.css",
    },
    "gridstack_js": {
        "type": "js",
        "cdn": "https://cdn.jsdelivr.net/npm/gridstack@12.2.1/dist/gridstack-all.min.js",
        "local": "dependencies/gridstack.js",
    },
    "bootstrap_css": {
        "type": "css",
        "cdn": "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css",
        "local": "dependencies/bootstrap.css",
    },
    "datatables_css": {
        "type": "css",
        "cdn": "https://cdn.datatables.net/v/bs5/jq-3.7.0/dt-2.1.8/datatables.min.css",
        "local": "dependencies/datatables.css",
    },
    "bootstrap_js": {
        "type": "js",
        "cdn": "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js",
        "local": "dependencies/bootstrap.js",
    },
    "datatables_js": {
        "type": "js",
        "cdn": "https://cdn.datatables.net/v/bs5/jq-3.7.0/dt-2.1.8/datatables.min.js",
        "local": "dependencies/datatables.js",
    },
    "pako": {
        "type": "js",
        "cdn": "https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js",
        "local": "dependencies/pako.js",
    },
}


class DashboardGenerator:
    """
    Class that handles the generation of the dashboard HTML
    """

    def generate_dashboard(
        self,
        name_dashboard: str,
        data: dict,
        generation_datetime: datetime,
        dashboard_title: str,
        server: bool,
        json_config: str,
        message_config: list,
        quantity: int,
        use_logs: bool,
        offline: bool,
    ):
        """
        Function that generates the dashboard by replacing all relevant placeholders.
        """
        # load dependencies
        dependencies_block = self.build_dependencies_block(offline)

        # load template
        index_html = join(dirname(abspath(__file__)), "templates", "dashboard.html")
        with open(index_html, "r", encoding="utf-8") as file:
            dashboard_data = file.read()
            dashboard_data = dashboard_data.replace(
                "<!-- placeholder_javascript -->",
                self.inline_js_modules(self.gather_files("js")),
            )
            dashboard_data = dashboard_data.replace(
                "<!-- placeholder_css -->", self.inline_css_files(self.gather_files("css"))
            )
            dashboard_data = dashboard_data.replace(
                "<!-- placeholder_dependencies -->", dependencies_block
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_version"', __version__
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_runs"', f'"{self.compress_and_encode(data["runs"])}"'
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_suites"', f'"{self.compress_and_encode(data["suites"])}"'
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_tests"', f'"{self.compress_and_encode(data["tests"])}"'
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_keywords"',
                f'"{self.compress_and_encode(data["keywords"])}"',
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_amount"', str(quantity)
            )
            if dashboard_title != "":
                dashboard_data = dashboard_data.replace(
                    '"placeholder_dashboard_title"', dashboard_title
                )
            else:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_dashboard_title"',
                    f"Robot Framework Dashboard - {str(generation_datetime)[:-7]}",
                )
            if server:
                dashboard_data = dashboard_data.replace('"placeholder_server"', "true")
            else:
                dashboard_data = dashboard_data.replace('"placeholder_server"', "false")
            if message_config:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_message_config"',
                    str(message_config).replace("'", '"'),
                )
            if json_config:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_json_config"',
                    json_config,
                )
            if use_logs:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_use_logs"', "true"
                )
            else:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_use_logs"', "false"
                )

        # handle possible subdirectories
        path = Path(name_dashboard)
        path.parent.mkdir(exist_ok=True, parents=True)

        # minify html
        dashboard_data = self.minify_text(dashboard_data)

        # write template
        with open(name_dashboard, "w", encoding="utf-8") as file:
            file.write(dashboard_data)

        # warn in case of empty database
        if len(data["runs"]) == 0:
            print("  WARNING: There are no runs so the dashboard will be empty!")

    def compress_and_encode(self, obj):
        json_data = dumps(obj).encode("utf-8")
        compressed = compress(json_data)
        return b64encode(compressed).decode("utf-8")

    def build_dependencies_block(self, offline: bool) -> str:
        """
        Builds either CDN links or inline js/css for offline mode.
        """
        html_parts = []

        for dep_name, dep in DEPENDENCIES.items():
            if not offline:
                if dep["type"] == "js":
                    html_parts.append(f'<script src="{dep["cdn"]}"></script>')
                else:
                    html_parts.append(f'<link rel="stylesheet" href="{dep["cdn"]}" />')
            else:
                local_path = Path(dirname(abspath(__file__))) / dep["local"]
                contents = local_path.read_text(encoding="utf-8")
                html_parts.append(f"<!-- {dep_name} -->")
                if dep["type"] == "js":
                    html_parts.append(f"<script>\n{contents}\n</script>")
                else:
                    html_parts.append(f"<style>\n{contents}\n</style>")

        return "\n".join(html_parts)

    def minify_text(self, text):
        cleaned_lines = []
        for line in text.splitlines():
            stripped = line.strip()
            if stripped:  # keep only non-empty lines
                cleaned_lines.append(stripped)
        return "\n".join(cleaned_lines)

    def inline_js_modules(self, js_files):
        """
        Takes a list of JS module file paths, resolves import order,
        strips imports/exports, and returns one merged <script type="module"> block.
        """
        base = Path(dirname(abspath(__file__)))
        # Step 1 — Load all module sources using absolute paths
        modules = {}
        for rel_path in js_files:
            abs_path = base / rel_path
            if not abs_path.exists():
                raise FileNotFoundError(f"JS module not found: {abs_path}")
            modules[str(abs_path)] = abs_path.read_text(encoding="utf-8")

        # Step 2 — Build dependency graph
        import_pattern = compile(r'import\s+.*?from\s+[\'"](.*?)[\'"];?',DOTALL)
        dependencies = {path: [] for path in modules.keys()}
        for abs_path, code in modules.items():
            current_dir = dirname(abs_path)
            for match in import_pattern.findall(code):
                dep_abs = normpath(join(current_dir, match))
                dependencies[abs_path].append(dep_abs)

        # Step 3 — Topological sort
        resolved = []
        visited = set()

        def visit(path):
            if path in visited:
                return
            visited.add(path)
            for dep in dependencies[path]:
                visit(dep)
            resolved.append(path)

        for path in modules.keys():
            visit(path)

        # Step 4 — Merge + strip import/export
        merged = "// MERGED MODULES\n"
        for abs_path in resolved:
            file_name = basename(abs_path)
            code = modules[abs_path]
            # 1. Remove multi-line export blocks first
            code = sub(r"\s*export\s*\{[\s\S]*?\};\s*", "", code)
            # 2. Remove export default statements
            code = sub(r"\s*export\s+default\s+[\s\S]*?;?\s*", "", code)
            # 3. Remove import statements (single or multi-line)
            code = sub(r"^\s*import\s+[\s\S]*?;\s*", "", code, flags=MULTILINE)
            # 4. Remove inline export before function declarations
            code = sub(r"^\s*export\s+", "", code, flags=MULTILINE)
            merged += f"\n// === {file_name} ===\n"
            merged += code + "\n"

        # Step 5 — Wrap in a single module script tag
        return f'<script>{merged}</script>'

    def inline_css_files(self, css_files):
        """
        Takes a list of CSS file paths and merges them into one <style> block.
        """
        base = Path(dirname(abspath(__file__)))
        merged = ""
        for rel_path in css_files:
            abs_path = base / rel_path
            css = abs_path.read_text(encoding="utf-8")
            merged += f"\n/* === {basename(rel_path)} === */\n"
            merged += css + "\n"
        return f"<style>\n{merged}\n</style>"

    def gather_files(self, folder):
        """
        Recursively collect all JS/CSS files under robotframework_dashboard/js or css.
        relative to the project root.
        """
        base_path = Path(__file__).parent / folder
        js_files = sorted(base_path.rglob(f"*.{folder}"))  # recursive search
        return [str(relpath(p, Path(__file__).parent)) for p in js_files]
