#!/bin/bash
# deploy_to_server.sh
# Automates the deployment of the Next.js app to root@77.246.247.80 (SSH alias: omega)

set -e

SERVER_ALIAS="omega"
REMOTE_DIR="/root/dauys_original"
DOMAIN="dauys.ecoout.com.kz"

echo "=================================================="
echo "🚀 Starting deployment to $SERVER_ALIAS ($DOMAIN)"
echo "=================================================="

# 1. Check/Install Docker & Docker Compose on Remote Server
echo "👉 Checking Docker installation on remote server..."
if ssh -o StrictHostKeyChecking=no $SERVER_ALIAS "which docker" > /dev/null 2>&1; then
    echo "✅ Docker is already installed."
else
    echo "📦 Docker not found. Installing Docker and Docker Compose on remote server..."
    ssh $SERVER_ALIAS "apt-get update && apt-get install -y docker.io docker-compose-v2"
    echo "✅ Docker installation complete."
fi

# 2. Check if Docker service is running
echo "👉 Checking Docker service status..."
ssh $SERVER_ALIAS "systemctl enable --now docker"

# 3. Create remote directory
echo "👉 Creating remote directory at $REMOTE_DIR..."
ssh $SERVER_ALIAS "mkdir -p $REMOTE_DIR"

# 4. Rsync code to server
echo "👉 Copying local project files to remote server..."
rsync -avz --delete \
      --exclude 'node_modules' \
      --exclude '.next' \
      --exclude '.git' \
      --exclude 'scratch' \
      --exclude 'deploy_to_server.sh' \
      --exclude 'run_remote.sh' \
      ./ $SERVER_ALIAS:$REMOTE_DIR/

# 5. Build and Start Docker Containers
echo "👉 Building and starting Docker containers on remote server..."
ssh $SERVER_ALIAS "cd $REMOTE_DIR && docker compose down && docker compose up -d --build"

echo "⏳ Waiting for containers to initialize and run Prisma migrations..."
sleep 15

# Check container status
ssh $SERVER_ALIAS "docker compose ps"

# 6. Configure Nginx Reverse Proxy
echo "👉 Configuring Nginx for $DOMAIN..."
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

# Enable config and reload Nginx
echo "👉 Enabling Nginx site and reloading..."
ssh $SERVER_ALIAS "ln -sf $NGINX_CONF /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"
echo "✅ Nginx reverse proxy configured successfully."

# 7. Check and configure SSL with Certbot
echo "👉 Checking Certbot on remote server..."
if ssh $SERVER_ALIAS "which certbot" > /dev/null 2>&1; then
    echo "✅ Certbot is installed."
else
    echo "📦 Certbot not found. Installing certbot and python3-certbot-nginx..."
    ssh $SERVER_ALIAS "apt-get update && apt-get install -y certbot python3-certbot-nginx || echo '⚠️ Certbot package install returned non-zero, continuing...'"
fi

echo "👉 Requesting SSL certificate from Let's Encrypt..."
ssh $SERVER_ALIAS "certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email || echo '⚠️ Certbot failed, check domain DNS record propagation'"

echo "=================================================="
echo "🎉 Deployment process finished!"
echo "Please verify the site at: http://$DOMAIN (or https://$DOMAIN)"
echo "=================================================="
