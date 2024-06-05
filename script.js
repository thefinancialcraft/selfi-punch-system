function displayGreeting() {
  const greetElement = document.getElementById('mob-greet');
  const greeting = getGreeting();
  typeGreeting(greeting, greetElement);
}

window.onload = displayGreeting;
function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let greeting;
  
    if (hours < 12) {
      greeting = "Good Morning!";
    } else if (hours < 17) {
      greeting = "Good Afternoon!";
    } else {
      greeting = "Good Evening!";
    }
  
    return greeting;
  }
  
  function typeGreeting(text, element, delay = 100, callback) {
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, delay);
      } else if (callback) {
        setTimeout(callback, 1000); // Wait for 1 second before calling the callback
      }
    }
    type();
  }
  
  function removeContent(element, callback) {
    element.style.opacity = '0';
    setTimeout(() => {
      element.textContent = "";
      element.style.opacity = '1';
      if (callback) {
        callback();
      }
    }, 500); // Wait for the fade out to complete
  }
  
  function displayGreeting() {
    const greetElement = document.getElementById('mob-greet');
    const greeting = getGreeting();
  
    removeContent(greetElement, () => {
      typeGreeting(greeting, greetElement, 100, () => {
        const extraTexts = [
          "Welcome Back!",
          "The Financial Craft",
          "Selfie Punching System"
        ];
  
        let currentTextIndex = 0;
  
        function displayNextText() {
          if (currentTextIndex < extraTexts.length) {
            removeContent(greetElement, () => {
              typeGreeting(extraTexts[currentTextIndex], greetElement, 100, displayNextText);
              currentTextIndex++;
            });
          } else {
            displayGreeting(); // Repeat the greeting animation
          }
        }
  
        displayNextText();
      });
    });
  }
  
  window.onload = displayGreeting;
  
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    // Pad minutes and seconds with leading zeros if needed
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    const timeElement = document.getElementById('time');
    timeElement.textContent = `${hours}:${paddedMinutes}:${paddedSeconds} ${ampm}`;
}

// Function to update the date and weekday
function updateDat() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = now.getMonth() + 1; // Months are zero-based
    const year = now.getFullYear();
    const dateElement = document.getElementById('date');
    dateElement.textContent = `${dayName}, ${date}/${month}/${year}`;
}

// Update the clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);

// Update the date immediately and then every second
updateDat();
setInterval(updateDate, 1000);

let texts = ['Signin to Your Account', 'Mark Your Attendance'];
let index = 0;
const textElement = document.querySelector('.text-p');

function changeText() {
    textElement.textContent = texts[index];
    index = (index + 1) % texts.length;
}

function animateText() {
    textElement.style.animation = 'none'; // Reset animation
    setTimeout(() => {
        textElement.style.animation = 'zoomInOut 2s ease-in-out infinite alternate';
        changeText();
    }, 2000); // Change the delay (in milliseconds) here
}

function updateTexts(newTexts) {
    texts = newTexts;
    index = 0; // Reset index
    animateText();
}

// Initial animation
animateText();

// Example functions to update texts
function login() {
    updateTexts(['Hit Punch-In Button', 'Mark Your Attendance']);
}

function punchin() {
    updateTexts(['Click Check-In Button', 'Say Cheese']);
}

function checkin() {
    updateTexts(['Processing... Please Wait.']);
    document.getElementById
}
function checkoutupdate() {
  updateTexts(['Attendance successfully marked!']);
  document.getElementById
}

