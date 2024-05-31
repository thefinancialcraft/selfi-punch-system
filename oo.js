let userIdInput = document.getElementById('user-id');
let dropdownOptions = document.getElementById('dropdown-options');
let currentFocus = -1;
let stream = null; // To hold the media stream

// Initialize attendanceData from localStorage or an empty array
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];

// Function to fetch users from the 'user-table'
function fetchUsers() {
    let users = [];
    const userTable = document.getElementById('user-table');
    const rows = userTable.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header row
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length > 0) {
            users.push(cells[0].innerText.trim());
        }
    }
    return users;
}

// Remove users who are already in attendanceData from the list of users
function filterUsers(users) {
    attendanceData.forEach(data => {
        const index = users.indexOf(data.user);
        if (index !== -1) {
            users.splice(index, 1);
        }
    });
    return users;
}

// Function to save attendance data to localStorage
function saveAttendanceData() {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
}

// Populate the dropdown with remaining users
userIdInput.addEventListener('input', function () {
    const users = filterUsers(fetchUsers());
    const value = this.value.toLowerCase();
    dropdownOptions.innerHTML = '';
    const filteredUsers = users.filter(user => user.toLowerCase().includes(value)).slice(0, 3);
    filteredUsers.forEach((user, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.textContent = user;
        optionDiv.dataset.value = user; // Set data attribute to identify the user
        optionDiv.classList.add('dropdown-item');
        optionDiv.addEventListener('click', function () {
            userIdInput.value = user;
            dropdownOptions.innerHTML = '';
            dropdownOptions.style.display = 'none';
            startButton.click(); // Trigger start button click when selecting from dropdown
        });
        dropdownOptions.appendChild(optionDiv);
    });
    dropdownOptions.style.display = filteredUsers.length ? 'block' : 'none';
});

userIdInput.addEventListener('keydown', function (e) {
    const items = dropdownOptions.getElementsByClassName('dropdown-item');
    if (e.key === 'ArrowDown') {
        currentFocus++;
        addActive(items);
    } else if (e.key === 'ArrowUp') {
        currentFocus--;
        addActive(items);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocus > -1 && items[currentFocus]) {
            items[currentFocus].click();
        } else {
            startButton.click(); // Trigger start button click when pressing Enter
        }
    }
});

function addActive(items) {
    if (!items) return false;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add('active');
}

function removeActive(items) {
    for (let item of items) {
        item.classList.remove('active');
    }
}

document.addEventListener('click', function (event) {
    if (!event.target.closest('.dropdown-container')) {
        dropdownOptions.style.display = 'none';
    }
});

// Camera functionality
const message = document.getElementById('message');
const videoContainer = document.getElementById('video-container');
const video = document.getElementById('video');
const snapshot = document.getElementById('snapshot');
const startButton = document.getElementById('start');
const captureButton = document.getElementById('capture');
const logoutButton = document.getElementById('logout');
const downloadLink = document.getElementById('downloadLink');
const attendanceTableBody = document.getElementById('attendance-table-body');
const resetButton = document.getElementById('reset');

let snapshotBlobURL = ''; // Variable to store the snapshot Blob URL

// Start the camera when the start button is clicked
startButton.addEventListener('click', function () {
    const selectedUser = userIdInput.value.trim();
    if (!selectedUser || !filterUsers(fetchUsers()).includes(selectedUser)) {
        alert('Invalid user ID');
        location.reload();
        return;
    }

    // Lock the user input
    userIdInput.disabled = true;

    message.style.display = 'none';
    videoContainer.style.display = 'block';
    startButton.style.display = 'none';
    captureButton.style.display = 'inline-block';

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (mediaStream) {
            stream = mediaStream;
            video.srcObject = stream;
            video.play();
        });
    }
});

