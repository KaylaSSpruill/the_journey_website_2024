document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('journal-entry-form');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            alert("Journal Entry Submitted!");

            // Get the values from the form inputs
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;

            // Check if local storage is available
            if (typeof (Storage) !== "undefined") {
                // Create an array to store the entries
                let entries = JSON.parse(localStorage.getItem('journal_entries')) || [];

                // Add the new entry to the array
                entries.push({ title, content });

                // Save the updated array to local storage
                localStorage.setItem('journal_entries', JSON.stringify(entries));

                // Clear the form
                // form.reset();
            } else {
                alert('Local storage is not supported in your browser.');
            }
        });
    }

    
});