// Call these functions based on your triggers
// login();
// punchin();
// checkin();



      

        
      let rotateInterval;
      let totalRotation = 0; // total rotation angle
      let rotations = 0; // number of rotations
    
      function startRotation(rotationType) {
        clearInterval(rotateInterval);
    
        let direction = -1; // Initial rotation direction (1 for clockwise, -1 for counterclockwise)
        let rotationAmount = 360; // Default rotation amount
        let speed = 1; // Default speed
    
        if (rotationType === 'backward') {
          direction = -1; // Change direction to counterclockwise for backward rotation
        } else if (rotationType === 'slow') {
          speed = 0.5; // Slow down the rotation speed
        } else if (rotationType === 'fast') {
          speed = 2; // Speed up the rotation speed
        } else if (rotationType === 'stop-go') {
          speed = 0.1; // Slow speed for stop and go effect
          setTimeout(() => {
            speed = 1; // Resume normal speed after 1 second
          }, 1000);
        }
    
        rotateInterval = setInterval(() => {
          totalRotation += speed * direction; // Update total rotation
    
          document.querySelector('.circular-progress').style.transform = `rotate(${totalRotation}deg)`;
        }, 50); // Rotate every 50 milliseconds
    
        // Stop rotation after 10 seconds
        setTimeout(() => {
          clearInterval(rotateInterval);
          document.querySelector('.circular-progress').style.transform = 'rotate(0deg)';
        }, 10000);
        
        // Increment rotations
        rotations++;
        console.log("Rotations:", rotations);
      }
    
      // Start initial rotation
      startRotation();
    
      // Restart rotation on progress container click
      document.querySelector('.prg-cont').addEventListener('click', () => startRotation('fast'));
      document.querySelector('.prg-cont').addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent default right-click menu
        startRotation('backward');
      });
      document.querySelector('.prg-cont').addEventListener('wheel', (event) => {
        if (event.deltaY < 0) {
          startRotation('slow');
        } else {
          startRotation('fast');
        }
      });
      document.querySelector('.prg-cont').addEventListener('mouseover', () => startRotation('stop-go'));
      document.querySelector('.prg-cont').addEventListener('mouseleave', () => clearInterval(rotateInterval));

//camera part

document.getElementById('punchin').addEventListener('click', function() {
  var startButton = document.getElementById('punchin');
  startButton.style.display = 'none';
  document.getElementById("img-msg-video").style.display = "none";
  document.getElementById("video").style.display = "block";
  
  var videoContainer = document.getElementById('video-container');
  videoContainer.style.display = 'block';
  document.getElementById('checkin').style.display = 'block';
  
  var video = document.getElementById('video');
  video.style.width = '85vw';
  video.style.height = '65vw';

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
  var ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

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
  video.style.display = 'none';
  video.srcObject.getVideoTracks().forEach(track => track.stop());

  // Hide the "Punch" button
  document.getElementById('checkin').style.display = 'none';
  document.getElementById("checkout").style.display = "block";

  // document.getElementById('atnst').style.backgroundColor = '#ffff7a';
  // document.getElementById('patnst').style.color = '#cfcf3e';
  // document.getElementById('h1atnst').style.color = '#cfcf3e';

  // Check if the current time is greater than 10:01 AM after 5 seconds
 // Get the current time in hours and minutes
 function updateStatus() {
  // Get the current time in hours and minutes
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  // Check the current time and set the status accordingly
  let status = '';
  if (formattedTime >= '06:00' && formattedTime < '10:01') {
    status = 'P';
  } else if (formattedTime >= '10:01' && formattedTime < '10:31') {
    status = 'L';
  } else if (formattedTime >= '10:31' && formattedTime < '20:00') {
    status = 'H';
  } else {
    status = 'S';
  }

  // Update the status elements
  document.getElementById('patnst').innerText = status === 'S' ? 'Status' : (status === 'H' ? 'Halfday' : (status === 'L' ? 'Late' : 'On-Time'));
  document.getElementById('h1atnst').innerText = status === 'S' ? 'S' : (status === 'H' ? 'H' : (status === 'L' ? 'L' : 'P'));
  
  // Update the background color based on status
  let bgColor = '';
  let textColor = '';
  switch(status) {
    case 'P':
      bgColor = '#7bff83';
      textColor = '#00d30e';
      break;
    case 'L':
      bgColor = '#ffff63';
      textColor = '#cbcb2b';
      break;
    case 'H':
      bgColor = '#ffc56f';
      textColor = '#d9942e';
      break;
    default:
      bgColor = '#e8e8e8';
      textColor = '#a2a2a2';
  }
  document.getElementById('atnst').style.backgroundColor = bgColor;
  document.getElementById('patnst').style.color = textColor;
  document.getElementById('h1atnst').style.color = textColor;
}

// Update the status every second (1000 milliseconds)
setInterval(updateStatus, 1000);

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
    checkoutupdate(); // Run checkoutupdate function before the rest of the code

    setTimeout(() => {
        console.log('Attendance recorded. Click OK to update on WhatsApp. Have a great day!');
        // Display or use the link as needed
        alert('Attendance recorded. Click OK to update on WhatsApp. Have a great day! ');

        // Enable and change the color of the checkout button after generating the Google Drive URL
        var checkoutButton = document.getElementById('checkout');
        checkoutButton.disabled = false;
        checkoutButton.classList.add('active');

        // Create the WhatsApp message function
        function sendWhatsAppMessage() {
          // Get the user ID and timestamp
          var userId = document.getElementById('user-id').value;
          var now = new Date();
          var formattedDate = now.getDate().toString().padStart(2, '0') + '/' +
                              (now.getMonth() + 1).toString().padStart(2, '0') + '/' +
                              now.getFullYear();
          var formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
          var timestamp = formattedDate + ' ' + formattedTime;
        
          // Get the value from the patnst element
          var patnstValue = document.getElementById('patnst').innerText;
        
          // Construct the message with formatted text
          var message = '*Reached*, ' + userId + '\n' +
                        'Date: ' + formattedDate + '\n' +
                        'Time: ' + formattedTime + '\n' +
                        'Status: *' + patnstValue + '*\n' +
                        'Google Drive Link: ' + link;
        
          // Encode the message for the URL
          var encodedMessage = encodeURIComponent(message);
        
          // Create the WhatsApp URL
          var whatsappUrl = 'https://wa.me/?text=' + encodedMessage;
        
          // Redirect to the WhatsApp URL
          window.open(whatsappUrl, '_blank');
        }
        
        // Call the function initially
        sendWhatsAppMessage();
        
        

        // Add event listener to the checkout button
        checkoutButton.addEventListener('click', sendWhatsAppMessage);
    }, 3000); // Delay of 1 second (1000 milliseconds)
})

  .catch(error => {
      console.error('Error saving image to Google Drive: ', error);
  });
});



