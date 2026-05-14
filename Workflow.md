# Запуск проекта

## Требования

- `Node.js` 24+
- `npm` 8+
- `Docker` и `docker compose` для локального MongoDB

## Установка

```bash
npm install
cd frontend && npm install && cd ..
cp .env.example .env
docker compose up -d
npm run start
```

REST API будет доступен на `http://localhost:4000`.

Фронтенд можно поднять отдельно из директории `frontend`, например:

```bash
cd frontend
python3 -m http.server 3000 --directory public
```

По умолчанию фронтенд ожидает API на `http://<host>:4000`. При запуске бэкенда и фронтенда на одном хосте дополнительная настройка не требуется.

## Переменные окружения

- `PORT=4000` — порт REST API
- `DB_HOST=127.0.0.1` — хост MongoDB
- `DB_PORT=27018` — порт MongoDB
- `DB_USER=admin` — пользователь MongoDB
- `DB_PASSWORD=test` — пароль MongoDB
- `DB_NAME=six-cities` — имя базы данных
- `SALT=your-secret-salt-here` — соль для хеширования паролей
- `UPLOAD_DIRECTORY=./upload` — директория загружаемых файлов
- `JWT_SECRET=your-secret-jwt-key-here` — секрет подписи JWT

Если обязательная переменная отсутствует, приложение завершает запуск с ошибкой.

## Сценарии

- `npm run cli` — собирает проект и запускает CLI
- `npm start` — собирает и запускает REST API
- `npm run start:dev` — запуск REST API через `nodemon`
- `npm run build` — очищает `dist` и компилирует TypeScript
- `npm run compile` — компилирует TypeScript
- `npm run clean` — удаляет `dist`
- `npm run lint` — проверяет `src` линтером
- `npm run ts` — запускает `ts-node`
- `npm run mock:server` — поднимает `json-server` с моками

## CLI

```bash
node cli.js --help
node cli.js --version
node cli.js --generate 20 ./mocks/offers.tsv http://localhost:3123/api
node cli.js --import ./mocks/offers.tsv
```

Формат одной строки TSV для импорта:

```text
title<TAB>description<TAB>postDate<TAB>city<TAB>previewImage<TAB>images(; separated)<TAB>isPremium<TAB>isFavorite<TAB>rating<TAB>type<TAB>rooms<TAB>guests<TAB>price<TAB>goods(; separated)<TAB>authorName<TAB>authorEmail<TAB>authorAvatarPath<TAB>authorPassword<TAB>authorType<TAB>latitude<TAB>longitude
```

## Основные REST-ресурсы

- `POST /api/users` — регистрация пользователя
- `POST /api/auth/login` — логин
- `POST /api/auth/logout` — logout авторизованного пользователя
- `GET /api/users/me` — проверка состояния пользователя
- `PATCH /api/users/me` — обновление текущего пользователя
- `POST /api/users/avatar` — загрузка аватара текущего пользователя
- `GET /api/offers` — список предложений
- `POST /api/offers` — создание предложения
- `GET /api/offers/:offerId` — карточка предложения
- `PATCH /api/offers/:offerId` — редактирование своего предложения
- `DELETE /api/offers/:offerId` — удаление своего предложения
- `GET /api/offers/:offerId/comments` — комментарии предложения
- `POST /api/comments` — добавить комментарий
- `GET /api/offers/premium/:city` — премиальные предложения города
- `GET /api/favorites` — избранные предложения
- `POST /api/favorites/:offerId` — добавить в избранное
- `DELETE /api/favorites/:offerId` — удалить из избранного
- `GET /api/favorites/:offerId/check` — проверить, находится ли предложение в избранном
