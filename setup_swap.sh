#!/bin/bash
# setup_swap.sh
# Автоматически настраивает 2GB Swap на удаленном сервере omega

echo "=================================================="
echo "⚙️ Настройка файла подкачки (Swap) на сервере..."
echo "=================================================="

ssh omega "
if [ ! -f /swapfile ]; then
    echo '👉 Файл подкачки не найден. Создаем 2GB Swap...'
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo '✅ Файл подкачки (2GB Swap) успешно создан и подключен!'
    echo '📊 Текущая память на сервере:'
    free -h
else
    echo 'ℹ️ Файл подкачки уже существует на сервере:'
    free -h
fi
"
