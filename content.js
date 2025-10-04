const elementId = 'div_dashboard_wrapper';
const button = document.createElement("button");
let handlersBound = false; // prevent duplicate listeners

// Function to hide the element by ID
function modifyElementById(id, shouldBeVisible) {
    const element = document.getElementById(id);
    if (element) {
        // Set display based on shouldBeVisible flag
        element.style.display = shouldBeVisible ? "" : "none";
    }
}

function createButton(shouldBeVisible){
    const element = document.getElementById(elementId);
    if (element) {
        const container = element.parentElement;

        // button setup
        button.type = "button"; // not strictly required but good hygiene
        button.innerText = shouldBeVisible ? "Hide Score" : "Show Score";
        button.className = "btn btn-secondary";

        // bind listeners once
        if (!handlersBound) {
            button.addEventListener("click", (e) => {
                toggleVisibility();
                // optional: drop focus so accidental keyboard presses won't hit it
                button.blur();
            });

            // ignore Enter presses on this button
            const swallowEnter = (e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            button.addEventListener("keydown", swallowEnter);
            button.addEventListener("keyup", swallowEnter);

            handlersBound = true;
        }

        container.appendChild(button);
    }
}

function toggleVisibility() {
    const element = document.getElementById(elementId);
    if (element) {
        // Toggle the display property
        element.style.display = (element.style.display === 'none' ? '' : 'none');
        // Update button text
        button.innerText = element.style.display === 'none' ? "Show Score" : "Hide Score";
        // Save the current visibility state to Chrome storage
        chrome.storage.sync.set({'isVisible': element.style.display !== 'none' });
    }
}

// Setup MutationObserver to monitor changes in the DOM
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            // Check if the added node is the target element or contains it
            if (node.id === elementId || (node.querySelector && node.querySelector(`#${elementId}`))) {
                // Retrieve visibility state from storage
                chrome.storage.sync.get('isVisible', function(data) {
                    modifyElementById(elementId, data.isVisible);
                });
            }
        });
    });
});

// Start observer
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// start
chrome.storage.sync.get('isVisible', function(data) {
    createButton(data.isVisible);
    modifyElementById(elementId, data.isVisible);
});
