# Deployment Guide

## Build & Run (Single VM)

### Backend

```bash
cd backend
npm install --omit=dev
cp .env.example .env
# edit .env values
npm start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL to backend public URL
npm run build
```

Serve `frontend/dist` with Nginx, Caddy, or another static host.

## Nginx Reverse Proxy (Example)

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    root /var/www/ai-pdf-chat/frontend/dist;
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:4000/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Process Management

Use `pm2` or systemd for backend uptime:

```bash
pm2 start server.js --name ai-pdf-chat --cwd /path/to/backend
pm2 save
```

## Environment Setup Checklist

1. Set valid `GROQ_API_KEY`
2. Set production `FRONTEND_URL`
3. Set `NODE_ENV=production`
4. Set strong rate limit (`RATE_LIMIT_MAX`) for traffic profile
5. Ensure uploads path is writable

## Production Hardening Checklist

1. Enable HTTPS and HSTS at proxy layer
2. Restrict CORS to exact frontend domain
3. Rotate API keys and store in secret manager
4. Add log aggregation and alerting
5. Add uptime checks to `/health`
6. Schedule cleanup for stale upload temp files
7. Pin dependency versions and run security audits regularly
