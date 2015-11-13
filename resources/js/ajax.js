// Timer wird erstellt, der das DOM checkt
var readyStateCheckInterval = self.setInterval(function () {
    // überprüfe, ob DOM bereit
    if (document.readyState === "complete") {
        // Wenn DOM bereit, lösche den Timer und führe die Funktionen aus
        clearInterval(readyStateCheckInterval);
        setupLinks();
        pageLoaded();

        // erstelle Eventhandler für History
        popStateHandler();
    }
}, 10);

function setupLinks() {
    // nehme alle Links der Seite
    var links = document.querySelectorAll("a");

    for (var i = 0; i < links.length; i++) {
        if (links[i].id != "jump" && links[i].id != "jumpback")
            ajaxify_link(links[i])
    }
}

/*
 * Funktion, die den Links "onClick-Events" zufügt
 * Browser URL wird geändert und der Content per XMLRequestObject geladen
 * Der "normale" Link wird deaktiviert, damit der Browser nicht zum href weiterleitet
 */
function ajaxify_link(link_element) {

    // Alle onClick-Events werden entfernt
    link_element.onclick = function () {
        return false;
    }

    link_element.addEventListener("click", function (e) {
        // verhindert die Weiterleitung
        e.preventDefault();

        // Browser-URL wird geändert
        changeBrowserURL(link_element);

        // bekomm die Seite und ersetz den Content
        getPage(link_element.href);
    }, false);

}

/*
 * Funktion, um die URL im Browser zu ändern
 */
function changeBrowserURL(dom_element) {
    // Änderung der URL mit der HTML5 History API.
    if (window.location != dom_element.getAttribute("href")) {
        if (history.pushState) {
            history.pushState(null, null, dom_element.href);
        }
    }
}

/*
 * Funktion, um mittels der URL die Seite zu laden.
 */
function getPage(link_url) {
    // Bekomme den Seiteninhalt über ein XMLHttpRequest object.
    XMLHttp = new XMLHttpRequest();
    XMLHttp.open("GET", link_url, true);
    XMLHttp.send();

    // Warte auf die Antwort
    XMLHttp.onreadystatechange = function () {
        if (XMLHttp.readyState == 4 && XMLHttp.status == 200) {

            // "Konvertierung" von XML in HTML
            var dom_response_holder = document.createElement("MAIN");
            dom_response_holder.innerHTML = XMLHttp.responseText;
            var new_container_element = dom_response_holder.getElementsByTagName("MAIN")[0].innerHTML;

            // Ersetzen des alten Content
            document.getElementById("main-container").innerHTML = new_container_element;

            // Funktionsaufruf
            clearTimeout(slideshow);
            pageLoaded();
        }
    }
}

/*
 * Funktion für die History API
 */
function popStateHandler() {
    // Event listener für den Klick auf den Zurück-Button
    window.addEventListener("popstate", function (e) {
        // Mit der neuen URL den Seiteninhalt nachladen.
        getPage(document.URL);
    });

}