# Используем официальный образ Node.js версии 20
FROM node:20-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем остальной код приложения
COPY . .

# Указываем, что приложение слушает порт 3000
EXPOSE 3000

# Команда для запуска приложения
CMD [ "npm", "start" ]
