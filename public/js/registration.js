let sidBar = document.getElementById("bar");

function Hfunction() {

    if (window.innerWidth <= 375) {
        if (sidBar.style.width === "75vw") sidBar.style.width = "0";
        else sidBar.style.width = "75vw";
    }
    else if (window.innerWidth <= 500) {
        if (sidBar.style.width === "50vw") sidBar.style.width = "0";
        else sidBar.style.width = "50vw";
    } else if (window.innerWidth <= 600) {
        if (sidBar.style.width === "40vw") sidBar.style.width = "0";
        else sidBar.style.width = "40vw";
    } else if (window.innerWidth <= 900) {
        if (sidBar.style.width === "30vw") sidBar.style.width = "0";
        else sidBar.style.width = "30vw";
    } else {
        if (sidBar.style.width === "18vw") sidBar.style.width = "0";
        else sidBar.style.width = "18vw";
    }
}