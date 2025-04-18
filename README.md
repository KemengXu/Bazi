# Ba-Zi (Eight Words) Chinese Astrology App

This repository contains a Ba-Zi (Eight Words) Chinese astrology application for calculating and analyzing your Four Pillars chart.

## Project Structure

- `eight-words/`: Frontend Vue.js application
- `server/`: Backend Node.js server

## Deployment Guide

### Deploying the Backend (Node.js Server) on Render.com

1. Make sure your code is committed to a Git repository
2. Log in to [Render.com](https://render.com)
3. Click "New" and select "Web Service"
4. Connect your Git repository
5. Configure the service:
   - **Name**: bazi-server (or your preferred name)
   - **Environment**: Node
   - **Root Directory**: server (important!)
   - **Build Command**: npm install
   - **Start Command**: npm start
6. Select your preferred region and plan (Free tier works)
7. Click "Create Web Service"
8. Render will automatically build and deploy your server
9. Copy the URL provided by Render (e.g., `https://bazi-server.onrender.com`)

### Updating Frontend Configuration

After your backend is deployed, update the frontend environment file to use the new URL:

1. Edit `eight-words/.env.production` and set:
   ```
   VITE_APP_API_URL=https://your-bazi-server.onrender.com
   ```
   (Replace with your actual Render.com URL)

2. Commit and push these changes to your repository

### Deploying the Frontend on Render.com

You can also deploy the Vue.js frontend on Render.com:

1. Log in to [Render.com](https://render.com)
2. Click "New" and select "Static Site"
3. Connect your Git repository
4. Configure the service:
   - **Name**: bazi-frontend (or your preferred name)
   - **Root Directory**: eight-words
   - **Build Command**: npm install && npm run build
   - **Publish Directory**: dist
5. Add the environment variable:
   - `VITE_APP_API_URL`: Your backend URL
6. Click "Create Static Site"

### Alternative Frontend Deployment with GitHub Pages

You can also use GitHub Pages for the frontend:

1. Make sure your backend URL is correctly set in `.env.production`
2. Run the deployment script:
   ```
   cd eight-words
   npm run deploy:simple
   ```

## Local Development

### Server

```bash
cd server
npm install
npm run dev
```

The server will run on http://localhost:8080

### Frontend

```bash
cd eight-words
npm install
npm run dev
```

The frontend will run on http://localhost:5173

## Troubleshooting

### CORS Issues

If you encounter CORS errors, check the Access-Control-Allow-Origin header in `server/try.js`. You may need to update it to allow your frontend domain.

### Render.com Deployment Issues

- Check the server logs in the Render.com dashboard
- Verify that the "Root Directory" is correct in your service configuration
- For the backend, make sure your package.json has the correct "start" script

### GitHub Pages Deployment

If you have issues with GitHub Pages deployment, try:
```bash
cd eight-words
npm run predeploy
npm run deploy
```

## License

[MIT License](LICENSE)

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