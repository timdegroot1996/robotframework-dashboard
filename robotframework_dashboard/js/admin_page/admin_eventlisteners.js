import { toggle_theme } from './admin_theme.js';
import {
    add_output_path,
    add_output_data,
    add_output_folder_path,
    remove_outputs,
    add_log,
    remove_log
} from './admin_api.js';

function setup_output_button_eventlisteners() {
    // add eventlisteners to all buttons
    document.getElementById("addOutputPath").addEventListener("click", add_output_path);
    document.getElementById("addOutputData").addEventListener("click", add_output_data);
    document.getElementById("addOutputFolderPath").addEventListener("click", add_output_folder_path);
    document.getElementById("removeOutputs").addEventListener("click", remove_outputs);
    document.getElementById("addLogData").addEventListener("click", add_log);
    document.getElementById("removeLogData").addEventListener("click", remove_log);
}

function setup_settings_modal() {
    document.getElementById("themeLight").addEventListener("click", () => toggle_theme());
    document.getElementById("themeDark").addEventListener("click", () => toggle_theme());

    function show_settings_in_textarea() {
        const textArea = document.getElementById("settingsTextArea");
        textArea.value = JSON.stringify(adminSettings, null, 2);
    }

    function copy_settings_to_clipboard() {
        const textArea = document.getElementById("settingsTextArea");
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(textArea.value);
        add_alert("Copied settings to clipboard!", "success")
    }

    async function apply_settings_from_textarea() {
        const confirmed = await confirm_action(`Are you sure you want to apply the new settings?<br><br>
                    This may override:<br>
                    - Graph settings<br>
                    - Custom layouts (e.g., moved or resized graphs)<br>
                    - Hidden graphs
                `);
        if (confirmed) {
            try {
                const input = document.getElementById("settingsTextArea").value;
                const newSettings = JSON.parse(input);
                adminSettings = newSettings
                localStorage.setItem("adminSettings", JSON.stringify(adminSettings));
                set_admin_json_config();
            } catch (e) {
                add_alert("Failed to update admin json config: " + e, "danger")
            }
        }
    }
    document.getElementById("copySettings").addEventListener("click", copy_settings_to_clipboard);
    document.getElementById("applySettings").addEventListener("click", apply_settings_from_textarea);
    document.getElementById("settingsModal").addEventListener("shown.bs.modal", show_settings_in_textarea);

    function confirm_action(message = "Are you sure?") {
        return new Promise((resolve) => {
            const settingsModal = document.getElementById("settingsModal");
            const modalEl = document.getElementById("confirmModal");
            const modalBody = document.getElementById("confirmModalMessage");
            const cancelBtn = document.getElementById("confirmCancel");
            const okBtn = document.getElementById("confirmOk");

            settingsModal.classList.add("dimmed");
            modalBody.innerHTML = message;

            const modal = new bootstrap.Modal(modalEl);
            const onCancel = () => {
                resolve(false);
                modal.hide();
            };
            const onConfirm = () => {
                resolve(true);
                modal.hide();
            };
            const onHidden = () => {
                cleanup();
            };
            const cleanup = () => {
                cancelBtn.removeEventListener("click", onCancel);
                okBtn.removeEventListener("click", onConfirm);
                modalEl.removeEventListener("hidden.bs.modal", onHidden);
                settingsModal.classList.remove("dimmed");
            };

            cancelBtn.addEventListener("click", onCancel);
            okBtn.addEventListener("click", onConfirm);
            modalEl.addEventListener("hidden.bs.modal", onHidden);
            modal.show();
        });
    }
}

export {
    setup_output_button_eventlisteners,
    setup_settings_modal,
};