// Function to capture a snapshot
captureButton.addEventListener('click', function () {
    const user = userIdInput.value.trim();
    if (!user) {
        alert('Please select a user first.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw timestamp watermark
    context.font = "16px Arial";
    context.fillStyle = "white";
    context.fillText(new Date().toLocaleString(), 10, canvas.height - 10);

    const dataURL = canvas.toDataURL('image/png');
    snapshot.src = dataURL;
    snapshot.style.display = 'block';
    video.style.display = 'none';

    // Convert dataURL to Blob URL
    fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
            snapshotBlobURL = URL.createObjectURL(blob);
        });

    // Save the photo
    downloadLink.href = dataURL;
    downloadLink.download = `snapshot_${user}.png`;
    downloadLink.click();

    // Show logout button and hide capture button
    captureButton.style.display = 'none';
    logoutButton.style.display = 'inline-block';

    // Stop the camera
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    // Update attendance record and remove user from the dropdown
    const newRow = document.createElement('tr');
    const userNameCell = document.createElement('td');
    userNameCell.textContent = user;
    const timestampCell = document.createElement('td');
    timestampCell.textContent = new Date().toLocaleString(); // Current timestamp
    newRow.appendChild(userNameCell);
    newRow.appendChild(timestampCell);
    attendanceTableBody.appendChild(newRow);

    const userIndex = filterUsers(fetchUsers()).indexOf(user);
    if (userIndex !== -1) {
        filterUsers(fetchUsers()).splice(userIndex, 1);
        const userOption = dropdownOptions.querySelector(`div[data-value="${user}"]`);
        if (userOption) {
            dropdownOptions.removeChild(userOption);
        }
    }
    userIdInput.value = '';

    // Add the attendance data to the array
    attendanceData.push({ user: user, timestamp: timestampCell.textContent });
    // Save the updated attendance data to localStorage
    saveAttendanceData();
});

// Function to populate the attendance table with saved data
function populateAttendanceTable() {
    attendanceData.forEach(data => {
        const newRow = document.createElement('tr');
        const userNameCell = document.createElement('td');
        userNameCell.textContent = data.user;
        const timestampCell = document.createElement('td');
        timestampCell.textContent = data.timestamp;
        newRow.appendChild(userNameCell);
        newRow.appendChild(timestampCell);
        attendanceTableBody.appendChild(newRow);
    });
}

// Load saved attendance data when the page loads
populateAttendanceTable();

