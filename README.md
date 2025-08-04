# My Drive Clone
This is a comprehensive, client-side web application that mimics the core functionality of a cloud storage service like Google Drive. It's a single-page application (SPA) built to showcase modern frontend development techniques, user authentication, and file management in a simulated environment.

## Features
User-Centric Interface: The application features a clean, responsive, and intuitive design inspired by Google Drive, complete with a functional sidebar and a dynamic file grid.

### Complete User Authentication:

Sign Up: Create a new user account with details like name, email, password, date of birth, and phone number.

Login: Securely log in to access your personalized file space.

Profile Menu: A user-friendly profile menu shows your name and email and provides a clear sign-out option.

### Robust File Management:

File Upload: Easily upload files using a streamlined drag-and-drop area or a dedicated upload button.

File Organization: Create new folders to keep your files organized.

File Actions: A right-click context menu on files provides options to Open, Download, and Move to Bin.

### Trash Functionality:

Bin/Trash View: Deleted files are not permanently removed immediately but are moved to a dedicated "Trash" section.

Restore & Delete Forever: From the trash, users can either restore files or delete them permanently.

### Enhanced User Experience:

Live Search: A functional search bar filters files in real-time as you type, making it easy to find what you need.

Dynamic Settings: A settings menu allows you to toggle features like a Dark Mode, and it displays your current storage usage.

Responsive Sidebar: The sidebar menu can be toggled to a collapsed state for better mobile viewing.

Simulated Backend: All user data and files are securely stored in the browser's local storage, simulating a persistent backend without needing a server. This is great for demonstrating functionality but is not a production-ready solution.

## How to Run
Clone the repository from GitHub.

Open the project folder.

Launch the index.html file in any modern web browser (e.g., Chrome, Firefox, Safari).

No server setup or dependencies are required. The entire application runs directly in your browser.

## Technologies Used
HTML5: For structuring the application.

CSS3: For styling, animations, and a responsive layout using Flexbox and CSS Grid.

JavaScript: For all client-side logic, including DOM manipulation, data persistence with localStorage, and event handling.

Google Material Icons: A clean and professional icon library for the user interface.
