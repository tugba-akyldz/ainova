# AINOVA AI Bot

This is a simple web application that uses a Node.js backend to proxy requests to the Google Gemini API.

## Setup

1.  Install the dependencies:
    ```
    npm install
    ```

2.  Create a `.env` file in the root of the project and add your Google API key:
    ```
    GOOGLE_API_KEY=YOUR_API_KEY
    ```

3.  (Optional) If you want to use the backend API key authentication, add a `BACKEND_API_KEY` to your `.env` file:
    ```
    BACKEND_API_KEY=YOUR_BACKEND_API_KEY
    ```

## Running the Application

1.  Start the server:
    ```
    npm start
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

## Project Structure

*   `index.html`: The main HTML file for the web application.
*   `style.css`: The CSS file for the web application.
*   `script.js`: The JavaScript file for the web application.
*   `ai-bot.js`: A JavaScript module that handles the communication with the backend.
*   `server.js`: The Node.js server that proxies requests to the Google Gemini API.
*   `package.json`: The `package.json` file that contains the project's dependencies and scripts.
*   `.env.example`: An example of the `.env` file.
*   `TODO.md`: A file that contains a list of tasks to be done.