logoutButton.addEventListener('click', function () {
    message.style.display = 'block';
    videoContainer.style.display = 'none';
    startButton.style.display = 'inline-block';
    logoutButton.style.display = 'none';
    snapshot.style.display = 'none';
    video.style.display = 'block';

    // Get the last entry from the attendance data
    if (attendanceData.length === 0) {
        alert('No attendance data found.');
        return;
    }
    const lastEntry = attendanceData[attendanceData.length - 1];
    const userName = lastEntry.user;

    // Format the timestamp to hh:mm AM/PM
    const timestamp = new Date(lastEntry.timestamp).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    // Open WhatsApp chat with the message template
    const whatsappMessage = encodeURIComponent(`*Reached* - *${userName}* *${timestamp}* Snapshot: ${snapshotBlobURL}`);
    const whatsappURL = `https://wa.me/?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');

    // Refresh the page
    location.reload();
});


// Reset button functionality
resetButton.addEventListener('click', function () {
    // Reset the attendance data
    localStorage.removeItem('attendanceData');
    attendanceData = [];

    // Reset the dropdown options
    dropdownOptions.innerHTML = '';
    fetchUsers().forEach(user => {
        const optionDiv = document.createElement('div');
        optionDiv.textContent = user;
        optionDiv.dataset.value = user;
        optionDiv.classList.add('dropdown-item');
        optionDiv.addEventListener('click', function () {
            userIdInput.value = user;
            dropdownOptions.innerHTML = '';
            dropdownOptions.style.display = 'none';
            startButton.click(); // Trigger start button click when selecting from dropdown
        });
        dropdownOptions.appendChild(optionDiv);
    });

    // Clear the attendance table
    attendanceTableBody.innerHTML = '';

    // Clear the user ID input
    userIdInput.value = '';

    // Clear the snapshot image
    snapshot.style.display = 'none';
    video.style.display = 'block';

    // Hide the logout button and show the start button
    logoutButton.style.display = 'none';
    captureButton.style.display = 'none';
    startButton.style.display = 'inline-block';

    // Show the message
    message.style.display = 'block';
    location.reload();
});

// Function to update the clock every second
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
function updateDate() {
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
updateDate();
setInterval(updateDate, 1000);


// Select the company name element
const companyNameElement = document.getElementById("company-name");

// Set the text you want to display with typewriter effect
const companyNameText = "THE FINANCIAL CRAFT";

// Set the additional text to display after one loop of the company name
const additionalText = "ATTENDANCE SYSTEM";


// Set the speed of typing (in milliseconds)
const typingSpeed = 100;

// Function to create typewriter effect
function typeWriterEffect(element, text, additionalText, speed) {
  let i = 0;
  let loopCount = 0;
  const typeWriter = () => {
    if (loopCount < 1) {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        loopCount++;
        setTimeout(() => {
          i = 0;
          element.innerHTML = "";
          typeWriter();
        }, 1000); // Delay before starting again
      }
    } else {
      if (i < additionalText.length) {
        element.innerHTML += additionalText.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        // Pause for 2 seconds before restarting the typewriter effect
        setTimeout(() => {
          i = 0;
          loopCount = 0;
          element.innerHTML = "";
          typeWriter();
        }, 2000); // 2-second delay
      }
    }
  };
  typeWriter();
}

// Call the typewriter function with company name element, text, additional text, and speed
typeWriterEffect(companyNameElement, companyNameText, additionalText, typingSpeed);



document.getElementById('start').addEventListener('click', function() {
    var welcomeText = document.getElementById('welcome-text');
    var userIdCard = document.getElementById('user-idcard');
    welcomeText.style.display = 'none';
    userIdCard.style.display = 'flex';
});

document.getElementById('logout').addEventListener('click', function() {
    var welcomeText = document.getElementById('welcome-text');
    var userIdCard = document.getElementById('user-idcard');
    welcomeText.style.display = 'flex';
    userIdCard.style.display = 'none';
});

document.getElementById('add-new').addEventListener('click', function() {
    var adduserText = document.getElementById('adduser-display');
    var removeuserText = document.getElementById('removeuser-display');
    
    if (adduserText.style.display === 'block') {
        adduserText.style.display = 'none';
    } else {
        adduserText.style.display = 'block';
    }
    
    removeuserText.style.display = 'none';
});


document.getElementById('remove-user').addEventListener('click', function() {
    var removeuserText = document.getElementById('removeuser-display');
    var adduserText = document.getElementById('adduser-display');
    
    if (removeuserText.style.display === 'block') {
        removeuserText.style.display = 'none';
    } else {
        removeuserText.style.display = 'block';
        
    }

    adduserText.style.display = 'none';
});


// Function to set and update the password
function setPassword(newPassword) {
    localStorage.setItem('adminPassword', newPassword);
}

// Function to get the current password
function getPassword() {
    return localStorage.getItem('adminPassword');
}

// Check if a password exists, if not set the initial password to "8882558932"
if (!getPassword()) {
    setPassword("8882558932");
    alert("Welcome User! Mark Your Attendance on Time");
}

// Function to prompt for password and optionally allow changing it
function promptPassword() {
    var password = prompt("Please enter the password:\n\nType 'change' to change the password.");
    if (password === 'change') {
        var oldPassword = prompt("Please enter the current password:");
        if (oldPassword === getPassword()) {
            var newPassword = prompt("Please enter the new password:");
            if (newPassword) {
                setPassword(newPassword);
                alert("Password has been updated successfully.");
                return false; // Indicate the password was changed, not validated
            } else {
                alert("New password cannot be empty.");
                return false; // Indicate the password change failed
            }
        } else {
            alert("Incorrect current password.");
            return false; // Indicate the password change failed
        }
    }
    return password;
}

// Admin login functionality
document.getElementById('admin-login').addEventListener('click', function() {
    var password = promptPassword();
    if (password && password === getPassword()) {
        var adminControl = document.getElementById('admin-control');
        var removeUserDisplay = document.getElementById('removeuser-display');
        var addUserDisplay = document.getElementById('adduser-display');

        if (adminControl.style.display === 'block') {
            adminControl.style.display = 'none';
        } else {
            adminControl.style.display = 'block';
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // Scroll to the bottom of the page
        }

        removeUserDisplay.style.display = 'none';
        addUserDisplay.style.display = 'none';
    } else if (password) {
        alert("Incorrect password.");
    }
});

// Data reset functionality
document.getElementById('data-reset').addEventListener('click', function() {
    if (confirm("Are you sure you want to reset the data? This action cannot be undone.")) {
        var password = promptPassword();
        if (password && password === getPassword()) {
            // Code to reset the data in #user-table
            var table = document.getElementById('user-table');
            var rowCount = table.rows.length;
            for (var i = rowCount - 1; i > 0; i--) {
                table.deleteRow(i);
            }

            // Clear the localStorage data
            localStorage.removeItem('users');

            alert("Data has been reset.");
        } else if (password) {
            alert("Incorrect password.");
        }
    }
});






document.getElementById('display-exit').addEventListener('click', function() {
    var adminControl = document.getElementById('admin-control');
    var removeUserDisplay = document.getElementById('removeuser-display');
    var addUserDisplay = document.getElementById('adduser-display');

    if (adminControl.style.display === 'block') {
        adminControl.style.display = 'none';
    } else {
        adminControl.style.display = 'block';
    }

    removeUserDisplay.style.display = 'none';
    addUserDisplay.style.display = 'none';
});

document.getElementById('adduser').addEventListener('click', function() {
    // Get the input values
    let userName = document.getElementById('user-name').value;
    let employeeId = document.getElementById('user-employe-id').value;
    let bloodGroup = document.getElementById('bld-grp').value;
    let emergencyContact = document.getElementById('Emg-contact').value;
    let profilePic = document.getElementById('profile-pic').files[0];

    // Check for duplicate employee IDs
    let existingUser = document.querySelector(`#user-table tbody tr[data-employee-id="${employeeId}"]`);
    if (existingUser) {
        alert('Employee ID already exists. Please enter a unique ID.');
        return;
    }

    // Call the addUser function
    addUser(userName, employeeId, bloodGroup, emergencyContact, profilePic);

    // Save user data to localStorage
    saveUserData();

    // Reset the input fields
    document.getElementById('user-name').value = '';
    document.getElementById('user-employe-id').value = '';
    document.getElementById('bld-grp').value = '';
    document.getElementById('Emg-contact').value = '';
    document.getElementById('profile-pic').value = '';
});

