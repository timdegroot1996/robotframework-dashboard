---
outline: deep
---

# Dashboard Server

RobotFramework Dashboard includes a built-in server that lets you host the dashboard on a separate machine. This allows you to centrally serve the HTML dashboard, and remotely add, list, or remove test result outputs from other clients. The server is built using **FastAPI**, and comes with a set of Pydantic models to validate request payloads. 

> **Tip:** The server is not installed by default see [Installation & Version Info](/installation-version-info.md#install-robot-framework-dashboard) for more info!

## Why Use the Dashboard Server

- Host a centralized, always-available dashboard accessible via HTTP  
- Enable remote clients to push or delete runs in your database  
- Provide a web-based admin interface for manual management  
- Secure access via optional basic authentication (username/password)  
> **Tip:** To implement your server into your test runs look at the example [listener](/listener-integration.md) integration!


## Starting the Server

You can start the server using the `robotdashboard` CLI with the `--server` (or `-s`) option:

**Basic usage**

```bash 
robotdashboard --s  
robotdashboard --server  
robotdashboard --server default  
```

**Bind to a specific host / port**

```bash 
robotdashboard -s 127.0.0.1:8543  
```

**Enable authentication for the admin page**

```bash 
robotdashboard -s default:user:password  
```

Or with a custom host and port plus authentication:

```bash 
robotdashboard -s host:port:user:password  
```

Once the server is running, open your browser at the configured address (for example, `http://127.0.0.1:8543/`) to access:

- The **admin page** (for manual control), this page lives on the default url: `http://127.0.0.1:8543/`
    - On the admin page a menu option `API Docs` is available to open the fastapi openapi documentation
    - On the admin page a menu option `Dashboard` is available to open the dashboard
- The **dashboard HTML** , this page lives on `/dashboard`: `http://127.0.0.1:8543/dashboard`
    - On the dashboard page a menu option `Admin` is available to open the admin page
- The **API documentation**, this page lives on `/docs`: `http://127.0.0.1:8543/docs`

## Server Features & Endpoints

The built-in server exposes several HTTP endpoints to manage and serve dashboard data:

| Endpoint | Purpose |
|---|---|
| `/` | Admin page for manual management of runs / dashboard / config, not callable through scripts |
| `/dashboard` | Serves the HTML dashboard (reflects current database), not callable through scripts |
| `/get-outputs` | Returns a JSON list of stored runs (`run_start`, `alias`, `tags`), callable |
| `/add-outputs` | Accepts new output data via JSON (file path, raw XML or folder), callable |
| `/remove-outputs` | Deletes runs by index, alias, `run_start`, or tags, callable |
| `/add-log` | Upload HTML log files and associate them with runs (for `uselogs`), callable |
| `/remove-log` | Remove previously uploaded log files, callable |

All API endpoints are documented and described in the server’s own OpenAPI schema, accessible via the admin interface under “API Docs”, after starting the server.

## Security: Basic Auth (Optional)

If you start the server with a username and password, the admin page will be protected. Only someone providing the correct credentials can:

- Add or remove outputs manually  
- Change server-side dashboard configuration  

The dashboard itself (the HTML) does **not** require authentication. API calls as of now do also **not** require authentication.

## Working Programmatically with the Server

You can interact with the server programmatically using HTTP, Python, or Robot Framework. There are example scripts in the `example/server` folder:

- [interact.http](https://github.com/timdegroot1996/robotframework-dashboard/blob/main/example/server/interact.http) 
- [interact.py](https://github.com/timdegroot1996/robotframework-dashboard/blob/main/example/server/interact.py) 
- [interact.robot](https://github.com/timdegroot1996/robotframework-dashboard/blob/main/example/server/interact.robot) 

These scripts demonstrate how to:

- List existing outputs  
- Add a new `output.xml` by path or by raw XML content  
- Remove runs by index, alias, or timestamp  
- Upload log files for runs  
- Remove log files

> **Tip:** to implement your server into your test runs look at the example [listener](/listener-integration.md) integration!

## Admin JSON Config

The Dashboard Server includes a special setting on the **Admin Page** called the **Admin JSON Config**.  
This configuration allows you to apply a JSON-based dashboard setup to all dashboards hosted by the server.

### How it Works

1. **Copy & Paste**:  
   - You can copy the "JSON Config" from an existing dashboard and paste it into the Admin Page input field.  
   - If you want to empty the admin JSON Config just put in {} and apply.

2. **Propagation**:  
   - This setting will automatically apply to dashboards on other machines if all of the following conditions are met:
     - It is the **first load** of the dashboard on that browser or machine. (Otherwise their previous settings are used)
     - No `--jsonconfig` option was provided via the CLI when starting the server. (Otherwise that is used)
     - You can enforce the admin config to apply by **Settings > JSON > Reset Settings JSON** 

3. **Persistence**:  
   - The "Admin JSON Config" exists **only while the server is running**.  
   - If the server is turned off, the configuration is lost.  
   - When the server starts and you open the Admin Page, the browser's **local storage** will automatically restore the previous "Admin JSON Config" on the server, provided you are using the same machine/browser where it was previously set.  

### Important Notes

- This setting **cannot be applied via API endpoints**—it must be set through the Admin Page.  
- It ensures a consistent dashboard layout and settings across multiple machines when the above conditions are met.
