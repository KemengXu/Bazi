# Bazi Server

This is a simple Node.js server that provides Ba-Zi (Chinese Astrology) data based on birth date and time.

## Deployment on Render.com

### Prerequisites

- A Render.com account
- Git repository with this code pushed to GitHub, GitLab, or Bitbucket

### Deployment Steps

1. Log in to your Render.com account
2. From the dashboard, click "New" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: bazi-server (or your preferred name)
   - **Environment**: Node
   - **Region**: Choose the closest to your users
   - **Branch**: main (or your default branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under "Advanced" settings, you can add environment variables if needed
6. Click "Create Web Service"

Render will automatically deploy your application and provide you with a URL.

## Environment Variables

- `PORT`: Automatically set by Render.com, you don't need to configure this manually.

## Update Frontend Configuration

After deployment, update your frontend `.env.production` file with the Render.com URL:

```
VITE_APP_API_URL=https://your-render-service-url.onrender.com
```

## Troubleshooting

- If you see CORS errors, check the "Access-Control-Allow-Origin" header in try.js
- Check Render.com logs for any server-side errors
- Ensure the buildCommand and startCommand in render.yaml match your package.json scripts 