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