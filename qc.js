loginButton.addEventListener('click', function() {
    const mobNav = document.getElementById('nav-mob');
    const welcomeText = document.querySelector('#welcome-text');
    
    // Display mobile navigation
    mobNav.style.display = 'flex';
    
    // Adjust margins based on viewport dimensions
    if (window.innerHeight > 750) {
        welcomeText.style.marginTop = '5px';
        mobNav.style.marginTop = '40px';
    } else if (window.innerWidth < 750) {
        mobNav.style.marginTop = '5px';
    }
    
    // Hide elements set by login() function
    document.getElementById('time-date').style.display = 'none';
    document.getElementById('mob-cmpy-logo').style.display = 'none';
    document.getElementById('selfi-img').style.display = 'none';
    document.getElementById('forgot-login-password').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('user-id').style.display = 'none';
    document.getElementById('password-input').style.display = 'none';
    document.querySelector('.text-p').style.display = 'none';
    
    // Show elements after login
    document.getElementById('afterlogin').style.display = 'flex';
    document.getElementById('video-container').style.display = 'block';
    document.getElementById('start').style.display = 'block';
    document.getElementById('capture').style.display = 'block';
    const puncin = document.getElementById('nav-mob');
    puncin.style.display = 'none';
    
});

// Function to handle logout
function logout() {
    const mobNav = document.getElementById('nav-mob');
    const aflgn = document.getElementById('afterlogin');
    const welcomeText = document.querySelector('#welcome-text');
    
    
    // Hide mobile navigation and reset margin
    aflgn.style.display = 'none';
    mobNav.style.display = 'none';
    mobNav.style.marginTop = 'initial';
    
    // Adjust welcome text margin based on viewport height
    if (window.innerHeight > 750) {
        welcomeText.style.marginTop = '40px';
    } else {
        welcomeText.style.marginTop = 'initial';
    }
    
    // Show elements set by login button click event
    document.getElementById('time-date').style.display = 'flex';
    document.getElementById('mob-cmpy-logo').style.display = 'block';
    document.getElementById('selfi-img').style.display = 'block';
    document.getElementById('forgot-login-password').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('user-id').style.display = 'block';
    document.getElementById('password-input').style.display = 'none';
    document.querySelector('.text-p').style.display = 'block';
    
    // Hide elements after logout
    document.getElementById('video-container').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    document.getElementById('capture').style.display = 'none';
   
    // Add any other logout functionality here
   
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
