var pages = document.querySelectorAll("#bilder img");
var current = 0;
var slideshow;

function resize(pic) {
    if (document.location.pathname == "/index.html") {
        document.getElementById('slideshow').setAttribute("style", "height:" +
            pic.height + "px");
        document.getElementById('prev').setAttribute("style", "height:" +
            pic.height + "px");
        document.getElementById('next').setAttribute("style", "height:" +
            pic.height + "px");
    }
}

function pageLoaded() {
    pages = document.querySelectorAll("#bilder img");
    if (pages.length != 0 && document.location.pathname == "/index.html") {
        displayImage(-1, 0);
        resize(pages[current]);
        play();
    }

}

function play() {
    slideshow = setTimeout(function () {
        nextImage();
        play();
    }, 5000);
}

function displayImage(old, current) {
    if (old >= 0)
        pages[old].style.visibility = "hidden";
    pages[current].style.visibility = "visible";
}

function previousImage() {
    var old = current;
    if (current <= 0)
        current = pages.length - 1;
    else
        current = current - 1;
    displayImage(old, current);
}

function nextImage() {
    var old = current;
    if (current >= pages.length - 1)
        current = 0;
    else
        current = current + 1;
    displayImage(old, current);
}