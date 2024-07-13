# Usa una imagen base de Node.js
FROM node:20

# Establece el directorio de trabajo en el contenedor
WORKDIR /root/

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Instala las dependencias del sistema necesarias para Puppeteer y cron
RUN apt-get update && \
    apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libxcomposite1 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxdamage1 \
    libgtk-3-0 \
    libgbm1 \
    wget \
    unzip \
    cron

# Instala Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb

# Copia el resto de la aplicación en el directorio de trabajo
COPY . .

# Establece la variable de entorno para Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Añade el archivo de cron job
COPY cron-job /etc/cron.d/my-cron-job

# Da permisos de ejecución al archivo de cron job
RUN chmod 0644 /etc/cron.d/my-cron-job

# Crea el archivo de script de inicio
COPY start.sh /start.sh

# Da permisos de ejecución al script de inicio
RUN chmod +x /start.sh

# Define el comando por defecto para ejecutar la aplicación
CMD ["/start.sh"]
