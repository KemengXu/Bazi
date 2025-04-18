# Ba-Zi (Eight Words) Chinese Astrology App

This repository contains a Ba-Zi (Eight Words) Chinese astrology application for calculating and analyzing your Four Pillars chart.

## Project Structure

- `eight-words/`: Frontend Vue.js application
- `server/`: Backend Node.js server

## Running the Server

### Start the Server

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies (first time only):
   ```
   npm install
   ```

3. Start the server:
   ```
   node server.js
   ```

The server will start on http://localhost:8080

### Stop the Server

To stop the server, press `Ctrl+C` in the terminal where the server is running.

## Running the Frontend Application

### Start the Application

1. Navigate to the eight-words directory:
   ```
   cd eight-words
   ```

2. Install dependencies (first time only):
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The application will start on http://localhost:5173 (or another port if 5173 is in use)

### Stop the Application

To stop the application, press `Ctrl+C` in the terminal where the app is running.

## Deploying to GitHub Pages

To deploy the application to GitHub Pages, follow these steps:

1. Navigate to the eight-words directory:
   ```
   cd eight-words
   ```

2. Install the gh-pages package as a dev dependency:
   ```
   npm install --save-dev gh-pages
   ```

3. Open the `package.json` file and add the following scripts:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist",
     "predeploy": "vite build --base=/Bazi/"
   }
   ```

4. Create a `vite.config.js` file (or modify existing one) with GitHub Pages base path:
   ```js
   export default {
     base: '/Bazi/',
     // other config options...
   }
   ```

5. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

6. Configure GitHub Pages:
   - Go to your GitHub repository
   - Navigate to Settings > Pages
   - Set Source to "Deploy from a branch"
   - Select the branch "gh-pages" and folder "/ (root)"
   - Click Save

Your app will be available at: https://KemengXu.github.io/Bazi/

Note: Since GitHub Pages only serves static content, the backend server needs to be hosted separately (e.g., on platforms like Heroku, Render, or Vercel).

## Features

- Calculate Ba-Zi chart based on birthdate and time
- Display the Four Pillars (Year, Month, Day, Hour)
- Analyze elemental balance
- Display Day Master information
- Show Yin-Yang balance
- Provide interpretation of the chart

## Technologies Used

- Frontend: Vue.js 3, TypeScript
- Backend: Node.js
- Styling: CSS with responsive design 