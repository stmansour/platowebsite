/**
 * Status Handlers for the nightly updates of PLATO SQL database
 * from the Trading Economics API.
 */

function fetchStatus() {
    fetch('./sync/status.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        }).then(data => {
            const box = document.getElementById('statusBox');
            const syncInfo = document.getElementById('syncinfo');
            let lastUpdated = data.split('-')[1].trim();  // Extract the date part after the hyphen

            let statusMessage = 'FAILED';
            let imageFile = 'images/platosad.jpeg';
            if (data.includes("Success")) {
                statusMessage = 'SUCCESS';
                imageFile = 'images/platohappy.jpeg';
                box.className = 'success';
            } else {
                box.className = 'failure';
            }
            box.innerHTML = '<div class="sync-title">TE SYNC</div><img src="' +
                imageFile + '" alt="' + statusMessage +
                '"><div class="status-message">' + statusMessage + '</div>';
            syncInfo.innerHTML = 'Last Updated:<br>' + lastUpdated; // Update the syncinfo text
        }).catch(error => {
            console.error('Error fetching the status:', error);
            const box = document.getElementById('statusBox');
            const syncInfo = document.getElementById('syncinfo');
            box.className = 'error';
            box.innerHTML = '<div class="sync-title">SYNC</div><img src="images/platoerror.jpeg" alt="Error">' +
                '<div class="status-message">ERROR</div>';
            syncInfo.textContent = 'Update unavailable';
        });
}
