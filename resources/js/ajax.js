// Timer to check when DOM is ready.
var readyStateCheckInterval = self.setInterval(function () {
    // Check if DOM ready.
    if (document.readyState === "complete") {
        // When DOM ready, destroy timer and execute setupLinks() function.
        clearInterval(readyStateCheckInterval);
        setupLinks();

        // Attach event listeners for browser history and hash changes.
        popStateHandler();
    }
}, 10);

function setupLinks() {
    // Send our predefined link elements to ajaxify_link() function.
    ajaxify_link(document.getElementById("home-link"));
    ajaxify_link(document.getElementById("contact-link"));
    ajaxify_link(document.getElementById("news-link"));
    ajaxify_link(document.getElementById("company-link"));
    ajaxify_link(document.getElementById("impressum-link"));
    ajaxify_link(document.getElementById("tutorials-link"));
}

/*
 * Function to add click event to elements.
 * Modifies browser URL and pulls content using XMLRequestObject.
 * Default click is disabled - thus browser is not redirected to href.
 */
function ajaxify_link(link_element) {

    // Destroy any currently bound click events to this element.
    link_element.onclick = function () {
        return false;
    }

    // IE8
    if (!link_element.addEventListener) {
        link_element.attachEvent("onclick", function (e) {
            // Prevent default browser action on click.
            // This will stop the browser redirecting to  the HREF value.
            e.returnValue = false;

            // Change URL within browser address bar.
            changeBrowserURL(link_element);

            // Get page and replace current content.
            getPage(link_element.href);
        }, false);
    }

    // FF, Chrome, Safari, IE9.
    else {
        link_element.addEventListener("click", function (e) {
            // Prevent default browser action on click.
            // This will stop the browser redirecting to  the HREF value.
            e.preventDefault();

            // Change URL within browser address bar.
            changeBrowserURL(link_element);

            // Get page and replace current content.
            getPage(link_element.href);
        }, false);
    }
}

/*
 * Function to modify URL within browser address bar.
 */
function changeBrowserURL(dom_element) {
    // Change URL with browser address bar using the HTML5 History API.
    if (window.location != dom_element.getAttribute("href")) {
        if (history.pushState) {
            // Parameters: data, page title, URL
            history.pushState(null, null, dom_element.href);
        }
        // Fallback for non-supported browsers.
        else {
            document.location.hash = dom_element.getAttribute("href");
        }
    }
}

/*
 * Function to fetch page via URL.
 */
function getPage(link_url) {
    // Get content using XMLHttpRequest object.
    XMLHttp = new XMLHttpRequest();

    // Set the request type, URL and enable asynchronous mode
    XMLHttp.open("GET", link_url, true);

    // Send the request to the server.
    XMLHttp.send();


    // Wait for request
    XMLHttp.onreadystatechange = function () {
        if (XMLHttp.readyState == 4 && XMLHttp.status == 200) {

            // The response we receive is not in XML format. So we cannot 
            // use the DOM to extract what we need directly.
            // Thus we assign it to a new element first.
            var dom_response_holder = document.createElement("MAIN");

            // Remember to use 'responseText' instead of 'response', as this won't work in IE.
            dom_response_holder.innerHTML = XMLHttp.responseText;

            // Now extract what we need using the DOM.
            var new_container_element = dom_response_holder.getElementsByTagName("MAIN")[0].innerHTML;

            // Replace current content.
            document.getElementById("main-container").innerHTML = new_container_element;


            pageLoaded();

            // Rebuild links, to ensure all links are bound correctly.
            //setupLinks();
        }
    }
}

/*
 * Function to detect when back and forward buttons clicked.
 *
 * This function will allow us to load content on the fly, as
 * the browser cannot re-render the AJAX content between state changes.
 */
function popStateHandler() {
    // FF, Chrome, Safari, IE9.
    if (history.pushState) {
        // Event listener to capture when user pressing the back and forward buttons within the browser.
        window.addEventListener("popstate", function (e) {
            // Get the URL from the address bar and fetch the page.
            getPage(document.URL);
        });
    }

    // IE8.
    else {
        // Event listener to capture address bar updates with hashes.
        window.attachEvent("onhashchange", function (e) {
            // Extract the hash
            location_url = window.location.hash;

            // Remove the # symbol.
            location_url = location_url.substring(1);

            // Fetch page using the constructed URL.
            getPage(location_url);
        });
    }
}