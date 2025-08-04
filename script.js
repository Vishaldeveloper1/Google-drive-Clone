document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const mainContainer = document.getElementById('mainContainer');
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileEmail = document.getElementById('profileEmail');
    const logoutButton = document.getElementById('logoutButton');
    const authModal = document.getElementById('authModal');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signupFormContainer = document.getElementById('signupFormContainer');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const newButton = document.getElementById('newButton');
    const newFileModal = document.getElementById('newFileModal');
    const fileInput = document.getElementById('fileInput');
    const fileGrid = document.getElementById('fileGrid');
    const closeButtons = document.querySelectorAll('.close-button');

    // --- "Fake" Backend (In-Memory Data) ---
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const filesDb = JSON.parse(localStorage.getItem('filesDb')) || {};
    let currentUser = null;

    // --- State Management ---
    function saveToLocalStorage() {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('filesDb', JSON.stringify(filesDb));
    }

    function renderApp() {
        if (currentUser) {
            // Logged-in state
            mainContainer.style.display = 'flex';
            profileIcon.textContent = currentUser.name.charAt(0).toUpperCase();
            profileEmail.textContent = currentUser.email;
            profileIcon.style.cursor = 'pointer';
            profileDropdown.classList.remove('show');
            authModal.style.display = 'none';
            renderFiles(currentUser.email);
        } else {
            // Logged-out state
            mainContainer.style.display = 'none';
            profileIcon.textContent = 'G';
            profileIcon.style.cursor = 'pointer';
            profileDropdown.classList.remove('show');
            authModal.style.display = 'block';
        }
    }

    // --- User Authentication Logic ---
    profileIcon.addEventListener('click', () => {
        if (currentUser) {
            profileDropdown.classList.toggle('show');
        } else {
            authModal.style.display = 'block';
        }
    });

    logoutButton.addEventListener('click', () => {
        currentUser = null;
        renderApp();
    });

    // Toggle between login and signup forms
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        signupFormContainer.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    // Handle Signup Form Submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const name = document.getElementById('signupName').value;
        const dob = document.getElementById('signupDob').value;

        if (users[email]) {
            alert('An account with this email already exists.');
        } else {
            users[email] = { name, password, dob };
            filesDb[email] = []; // Initialize an empty file array for the new user
            saveToLocalStorage();
            alert('Account created successfully! You can now log in.');
            showLoginLink.click(); // Switch to login form
        }
    });

    // Handle Login Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (users[email] && users[email].password === password) {
            currentUser = { email, name: users[email].name };
            renderApp();
        } else {
            alert('Invalid email or password.');
        }
    });

    // --- File Management Logic ---
    function renderFiles(userEmail) {
        fileGrid.innerHTML = ''; // Clear the grid
        const userFiles = filesDb[userEmail] || [];

        userFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            let iconName;
            if (file.type === 'folder') {
                iconName = 'folder';
            } else if (file.type.startsWith('image')) {
                iconName = 'image';
            } else if (file.type.startsWith('video')) {
                iconName = 'videocam';
            } else {
                iconName = 'insert_drive_file';
            }
            
            fileItem.innerHTML = `<span class="material-icons">${iconName}</span><p>${file.name}</p>`;
            fileGrid.appendChild(fileItem);
        });
    }

    // New button (creates a new file/folder)
    newButton.addEventListener('click', () => {
        newFileModal.style.display = 'block';
    });
    
    document.getElementById('createNewFolder').addEventListener('click', () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            filesDb[currentUser.email].push({ name: folderName, type: 'folder' });
            saveToLocalStorage();
            renderFiles(currentUser.email);
        }
        newFileModal.style.display = 'none';
    });

    document.getElementById('createNewFile').addEventListener('click', () => {
        const fileName = prompt('Enter file name (e.g., my_doc.txt):');
        if (fileName) {
            filesDb[currentUser.email].push({ name: fileName, type: 'file' });
            saveToLocalStorage();
            renderFiles(currentUser.email);
        }
        newFileModal.style.display = 'none';
    });

    // Handle file input for uploads
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (!currentUser) {
            alert('Please log in to upload files.');
            return;
        }

        for (const file of files) {
            console.log(`Uploading file: ${file.name}`);
            filesDb[currentUser.email].push({
                name: file.name,
                type: file.type // Get the file's MIME type
            });
        }
        saveToLocalStorage();
        renderFiles(currentUser.email);
        fileInput.value = ''; // Clear input
    });

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == authModal || event.target == newFileModal) {
            event.target.style.display = 'none';
        }
    });

    // Initial render
    renderApp();
});