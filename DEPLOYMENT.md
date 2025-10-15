# 🚀 ALUMNET Deployment Guide

## Netlify Deployment

### Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Netlify will automatically detect the `netlify.toml` configuration

3. **Build Settings (Auto-configured)**
   - Base directory: `frontend`
   - Build command: `npm ci && npm run build`
   - Publish directory: `frontend/dist`
   - Node.js version: 18

### Manual Deployment

If automatic deployment fails, try manual deployment:

1. **Build locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy manually**
   - Drag and drop the `frontend/dist` folder to Netlify
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=frontend/dist
     ```

## Troubleshooting

### Common Issues

1. **"vite: not found" Error**
   - Ensure `vite` is in `devDependencies` in `frontend/package.json`
   - Clear Netlify cache and redeploy

2. **Build Fails**
   - Check that all dependencies are properly listed
   - Ensure `frontend/package.json` has correct scripts

3. **404 on Routes**
   - Ensure `frontend/public/_redirects` file exists
   - Check that `netlify.toml` has redirect rules

4. **Environment Variables**
   - Add environment variables in Netlify dashboard
   - Prefix with `VITE_` for client-side variables

### Build Commands Reference

```bash
# Install dependencies
npm ci

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## File Structure for Deployment

```
alumnet/
├── frontend/
│   ├── public/
│   │   ├── _redirects
│   │   ├── favicon.ico
│   │   └── vite.svg
│   ├── src/
│   │   ├── App-clean.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .eslintrc.js
├── netlify.toml
├── .gitignore
└── README.md
```

## Environment Variables

Create a `.env` file in the `frontend` directory if needed:

```env
VITE_APP_NAME=ALUMNET
VITE_API_URL=https://your-api-url.com
```

## Performance Optimization

The `netlify.toml` includes:
- CSS and JS minification
- Asset caching headers
- Security headers
- SPA redirect rules

## Support

If deployment issues persist:
1. Check Netlify build logs
2. Verify all files are committed to Git
3. Test build locally first
4. Contact support with specific error messages