// theme
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    Chart.defaults.color = "#e2e1d7";
    Chart.defaults.borderColor = "rgba(255,255,255,0.1)";
    Chart.defaults.backgroundColor = "rgba(255,255,0,0.1)";
    Chart.defaults.elements.line.borderColor = "rgba(255,255,0,0.4)";
} else {
    document.getElementsByTagName("html")[0].setAttribute("data-bs-theme", "light");
}

// collapse/expand buttons
var collapsed =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 52 52"><g><path d="M17.9,4.4l20.7,20.5c0.6,0.6,0.6,1.6,0,2.2L17.9,47.6c-0.6,0.6-1.6,0.6-2.2,0l-2.2-2.2c-0.6-0.6-0.6-1.6,0-2.2l16.3-16.1c0.6-0.6,0.6-1.6,0-2.2L13.6,8.8c-0.6-0.6-0.6-1.6,0-2.2l2.2-2.2C16.4,3.9,17.3,3.9,17.9,4.4z"></path></g></svg>';
var expanded =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 52 52"><path d="M47.6,17.8L27.1,38.5c-0.6,0.6-1.6,0.6-2.2,0L4.4,17.8c-0.6-0.6-0.6-1.6,0-2.2l2.2-2.2c0.6-0.6,1.6-0.6,2.2,0l16.1,16.3c0.6,0.6,1.6,0.6,2.2,0l16.1-16.2c0.6-0.6,1.6-0.6,2.2,0l2.2,2.2C48.1,16.3,48.1,17.2,47.6,17.8z"/></svg>';

update_collapse_button("runDetailsButton");
update_collapse_button("suiteDetailsButton");
update_collapse_button("testDetailsButton");
update_collapse_button("keywordDetailsButton");

// colors
var passedBackgroundColor = "#97bd61";
var skippedBackgroundColor = "#fed84f";
var failedBackgroundColor = "#ce3e01";
var greyBackgroundColor = "#212529";

document.getElementById("runDetailsButton").addEventListener("click", (e) => {
    update_collapse_button("runDetailsButton");
});
document.getElementById("suiteDetailsButton").addEventListener("click", (e) => {
    update_collapse_button("suiteDetailsButton");
});
document.getElementById("testDetailsButton").addEventListener("click", (e) => {
    update_collapse_button("testDetailsButton");
});
document.getElementById("keywordDetailsButton").addEventListener("click", (e) => {
    update_collapse_button("keywordDetailsButton");
});

function update_collapse_button(id) {
    if (document.getElementById(id).className.includes("collapsed")) {
        document.getElementById(id).innerHTML = collapsed;
    } else {
        document.getElementById(id).innerHTML = expanded;
    }
}
