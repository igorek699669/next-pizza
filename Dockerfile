# Используем официальный образ Node.js
FROM node:22 AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# генерируем prisma client
RUN npm run prisma:generate

# Собираем приложение
RUN npm run build

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Открываем порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]