function addUser(userName, employeeId, bloodGroup, emergencyContact, profilePic) {
    let tableBody = document.querySelector('#user-table tbody');

    // Create a new row
    let newRow = tableBody.insertRow();

    // Insert cells
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3);
    let cell5 = newRow.insertCell(4);
    let cell6 = newRow.insertCell(5);

    // Add text to cells
    cell1.textContent = userName || 'N/A';
    cell2.textContent = employeeId || 'N/A';
    cell3.textContent = bloodGroup || 'N/A';
    cell4.textContent = emergencyContact || 'N/A';
    if (profilePic) {
        let img = document.createElement('img');
        img.src = URL.createObjectURL(profilePic);
        img.width = 50; // Set image width
        cell5.appendChild(img);
    } else {
        cell5.textContent = 'No Image';
    }

    // Add delete button
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button'; // Add the CSS class
    deleteButton.style.width = '50px'; 

    deleteButton.addEventListener('click', function() {
        deleteUser(employeeId);
        tableBody.removeChild(newRow);
        saveUserData(); // Save user data after deletion
    });
    cell6.appendChild(deleteButton);

    // Add a data attribute to identify the row by employee ID
    newRow.setAttribute('data-employee-id', employeeId);
}

function saveUserData() {
    let tableRows = document.querySelectorAll('#user-table tbody tr');
    let users = [];

    tableRows.forEach(row => {
        let userName = row.cells[0].textContent;
        let employeeId = row.cells[1].textContent;
        let bloodGroup = row.cells[2].textContent;
        let emergencyContact = row.cells[3].textContent;
        let profilePic = row.cells[4].querySelector('img') ? row.cells[4].querySelector('img').src : null;

        // Convert profile picture to base64 data URL
        let profilePicBase64 = null;
        if (profilePic) {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.width = row.cells[4].querySelector('img').width;
            canvas.height = row.cells[4].querySelector('img').height;
            context.drawImage(row.cells[4].querySelector('img'), 0, 0);
            profilePicBase64 = canvas.toDataURL('image/jpeg');
        }

        users.push({ userName, employeeId, bloodGroup, emergencyContact, profilePic: profilePicBase64 });
    });

    localStorage.setItem('users', JSON.stringify(users));
}

