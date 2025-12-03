import { add_alert } from "./common.js";

var adminSettings = {}

// function to add an output to the database based on a path
function add_output_path() {
    document.getElementById("addPathSpinner").hidden = false
    const outputPath = document.getElementById("outputPath").value
    const outputTags = document.getElementById("outputTags").value.split(":")
    document.getElementById("outputPath").value = ""
    document.getElementById("outputTags").value = ""

    const body = JSON.stringify({
        output_path: outputPath,
        output_tags: outputTags,
    });
    send_request("POST", "/add-outputs", body, "addPathSpinner")
}

// function to add an output to the database based on raw data
function add_output_data() {
    document.getElementById("addDataSpinner").hidden = false
    const outputData = document.getElementById("outputData").value
    const outputDataTags = document.getElementById("outputDataTags").value.split(":")
    const outputAlias = document.getElementById("outputDataAlias").value
    document.getElementById("outputData").value = ""
    document.getElementById("outputDataTags").value = ""
    document.getElementById("outputDataAlias").value = ""

    const body = JSON.stringify({
        output_data: outputData,
        output_tags: outputDataTags,
        output_alias: outputAlias,
    });
    send_request("POST", "/add-outputs", body, "addDataSpinner")
}

// function to add output(s) to the database based on a folder path
function add_output_folder_path() {
    document.getElementById("addFolderSpinner").hidden = false
    const outputFolderPath = document.getElementById("outputFolderPath").value
    const outputFolderTags = document.getElementById("outputFolderTags").value.split(":")
    document.getElementById("outputFolderPath").value = ""
    document.getElementById("outputFolderTags").value = ""

    const body = JSON.stringify({
        output_folder_path: outputFolderPath,
        output_tags: outputFolderTags,
    });
    send_request("POST", "/add-outputs", body, "addFolderSpinner")
}

// function to remove outputs from the database
function remove_outputs() {
    document.getElementById("removeSpinner").hidden = false
    var [data, run_starts, indexes, aliases, tags] = [{}, [], [], [], []]
    const removeRunStarts = document.getElementById("removeRunStarts").value.split(",")
    for (const runStart of removeRunStarts) {
        if (runStart == "") { continue }
        run_starts.push(runStart)
    }
    if (run_starts.length > 0) { data["run_starts"] = run_starts }
    const removeIndexes = document.getElementById("removeIndexes").value.split(";")
    for (const index of removeIndexes) {
        if (index == "") { continue }
        indexes.push(index)
    }
    if (indexes.length > 0) { data["indexes"] = indexes }
    const removeAliases = document.getElementById("removeAliases").value.split(",")
    for (const removeAlias of removeAliases) {
        if (removeAlias == "") { continue }
        aliases.push(removeAlias)
    }
    if (aliases.length > 0) { data["aliases"] = aliases }
    const removeTags = document.getElementById("removeTags").value.split(",")
    for (const removeTag of removeTags) {
        if (removeTag == "") { continue }
        tags.push(removeTag)
    }
    if (tags.length > 0) { data["tags"] = tags }
    document.getElementById("removeRunStarts").value = ""
    document.getElementById("removeIndexes").value = ""
    document.getElementById("removeAliases").value = ""
    document.getElementById("removeTags").value = ""
    const body = JSON.stringify(data)
    send_request("DELETE", "/remove-outputs", body, "removeSpinner")
}

// function to retrieve all outputs currently in the database
function get_outputs() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/get-outputs");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const runs = JSON.parse(xhr.responseText)
            let table = "<tr><th>Run Index</th><th>Run Start</th><th>Run Name</th><th>Run Alias</th><th>Run Tags</th></tr>"
            for (const [index, run] of runs.entries()) {
                table += `<tr><td>${index}</td><td>${run.run_start}</td><td>${run.name}</td><td>${run.alias}</td><td>${run.tags}</td></tr>`
            }
            document.getElementById("runTable").innerHTML = table
        } else {
            add_alert(`Error: ${xhr.status}, ${xhr.responseText}`, "danger")
        }
    };
    xhr.send();
}

// function to set the customized view config
function set_admin_json_config(notifications = true) {
    const storedSettings = JSON.parse(localStorage.getItem('adminSettings'));
    document.getElementById("applySettingsSpinner").hidden = false
    const body = JSON.stringify({
        admin_json_config: JSON.stringify(storedSettings),
    });
    send_request("POST", "set-admin-json-config", body, "applySettingsSpinner", notifications)
}

// function to get the customized view config
function get_admin_json_config() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/get-admin-json-config");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const config = JSON.parse(xhr.responseText)
            const serverSettings = config.admin_json_config;
            const storageSettings = JSON.parse(localStorage.getItem("adminSettings"));
            if (serverSettings != '{}') {
                // if there IS a serversetting use that
                adminSettings = JSON.parse(serverSettings);
                if (!storageSettings) {
                    // if there IS no local storage yet apply the serversetting to it
                    localStorage.setItem("adminSettings", JSON.stringify(adminSettings));
                }
            } else {
                // there is NO serversetting yet
                if (storageSettings) {
                    // there IS a local storage setting use that
                    adminSettings = storageSettings;
                    set_admin_json_config(false);
                }
            }
        } else {
            add_alert(`Error: ${xhr.status}, ${xhr.responseText}`, "danger")
        }
    };
    xhr.send();
}

// function to send requests (helper function for other functions that do similar server requests)
function send_request(method, endpoint, body, spinner, notifications = true) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, endpoint);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById(spinner).hidden = true
            response = JSON.parse(xhr.responseText);
            if (response.success == "1") {
                console.log(response.console)
                if (notifications) {
                    if (response.console.includes("ERROR")) {
                        add_alert("SUCCESS: The processing was handled but some errors occurred, see the browser console for more details!", "warning")
                    } else {
                        add_alert(response.message, "success")
                    }
                }
            } else {
                add_alert(response.message, "danger")
                console.log(response.console)
            }
            get_outputs()
        } else {
            document.getElementById(spinner).hidden = true
            add_alert(`Error: ${xhr.status}, ${xhr.responseText}`, "danger")
        }
    };
    xhr.send(body);
}

// function to add a logs raw data to the server and update the database
function add_log() {
    document.getElementById("addLogDataSpinner").hidden = false
    const logData = document.getElementById("logData").value
    const logName = document.getElementById("logName").value
    document.getElementById("logData").value = ""
    document.getElementById("logName").value = ""

    const body = JSON.stringify({
        log_data: logData,
        log_name: logName,
    });
    send_request("POST", "/add-log", body, "addLogDataSpinner")
}

// function to remove outputs from the database
function remove_log() {
    document.getElementById("removeLogDataSpinner").hidden = false
    const removeLog = document.getElementById("removeLog").value
    document.getElementById("removeLog").value = ""
    const body = JSON.stringify({
        log_name: removeLog,
    });
    send_request("DELETE", "/remove-log", body, "removeLogDataSpinner")
}

export {
    add_output_path,
    add_output_data,
    add_output_folder_path,
    remove_outputs,
    get_outputs,
    set_admin_json_config,
    get_admin_json_config,
    add_log,
    remove_log,
};