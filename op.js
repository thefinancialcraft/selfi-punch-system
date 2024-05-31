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
        