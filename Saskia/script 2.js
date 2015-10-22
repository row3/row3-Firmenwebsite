var xmlHttpObject = new XMLHttpRequest();

function handleContent() {
    if (xmlHttpObject.readyState === 4) {
        document.getElementById("test").innerHTML = xmlHttpObject.responseText;
    }

}

function loadContent() {
    xmlHttpObject.open("GET", "hallo.txt");
    xmlHttpObject.onreadystatechange = handleContent;
    xmlHttpObject.send(null);
    return false;

}