#!/bin/bash
# deploy_standalone.sh
# Automates Next.js standalone deployment to root@77.246.247.80 (omega)

set -e

SERVER_ALIAS="omega"
REMOTE_DIR="/root/dauys_original"
DOMAIN="dauys.ecoout.com.kz"

echo "=================================================="
echo "🚀 Starting standalone deployment to $SERVER_ALIAS ($DOMAIN)"
echo "=================================================="

# 1. Copy standalone archive and build configs to remote server
echo "👉 Copying standalone.zip and Docker configs to server..."
scp standalone.zip Dockerfile docker-compose.yml $SERVER_ALIAS:$REMOTE_DIR/

# 2. Extract archive on server
echo "👉 Extracting standalone archive on server..."
ssh $SERVER_ALIAS "cd $REMOTE_DIR && rm -rf standalone_dist && unzip -o standalone.zip -d standalone_dist && rm standalone.zip"

# 3. Build and Start Docker Containers
echo "👉 Building and starting Docker containers on remote server..."
ssh $SERVER_ALIAS "cd $REMOTE_DIR && docker compose down && docker compose up -d --build"

echo "⏳ Waiting for containers to initialize and run Prisma migrations..."
sleep 15

# Check container status
ssh $SERVER_ALIAS "cd $REMOTE_DIR && docker compose ps"

# 4. Configure Nginx Reverse Proxy
echo "👉 Ensuring Nginx configuration is active..."
NGINX_CONF="/etc/nginx/sites-available/dauys"
ssh $SERVER_ALIAS "cat << 'EOF' > $NGINX_CONF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF"

ssh $SERVER_ALIAS "ln -sf $NGINX_CONF /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"

# 5. Check and configure SSL with Certbot
echo "👉 Ensuring SSL certificate is configured..."
ssh $SERVER_ALIAS "certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email || echo '⚠️ Certbot failed, check domain DNS record propagation'"

echo "=================================================="
echo "🎉 Standalone deployment finished!"
echo "Please verify the site at: https://$DOMAIN"
echo "=================================================="
