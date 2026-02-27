#!/bin/bash

# =============================================================================
# DevBoards - Script de Despliegue para Ubuntu Server 25.10
# =============================================================================
# Uso: 
#   chmod +x deploy.sh
#   sudo ./deploy.sh
# =============================================================================

set -e  # Salir si hay error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sin color

# Configuración
APP_NAME="devboards"
APP_DIR="/var/www/DevBoards"
REPO_URL="https://github.com/MCarmen96/DevBoards.git"
DOMAIN=""  # Se pedirá al usuario
NODE_VERSION="20"

# Funciones
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_header() {
    echo ""
    echo "========================================"
    echo " $1"
    echo "========================================"
    echo ""
}

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    print_error "Este script debe ejecutarse como root (sudo ./deploy.sh)"
    exit 1
fi

print_header "DevBoards - Instalación en Ubuntu Server"

# Pedir dominio o IP
read -p "Introduce el dominio o IP del servidor (ej: devboards.com o 192.168.1.100): " DOMAIN
if [ -z "$DOMAIN" ]; then
    print_error "Debes introducir un dominio o IP"
    exit 1
fi

# =============================================================================
# 1. Actualizar sistema
# =============================================================================
print_header "1. Actualizando sistema"
apt update && apt upgrade -y
print_status "Sistema actualizado"

# =============================================================================
# 2. Instalar Node.js
# =============================================================================
print_header "2. Instalando Node.js v${NODE_VERSION}"

if command -v node &> /dev/null; then
    CURRENT_NODE=$(node -v)
    print_warning "Node.js ya instalado: $CURRENT_NODE"
else
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs
    print_status "Node.js instalado: $(node -v)"
fi

# =============================================================================
# 3. Instalar dependencias del sistema
# =============================================================================
print_header "3. Instalando dependencias"
apt install -y git nginx build-essential
print_status "Git, Nginx y build-essential instalados"

# =============================================================================
# 4. Instalar PM2
# =============================================================================
print_header "4. Instalando PM2"
if command -v pm2 &> /dev/null; then
    print_warning "PM2 ya instalado"
else
    npm install -g pm2
    print_status "PM2 instalado"
fi

# =============================================================================
# 5. Clonar repositorio
# =============================================================================
print_header "5. Clonando repositorio"

if [ -d "$APP_DIR" ]; then
    print_warning "El directorio $APP_DIR ya existe"
    read -p "¿Deseas eliminarlo y clonar de nuevo? (s/n): " CONFIRM
    if [ "$CONFIRM" = "s" ]; then
        rm -rf "$APP_DIR"
        git clone "$REPO_URL" "$APP_DIR"
        print_status "Repositorio clonado"
    else
        cd "$APP_DIR"
        git pull origin main
        print_status "Repositorio actualizado"
    fi
else
    mkdir -p /var/www
    git clone "$REPO_URL" "$APP_DIR"
    print_status "Repositorio clonado en $APP_DIR"
fi

# =============================================================================
# 6. Instalar dependencias de la app
# =============================================================================
print_header "6. Instalando dependencias de la aplicación"
cd "$APP_DIR/devboards"
npm install
print_status "Dependencias instaladas"

# =============================================================================
# 7. Configurar variables de entorno
# =============================================================================
print_header "7. Configurando variables de entorno"

# Generar NEXTAUTH_SECRET aleatorio
NEXTAUTH_SECRET=$(openssl rand -base64 32)

cat > .env << EOF
# Base de datos
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="http://${DOMAIN}"

# Entorno
NODE_ENV="production"
EOF

print_status "Archivo .env creado"

# =============================================================================
# 8. Configurar Prisma y base de datos
# =============================================================================
print_header "8. Configurando base de datos"
npx prisma generate
npx prisma db push
print_status "Base de datos configurada"

read -p "¿Deseas cargar datos de prueba? (s/n): " LOAD_SEED
if [ "$LOAD_SEED" = "s" ]; then
    npm run db:seed
    print_status "Datos de prueba cargados"
fi

# =============================================================================
# 9. Compilar aplicación
# =============================================================================
print_header "9. Compilando aplicación para producción"
npm run build
print_status "Aplicación compilada"

# =============================================================================
# 10. Configurar PM2
# =============================================================================
print_header "10. Configurando PM2"

# Detener instancia anterior si existe
pm2 delete "$APP_NAME" 2>/dev/null || true

# Crear archivo de configuración de PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '${APP_DIR}/devboards',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF

# Iniciar aplicación
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root
print_status "PM2 configurado y aplicación iniciada"

# =============================================================================
# 11. Configurar Nginx
# =============================================================================
print_header "11. Configurando Nginx"

cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name ${DOMAIN};

    # Logs
    access_log /var/log/nginx/${APP_NAME}_access.log;
    error_log /var/log/nginx/${APP_NAME}_error.log;

    # Tamaño máximo de subida (para imágenes)
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Archivos estáticos
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /uploads {
        alias ${APP_DIR}/devboards/public/uploads;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Vídeos estáticos (servidos directamente por Nginx)
    location /videos {
        alias ${APP_DIR}/devboards/public/videos;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        add_header Accept-Ranges bytes;
        types {
            video/mp4  mp4;
            video/webm webm;
        }
    }
}
EOF

# Activar sitio
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx
print_status "Nginx configurado"

# =============================================================================
# 12. Configurar Firewall
# =============================================================================
print_header "12. Configurando Firewall"
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
print_status "Firewall configurado"

# =============================================================================
# 13. Resumen final
# =============================================================================
print_header "¡Instalación completada!"

echo ""
echo "========================================"
echo "         RESUMEN DE INSTALACIÓN"
echo "========================================"
echo ""
echo "  Aplicación:    DevBoards"
echo "  URL:           http://${DOMAIN}"
echo "  Directorio:    ${APP_DIR}/devboards"
echo "  Puerto:        3000 (interno)"
echo ""
echo "  Comandos útiles:"
echo "    pm2 status              - Ver estado"
echo "    pm2 logs ${APP_NAME}    - Ver logs"
echo "    pm2 restart ${APP_NAME} - Reiniciar"
echo ""

if [ "$LOAD_SEED" = "s" ]; then
echo "  Cuentas de prueba:"
echo "    ana@devboards.com / password123"
echo "    carlos@devboards.com / password123"
echo "    maria@devboards.com / password123"
echo ""
fi

echo "========================================"
echo ""
print_status "Accede a http://${DOMAIN} para ver la aplicación"
echo ""
print_status "¡Despliegue finalizado!"