function loadUserData() {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    users.forEach(user => {
        let profilePic = user.profilePic ? dataURLtoBlob(user.profilePic) : null;
        addUser(user.userName, user.employeeId, user.bloodGroup, user.emergencyContact, profilePic);
    });
}

function deleteUser(employeeId) {
    // Retrieve existing data from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Remove the user with the specified employee ID
    users = users.filter(user => user.employeeId !== employeeId);

    // Save updated user data to localStorage
    localStorage.setItem('users', JSON.stringify(users));
}

function dataURLtoBlob(dataURL) {
    let binary = atob(dataURL.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}

// Load user data when the page loads
window.onload = function() {
    loadUserData();
    // Add event listeners for the delete button hover effect
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = 'red';
            button.style.borderColor = 'white';
            button.style.color = 'white';
            button.style.fontSize = 'calc(1em + 4px)';
        });
        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = '';
            button.style.borderColor = '';
            button.style.color = '';
            button.style.fontSize = 'initial';
        });
    });

    // Add event listener for remove button
    document.getElementById("removeID").addEventListener("click", function() {
        var idToRemove = document.getElementById("IDtoremove").value; // Extracting value from input field
        var table = document.getElementById("user-table");
        var rows = table.getElementsByTagName("tr");
        var userFound = false;
    
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].getElementsByTagName("td");
            if (cells.length > 0) {
                var employeeID = cells[1].textContent || cells[1].innerText; // Getting Employee ID from the table
                if (employeeID === idToRemove) {
                    table.deleteRow(i); // Deleting the row if Employee ID matches
                    document.getElementById("IDtoremove").value = ""; // Clearing the input field
                    deleteUser(employeeID); // Removing user data from localStorage
                    userFound = true;
                    alert("User with ID " + idToRemove + " successfully removed.");
                    break;
                }
            }
        }
    
        if (!userFound) {
            alert("No user found with ID " + idToRemove);
        }
    });
    

};

