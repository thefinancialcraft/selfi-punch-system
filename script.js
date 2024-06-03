document.getElementById('punchin').addEventListener('click', function() {
    var startButton = document.getElementById('punchin');
    startButton.style.display = 'none';
    document.getElementById("img-msg-video").style.display = "none";
    document.getElementById("video").style.display = "block";
    
    var videoContainer = document.getElementById('video-container');
    videoContainer.style.display = 'block';
    document.getElementById('checkin').style.display = 'block';
    
    var video = document.getElementById('video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        }).catch(function(error) {
            console.log("Error accessing webcam: ", error);
        });
    }
});

document.getElementById('checkin').addEventListener('click', function() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var videoContainer = document.getElementById('video-container');
    var ctx = canvas.getContext('2d');
    
    // Match the canvas size to the video container size
    canvas.width = videoContainer.offsetWidth;
    canvas.height = videoContainer.offsetHeight;

    var now = new Date();
    var formattedDate = now.getDate().toString().padStart(2, '0') + '/' +
                        (now.getMonth() + 1).toString().padStart(2, '0') + '/' +
                        now.getFullYear();
    var formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    var timestamp = formattedDate + ' ' + formattedTime; // Get the current date and timestamp in DD/MM/YYYY hh:mm:ss am/pm format

    // Start drawing the watermark in real-time
    function drawWatermark() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
        
        // Flip the video horizontally by scaling context negatively
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // Add real-time date and time watermark
        ctx.font = '10vw Arial'; // Set font size to 10vw
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        var textWidth = ctx.measureText(timestamp).width;
        ctx.fillText(timestamp, (canvas.width - textWidth) / 2, canvas.height / 2);

        requestAnimationFrame(drawWatermark); // Request next frame
    }

    drawWatermark(); // Start the drawing loop

    var snapshot = document.getElementById('snapshot');
    snapshot.src = canvas.toDataURL('image/png');
    snapshot.style.display = 'block';
    snapshot.style.width = videoContainer.offsetWidth + 'px'; // Match snapshot width to video container width
    snapshot.style.height = videoContainer.offsetHeight + 'px'; // Match snapshot height to video container height
    video.style.display = 'none';
    video.srcObject.getVideoTracks().forEach(track => track.stop());

    // Hide the "Punch" button
    document.getElementById('checkin').style.display = 'none';
    document.getElementById("checkout").style.display = "block";

    // Get the input value
    var userId = document.getElementById('user-id').value;

    // Send the snapshot and additional data to Google Apps Script
    var imageData = canvas.toDataURL('image/png').split(',')[1];
    var url = 'https://script.google.com/macros/s/AKfycbxVny2yS526pOjQDgjIpdkaGfT7GjGCqmkoIzsTFOeY5GTTt7zMzWezxMtWf3sTxISI/exec'; // Replace with your Google Apps Script URL

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'imageData=' + encodeURIComponent(imageData) + 
              '&userId=' + encodeURIComponent(userId) + 
              '&timestamp=' + encodeURIComponent(timestamp)
    })
    .then(response => response.text())
    .then(link => {
        console.log('Attendance recorded. Click OK to update on WhatsApp. Have a great day!');
        // Display or use the link as needed
        alert('Attendance recorded. Click OK to update on WhatsApp. Have a great day! ');

        // Create the WhatsApp message
        var message = '*Reached*, ' + userId + ', ' + timestamp + '\nGoogle Drive Link: ' + link;

        // Encode the message for the URL
        var encodedMessage = encodeURIComponent(message);

        // Create the WhatsApp URL
        var whatsappUrl = 'https://wa.me/?text=' + encodedMessage;

        // Redirect to the WhatsApp URL
        window.open(whatsappUrl, '_blank');

    })
    .catch(error => {
        console.error('Error saving image to Google Drive: ', error);
    });
});
