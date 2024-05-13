function fetchGDELTStatus() {
    fetch('./sync/gdeltStatus.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.trim().split('\n');
            // Properly extract the full date and time from the first line, assuming the format "Program Started......: 2024-05-11 11:56:44 PDT"
            const startDate = lines[0].split(': ').pop(); // This captures everything after "Program Started......: "
            const results = parseGDELTLog(data);
            updateGDELTStatusDisplay(results, startDate);
        }).catch(error => {
            console.error('Error fetching the GDELT log:', error);
            updateGDELTStatusDisplay({ status: 'error' }, "Unavailable");
        });
}

function parseGDELTLog(data) {
    const lines = data.trim().split('\n');
    // Minimal parsing example to detect if it is a standard log
    if (lines.length < 10 || !lines.some(line => line.includes("Program Finished"))) {
        return { status: 'error' };  // Not enough lines or missing key line
    }

    const metrics = {
        totalMetrics: parseInt(lines[3].split(':')[1].trim()),
        inserts: parseInt(lines[5].split(':')[1].trim()),
        updates: parseInt(lines[6].split(':')[1].trim()),
        verified: parseInt(lines[7].split(':')[1].trim()),
        miscompared: parseInt(lines[8].split(':')[1].trim())
    };

    if ((metrics.inserts + metrics.updates === metrics.totalMetrics && metrics.verified === 0) || metrics.verified === metrics.totalMetrics) {
        return { status: 'success' };
    } else if (metrics.miscompared > 0) {
        return { status: 'review', detail: 'Miscompared entries found.' };
    } else {
        return { status: 'review', detail: 'Review needed, unusual data pattern.' };
    }
}

function updateGDELTStatusDisplay(results, checkedDate) {
    const box = document.getElementById('gdeltStatusBox');
    const syncInfo = document.getElementById('gdeltSyncInfo');

    // Convert the full date string to a Date object and format it
    checkedDate = new Date(checkedDate); // Ensure this string is correct as per the input log format
    checkedDate = checkedDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    switch(results.status) {
        case 'success':
            box.style.backgroundColor = 'green';
            box.innerHTML = '<div class="sync-title">GDELT SYNC</div>' +
                            '<img src="images/platoghappy.jpeg" alt="Success">' +
                            '<div class="status-message">SUCCESS</div>';
            break;
        case 'review':
            box.style.backgroundColor = 'yellow';
            box.innerHTML = `<div class="sync-title">GDELT REVIEW</div>` +
                            `<img src="images/platopuzzled.png" alt="Review Needed">` +
                            `<p>${results.detail}</p>` +
                            '<div class="status-message">REVIEW</div>';
            break;
        default:
            box.style.backgroundColor = 'red';
            box.innerHTML = '<div class="sync-title">GDELT ERROR</div>' +
                            '<img src="images/platoerror.jpeg" alt="Error">' +
                            '<div class="status-message">ERROR</div>';
            break;
    }
    syncInfo.innerHTML = 'Last Checked:<br>' + checkedDate;
}