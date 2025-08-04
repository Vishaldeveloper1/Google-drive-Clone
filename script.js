document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const landingPage = document.getElementById('landingPage');
    const mainContainer = document.getElementById('mainContainer');
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileEmail = document.getElementById('profileEmail');
    const profileName = document.getElementById('profileName');
    const profileLargeIcon = document.getElementById('profileLargeIcon');
    const logoutButton = document.getElementById('logoutButton');
    const authModal = document.getElementById('authModal');
    const openAuthModalButton = document.getElementById('openAuthModal');
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
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const currentViewTitle = document.getElementById('currentViewTitle');
    const searchInput = document.getElementById('searchInput');
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const storageUsage = document.getElementById('storageUsage');
    const fileContextMenu = document.getElementById('fileContextMenu');
    const trashContextMenu = document.getElementById('trashContextMenu');
    const contextOpenBtn = document.getElementById('contextOpen');
    const contextDownloadBtn = document.getElementById('contextDownload');
    const contextMoveToTrashBtn = document.getElementById('contextMoveToTrash');
    const contextRestoreBtn = document.getElementById('contextRestore');
    const contextDeletePermanentBtn = document.getElementById('contextDeletePermanent');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const uploadFileOption = document.getElementById('uploadFileOption');
    const uploadArea = document.getElementById('uploadArea');

    // --- "Fake" Backend (In-Memory Data) ---
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const filesDb = JSON.parse(localStorage.getItem('filesDb')) || {};
    let currentUser = null;
    let currentView = 'mydrive';
    let currentFileIndex = null;

    // --- State Management ---
    function saveToLocalStorage() {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('filesDb', JSON.stringify(filesDb));
    }

    function calculateStorageUsage() {
        let totalBytes = 0;
        if (currentUser && filesDb[currentUser.email]) {
            filesDb[currentUser.email].forEach(file => {
                if (file.data) {
                    // Approximate size of Base64 string in bytes
                    totalBytes += file.data.length * 0.75;
                }
            });
        }
        const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
        storageUsage.textContent = `${totalMB} MB`;
    }

    function renderApp() {
        if (currentUser) {
            landingPage.style.display = 'none';
            mainContainer.style.display = 'flex';
            profileIcon.textContent = currentUser.name.charAt(0).toUpperCase();
            profileLargeIcon.textContent = currentUser.name.charAt(0).toUpperCase();
            profileName.textContent = currentUser.name;
            profileEmail.textContent = currentUser.email;
            profileIcon.style.cursor = 'pointer';
            profileDropdown.classList.remove('show');
            authModal.style.display = 'none';
            renderFiles();
            calculateStorageUsage();
        } else {
            landingPage.style.display = 'flex';
            mainContainer.style.display = 'none';
            profileIcon.textContent = 'G';
            profileIcon.style.cursor = 'pointer';
            profileDropdown.classList.remove('show');
            authModal.style.display = 'none';
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

    openAuthModalButton.addEventListener('click', () => {
        authModal.style.display = 'block';
    });

    logoutButton.addEventListener('click', () => {
        currentUser = null;
        renderApp();
    });

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

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const name = document.getElementById('signupName').value;
        const dob = document.getElementById('signupDob').value;
        const phone = document.getElementById('signupPhone').value;

        if (users[email]) {
            alert('An account with this email already exists.');
        } else {
            users[email] = { name, password, dob, phone };
            filesDb[email] = [];
            saveToLocalStorage();
            alert('Account created successfully! You can now log in.');
            showLoginLink.click();
        }
    });

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
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    sidebarMenu.addEventListener('click', (e) => {
        const target = e.target.closest('li');
        if (target) {
            document.querySelector('.sidebar-menu .active').classList.remove('active');
            target.classList.add('active');
            currentView = target.dataset.view;
            currentViewTitle.textContent = currentView === 'mydrive' ? 'My Drive' : 'Trash';
            renderFiles();
        }
    });

    searchInput.addEventListener('input', () => {
        renderFiles();
    });

    function renderFiles() {
        console.log("Rendering files for view:", currentView);
        fileGrid.innerHTML = '';
        const userFiles = filesDb[currentUser.email] || [];
        const searchTerm = searchInput.value.toLowerCase();
        
        const filteredFiles = userFiles.filter(file => {
            const matchesSearch = file.name.toLowerCase().includes(searchTerm);
            const isDeleted = file.isDeleted || false;
            if (currentView === 'mydrive') {
                return matchesSearch && !isDeleted;
            } else if (currentView === 'trash') {
                return matchesSearch && isDeleted;
            }
            return false;
        });
        
        filteredFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // Map the file object to its index in the original array for persistence
            const originalIndex = userFiles.indexOf(file);
            fileItem.dataset.fileIndex = originalIndex;

            let iconName;
            if (file.type === 'folder') {
                iconName = 'folder';
            } else if (file.type.startsWith('image')) {
                iconName = 'image';
            } else if (file.type.startsWith('video')) {
                iconName = 'videocam';
            } else if (file.type.includes('pdf')) {
                iconName = 'picture_as_pdf';
            } else {
                iconName = 'insert_drive_file';
            }
            
            fileItem.innerHTML = `
                <span class="material-icons file-icon">${iconName}</span>
                <p>${file.name}</p>
                <div class="file-options">
                    <span class="material-icons">more_vert</span>
                </div>
            `;

            if (file.data) {
                fileItem.addEventListener('click', () => {
                    const blob = b64toBlob(file.data, file.type);
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                });
            } else {
                fileItem.addEventListener('click', () => {
                    alert('This is a folder. No action defined.');
                });
            }
            
            const optionsButton = fileItem.querySelector('.file-options');
            optionsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = currentView === 'mydrive' ? fileContextMenu : trashContextMenu;
                currentFileIndex = originalIndex;
                menu.style.display = 'flex';
                menu.style.left = e.clientX + 'px';
                menu.style.top = e.clientY + 'px';
            });
            
            fileGrid.appendChild(fileItem);
        });
    }

    // Context menu actions
    contextOpenBtn.addEventListener('click', () => {
        const file = filesDb[currentUser.email][currentFileIndex];
        if (file) {
            const blob = b64toBlob(file.data, file.type);
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }
        fileContextMenu.style.display = 'none';
    });

    contextDownloadBtn.addEventListener('click', () => {
        const file = filesDb[currentUser.email][currentFileIndex];
        if (file) {
            const blob = b64toBlob(file.data, file.type);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        fileContextMenu.style.display = 'none';
    });
    
    contextMoveToTrashBtn.addEventListener('click', () => {
        if (filesDb[currentUser.email][currentFileIndex]) {
            filesDb[currentUser.email][currentFileIndex].isDeleted = true;
            saveToLocalStorage();
            renderFiles();
        }
        fileContextMenu.style.display = 'none';
    });
    
    contextRestoreBtn.addEventListener('click', () => {
        if (filesDb[currentUser.email][currentFileIndex]) {
            delete filesDb[currentUser.email][currentFileIndex].isDeleted;
            saveToLocalStorage();
            renderFiles();
        }
        trashContextMenu.style.display = 'none';
    });

    contextDeletePermanentBtn.addEventListener('click', () => {
        if (filesDb[currentUser.email][currentFileIndex] && confirm('Are you sure you want to delete this file forever?')) {
            filesDb[currentUser.email].splice(currentFileIndex, 1);
            saveToLocalStorage();
            renderFiles();
        }
        trashContextMenu.style.display = 'none';
    });
    
    window.addEventListener('click', () => {
        fileContextMenu.style.display = 'none';
        trashContextMenu.style.display = 'none';
    });

    // Helper function to convert base64 to Blob
    function b64toBlob(b64Data, contentType, sliceSize = 512) {
        if (!b64Data) {
            return new Blob([], { type: contentType });
        }
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    newButton.addEventListener('click', () => {
        newFileModal.style.display = 'block';
    });

    uploadFileOption.addEventListener('click', () => {
        document.getElementById('fileInput').click();
        newFileModal.style.display = 'none';
    });
    
    document.getElementById('createNewFolder').addEventListener('click', () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            filesDb[currentUser.email].push({ name: folderName, type: 'folder' });
            saveToLocalStorage();
            renderFiles();
        }
        newFileModal.style.display = 'none';
    });

    fileInput.addEventListener('change', (event) => {
        const filesToUpload = event.target.files;
        if (!currentUser) {
            alert('Please log in to upload files.');
            return;
        }

        for (const file of filesToUpload) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result.split(',')[1];
                filesDb[currentUser.email].push({
                    name: file.name,
                    type: file.type,
                    data: base64Data
                });
                saveToLocalStorage();
                renderFiles();
                calculateStorageUsage();
            };
            reader.readAsDataURL(file);
        }
        fileInput.value = '';
    });
    
    // Settings modal and dark mode
    settingsIcon.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    darkModeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == authModal || event.target == newFileModal || event.target == settingsModal) {
            event.target.style.display = 'none';
        }
    });

    renderApp();
});