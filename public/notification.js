/*
Creating a centralized notification system for the website.
*/

function showPopup(message, type) {
    let container = document.getElementById("notification-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        container.style.position = "fixed";
        container.style.top = "10px";
        container.style.width= "440px";
        container.style.zIndex = "1000";
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        document.body.appendChild(container);
    }
    // Create a new popup element
    const popup = document.createElement("div");
    popup.classList.add("popup");

    // Style the popup based on the type (error, success, etc.)
    if (type === 'error') {
        popup.classList.add('error');  // Red for errors
    } else if (type === 'success') {
        popup.classList.add('success');  // Green for success
    } else {
        popup.classList.add('info');  // Blue for general messages
    }

    // Add message to popup
    popup.textContent = message;

    // Append the popup to the container
    container.appendChild(popup);
    console.log(popup);

    setTimeout(() => {
        popup.classList.add("show");
    }, 100);

    // Automatically hide the popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove("show");
        popup.classList.add("hide");
        setTimeout(() => {
            container.removeChild(popup);
        }, 500); // Wait for fade-out transition before removing from DOM
    }, 3000);
}