function updateTime() {
const now = new Date();
let hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
const ampm = hours >= 12 ? 'PM' : 'AM';

hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'
const strHours = hours < 10 ? '0' + hours : hours;
const strMinutes = minutes < 10 ? '0' + minutes : minutes;
const strSeconds = seconds < 10 ? '0' + seconds : seconds;

const timeString = `${strHours}<span id="blink" style="margin-bottom: 14vw;">:</span>${strMinutes} ${ampm}`;
document.getElementById('loginaftrtime').innerHTML = timeString;
setInterval(blinkColon, 1000);
}

function blinkColon() {
const colon = document.getElementById('blink');
colon.style.visibility = (colon.style.visibility === 'hidden' ? 'visible' : 'hidden');
}

updateTime();


setInterval(updateTime, 1000);
updateTime(); // initial call to display time immediately

function updateDate() {
const now = new Date();

// Get and format the date
const day = now.getDate();
const month = now.getMonth() + 1; // months are zero-based
const year = now.getFullYear();
const strDay = day < 10 ? '0' + day : day;
const strMonth = month < 10 ? '0' + month : month;
const dateString = `${strDay}`;

// Update the HTML element
document.getElementById('crntdate').textContent = dateString;
}

updateDate();

function updateMonth() {
const now = new Date();

// Get and format the month
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const currentMonth = monthNames[now.getMonth()];

// Update the HTML element
document.getElementById('currentmonth').textContent = currentMonth;
}

updateMonth(); 
function updateYear() {
const now = new Date();
const currentYear = now.getFullYear();

document.getElementById('crntyr').textContent = currentYear;
}

updateYear(); // initial call to display the year immediately punchin

//login funtion