function saveUserData() {
    let tableRows = document.querySelectorAll('#user-table tbody tr');
    let users = [];
    let promises = [];

    tableRows.forEach(row => {
        let userName = row.cells[0].textContent;
        let employeeId = row.cells[1].textContent;
        let bloodGroup = row.cells[2].textContent;
        let emergencyContact = row.cells[3].textContent;
        let imgElement = row.cells[4].querySelector('img');

        if (imgElement) {
            let imgSrc = imgElement.src;
            let promise = fetch(imgSrc)
                .then(response => response.blob())
                .then(blob => {
                    return new Promise((resolve, reject) => {
                        let reader = new FileReader();
                        reader.onloadend = () => {
                            let profilePicDataUrl = reader.result;
                            users.push({ userName, employeeId, bloodGroup, emergencyContact, profilePic: profilePicDataUrl });
                            resolve();
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                });
            promises.push(promise);
        } else {
            users.push({ userName, employeeId, bloodGroup, emergencyContact, profilePic: null });
        }
    });

    Promise.all(promises).then(() => {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('User data saved successfully!');
    }).catch(error => {
        console.error('Error saving user data:', error);
    });
}
document.getElementById('start').addEventListener('click', function() {
    var userIdInput = document.getElementById('user-id').value;
    if (userIdInput) {
        var userDetails = getUserDetails(userIdInput);
        if (userDetails) {
            document.getElementById('username').innerText = userIdInput;
            document.getElementById('Employe-Id').innerText = userDetails.employeeId;
            document.getElementById('Blood-Group').innerText = userDetails.bloodGroup;
            document.getElementById('Emg-Contact').innerText = userDetails.emergencyContact;
            document.getElementById('prf-pic').src = userDetails.profilePic;

            var currentHour = new Date().getHours();
            var greeting;

            if (currentHour >= 5 && currentHour < 12) {
                greeting = "Good Morning";
            } else if (currentHour >= 12 && currentHour < 17) {
                greeting = "Good Afternoon";
            } else if (currentHour >= 17 && currentHour < 21) {
                greeting = "Good Evening";
            } else {
                greeting = "Good Night";
            }

            var greetText = greeting + '! ';
            var nameText = userIdInput;
            loopTypeEffect(document.getElementById('user-greet'), greetText, nameText);
        } else {
            alert('User details not found in the table.');
        }
    } else {
        alert('Please select a user.');
    }
});

function getUserDetails(userName) {
    var table = document.getElementById('user-table').getElementsByTagName('tbody')[0];
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (row.cells[0].innerText === userName) {
            return {
                employeeId: row.cells[1].innerText,
                bloodGroup: row.cells[2].innerText,
                emergencyContact: row.cells[3].innerText,
                profilePic: row.cells[4].getElementsByTagName('img')[0].src
            };
        }
    }
    return null;
}

// Update the clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);

// Update the date immediately and then every second
updateDate();
setInterval(updateDate, 1000);

 const texts = ['Signin to Your Account', 'Mark Your Attendance'];
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
                animateText();
            }, 2000); // Change the delay (in milliseconds) here
        }

        animateText();
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
  let securityCodeInput = document.getElementById("security-code");
    let forgotLoginPasswordButton = document.getElementById("forgot-login-password");
    let loginButton = document.getElementById("login");

    function toggleSecurityCode() {
        if (securityCodeInput.style.display === "none") {
            securityCodeInput.style.display = "block";
            forgotLoginPasswordButton.textContent = "UPDATE";
            loginButton.style.display = "none";
            forgotLoginPasswordButton.style.width = "80vw";
        } else {
            securityCodeInput.style.display = "none";
            forgotLoginPasswordButton.textContent = "FORGOT";
            loginButton.style.display = "block";
            forgotLoginPasswordButton.style.width = "40vw";
        }
    }

    function login() {
        document.getElementById('time-date').style.display = 'none';
        document.getElementById('mob-cmpy-logo').style.display = 'none';
        document.getElementById('selfi-img').style.display = 'none';
        document.getElementById('forgot-login-password').style.display = 'none';
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('user-id').style.display = 'none';
        document.getElementById('password-input').style.display = 'none';
        document.querySelector('.text-p').style.display = 'none';
        document.getElementById( 'video-container').style.display = 'block';
        document.getElementById( 'start').style.display = 'block';
        document.getElementById( 'capture').style.display = 'block';
    }

    // Function to show all elements on logout capture
    function logout() {
        document.getElementById('time-date').style.display = 'block';
        document.getElementById('mob-cmpy-logo').style.display = 'block';
        document.getElementById('selfi-img').style.display = 'block';
        document.getElementById('forgot-login-password').style.display = 'block';
        document.getElementById('login').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('user-id').style.display = 'block';
        document.getElementById('password-input').style.display = 'block';
        document.querySelector('.text-p').style.display = 'block';
        document.getElementById( 'video-container').style.display = 'none';
        document.getElementById( 'start').style.display = 'none';
        document.getElementById( 'capture').style.display = 'none';
    }