# Deployment Guide - Labozu React

This guide provides instructions for deploying the Labozu React application to various platforms.

## 🚀 Quick Start

### 1. Build the Application

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a `build` folder with optimized production files.

### 2. Test the Build Locally

```bash
# Serve the build folder locally
npm run serve
```

Visit `http://localhost:3000` to verify the build works correctly.

## 🌐 Deployment Options

### Netlify

1. **Connect your repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
3. **Deploy** automatically on git push

### Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** and your app will be deployed

### GitHub Pages

1. **Add homepage** to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name"
   }
   ```

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add scripts** to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

### AWS S3 + CloudFront

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Upload to S3**:
   ```bash
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** for CDN distribution

### Docker

1. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run**:
   ```bash
   docker build -t labozu-react .
   docker run -p 80:80 labozu-react
   ```

## 🔧 Environment Variables

Create a `.env` file for environment-specific configurations:

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_GOOGLE_ANALYTICS_ID=GA_TRACKING_ID
REACT_APP_CONTACT_EMAIL=contact@yourdomain.com
```

## 📱 PWA Configuration

To enable Progressive Web App features:

1. **Update manifest** in `public/manifest.json`
2. **Configure service worker** in `src/serviceWorker.ts`
3. **Test PWA features** using Lighthouse

## 🔒 Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit sensitive data
3. **Content Security Policy**: Configure CSP headers
4. **Dependencies**: Regularly update dependencies

## 📊 Performance Optimization

1. **Code Splitting**: Implement React.lazy() for route-based splitting
2. **Image Optimization**: Use WebP format and lazy loading
3. **Caching**: Configure proper cache headers
4. **Compression**: Enable gzip/brotli compression

## 🧪 Testing Before Deployment

```bash
# Run tests
npm test

# Build and test locally
npm run build
npm run serve

# Check for accessibility issues
npm install -g lighthouse
lighthouse http://localhost:3000
```

## 📈 Monitoring

1. **Error Tracking**: Implement Sentry or similar
2. **Analytics**: Add Google Analytics or Plausible
3. **Performance**: Monitor Core Web Vitals
4. **Uptime**: Set up uptime monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './build'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🆘 Troubleshooting

### Common Issues

1. **Build fails**: Check for TypeScript errors
2. **Routing issues**: Ensure proper base path configuration
3. **Images not loading**: Verify public folder structure
4. **Styling issues**: Check Bootstrap CSS imports

### Debug Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Analyze bundle size
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'

# Check for outdated dependencies
npm outdated
```

## 📞 Support

For deployment issues:
- Check the platform's documentation
- Review build logs for errors
- Test locally before deploying
- Contact the development team

---

**Happy Deploying! 🚀** 