document.getElementById("login").addEventListener("click", async function() {
const userId = document.getElementById('user-id').value;
if (!userId) {
  alert('Please enter a User ID');
  return;
}

try {
  const response = await fetch('data.json');
  const data = await response.json();

  const user = data.find(user => user['User Name'] === userId);

  if (user) {
    document.querySelector('.user-name-nav').textContent = user['User Name'];
    document.getElementById('emcd').textContent = user['Emp. Code'];
    document.getElementById('embg').textContent = user['Blood Grp'];
    document.getElementById('emcntno').textContent = user['Contact No.'];

    // Visual transitions
    document.querySelector(".login-nav").style.display = "none";
    document.querySelector(".login-nav-after").style.display = "flex";
    document.getElementById("login").style.display = "none";
    document.getElementById("before-login").style.display = "none";
    document.getElementById("afterlogin").style.display = "flex";
    document.getElementById("video-container").style.display = "flex";
    document.getElementById("message").style.backgroundColor = "rgb(0 153 255)";
    document.getElementById("selfi-img").style.display = "none";
    document.getElementById("user-id").setAttribute("readonly", true);
    document.getElementById("punchin").style.display = "block";
  } else {
    alert('User not found');
  }
} catch (error) {
  console.error('Error fetching data:', error);
}
});


// logout funtion

function logout(){
document.querySelector(".login-nav").style.display = "flex";
document.querySelector(".login-nav-after").style.display = "none";
document.getElementById("login").style.display = "block";
document.getElementById("before-login").style.display = "flex";
document.getElementById("afterlogin").style.display = "none";
var userIdInput = document.getElementById("user-id");
userIdInput.removeAttribute("readonly");
userIdInput.value = ""; // Isse input field ka value clear ho jayega

document.getElementById("video-container").style.display = "none";
document.getElementById("selfi-img").style.display = "block";
document.getElementById("message").style.backgroundColor = "#fff";
document.getElementById("checkout").style.display = "none";
document.getElementById("punchin").style.display = "none";
document.getElementById("checkin").style.display = "none";
video.srcObject.getVideoTracks().forEach(track => track.stop());




window.location.reload();

}

//dropdown
const userIdInput = document.getElementById('user-id');
const userDropdown = document.getElementById('user-dropdown');
let selectedIndex = -1;

userIdInput.addEventListener('input', async function() {
const userInput = userIdInput.value.trim().toLowerCase();
if (!userInput) {
  userDropdown.innerHTML = '';
  userDropdown.classList.remove('show');
  selectedIndex = -1;
  return;
}

try {
  const response = await fetch('data.json');
  const data = await response.json();
  const filteredUsers = data.filter(user => user['User Name'].toLowerCase().includes(userInput));

  if (filteredUsers.length > 0) {
    const dropdownContent = filteredUsers.map((user, index) => `<div class="user-item ${selectedIndex === index ? 'selected' : ''}">${user['User Name']}</div>`).join('');
    userDropdown.innerHTML = dropdownContent;
    userDropdown.classList.add('show');
    selectedIndex = filteredUsers.length - 1; // Start from the last item
    updateSelectedUser(document.querySelectorAll('.user-item'));
  } else {
    userDropdown.innerHTML = '<div>No matching users found.</div>';
    userDropdown.classList.remove('show');
    selectedIndex = -1;
  }
} catch (error) {
  console.error('Error fetching or parsing data:', error);
}
});

userDropdown.addEventListener('click', function(event) {
const selectedUser = event.target.textContent;
userIdInput.value = selectedUser;
userDropdown.classList.remove('show');
});

userIdInput.addEventListener('keydown', function(event) {
const userItems = document.querySelectorAll('.user-item');
if (userItems.length === 0) return;

if (event.key === 'ArrowDown') {
  event.preventDefault();
  selectedIndex = Math.min(selectedIndex + 1, userItems.length - 1); // Move down the list
  updateSelectedUser(userItems);
} else if (event.key === 'ArrowUp') {
  event.preventDefault();
  selectedIndex = Math.max(selectedIndex - 1, 0); // Move up the list
  updateSelectedUser(userItems);
} else if (event.key === 'Enter' && selectedIndex >= 0) {
  userIdInput.value = userItems[selectedIndex].textContent;
  userDropdown.classList.remove('show');
  userIdInput.focus();
}
});

function updateSelectedUser(userItems) {
userItems.forEach((item, index) => {
  if (index === selectedIndex) {
    item.classList.add('selected');
  } else {
    item.classList.remove('selected');
  }
});
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
if (!event.target.closest('#user-dropdown') && !event.target.closest('#user-id')) {
  userDropdown.classList.remove('show');
}
});


