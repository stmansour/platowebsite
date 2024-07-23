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
            const lines = data.split('\n');
            let firstLine = lines[0];
            let ss = firstLine.split('-');
            if  (ss.length > 1) {
                firstLine = ss[1];
                dateString = firstLine.trim();
            }

            // Manually parse the date string to a Date object
            let lastUpdated = new Date(Date.parse(dateString));

            // Format the date into a more readable form
            lastUpdated = lastUpdated.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            let statusMessage = 'FAILED';
            let imageFile = 'images/platosad.jpg';
            if (lines[0].toLocaleLowerCase().includes("success")) {
                statusMessage = 'SUCCESS';
                imageFile = 'images/platohappy.jpg';
                box.className = 'success';
            } else {
                box.className = 'failure';
            }
            box.innerHTML = '<div class="sync-title">TE SYNC</div><img src="' +
                imageFile + '" alt="' + statusMessage +
                '"><div class="status-message">' + statusMessage + '</div>';

            syncInfo.innerHTML = 'Last Updated: <b>' + lastUpdated + '</b>';

            // Add any additional lines from the status.txt file
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() !== '') {
                    syncInfo.innerHTML += '<br>' + lines[i];
                }
            }
        }).catch(error => {
            console.error('Error fetching the status:', error);
            const box = document.getElementById('statusBox');
            const syncInfo = document.getElementById('syncinfo');
            box.className = 'error';
            box.innerHTML = '<div class="sync-title">SYNC</div><img src="images/platopuzzled.jpg" alt="Error">' +
                '<div class="status-message">ERROR</div>';
            syncInfo.textContent = 'Update unavailable';
        });
}
