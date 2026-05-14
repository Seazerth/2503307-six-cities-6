# Six Cities Frontend

Frontend for the Six Cities rental service. The application is a lightweight HTML/JavaScript client for the REST API backend.

## Implemented Scenarios

1. User registration
2. User login
3. Authentication check by token
4. Offers list on the main page
5. Offer creation
6. Offer details page
7. Comment creation
8. Favorites management
9. User logout

## Run

Requirements:

- Node.js 24+
- Running backend API

Install and start:

```bash
cd frontend
npm install
npm start
```

By default the app is available at `http://localhost:3000`.

The frontend expects the backend API at `http://<host>:4000`. If needed, define runtime config before loading `api.js`:

```html
<script>
  window.__SIX_CITIES_CONFIG__ = {
    apiOrigin: 'http://localhost:4000',
    apiBaseUrl: 'http://localhost:4000/api'
  };
</script>
```

## API Resources Used

Authentication:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`

Users:

- `POST /api/users`
- `PATCH /api/users/me`
- `POST /api/users/avatar`

Offers:

- `GET /api/offers?limit=60`
- `GET /api/offers/:offerId`
- `POST /api/offers`
- `PATCH /api/offers/:offerId`
- `DELETE /api/offers/:offerId`
- `GET /api/offers/premium/:city`

Comments:

- `GET /api/offers/:offerId/comments`
- `POST /api/comments`

Favorites:

- `GET /api/favorites`
- `POST /api/favorites/:offerId`
- `DELETE /api/favorites/:offerId`
- `GET /api/favorites/:offerId/check`

## Data Shapes

User:

```js
{
  id: string,
  name: string,
  email: string,
  avatarPath: string,
  userType: 'ordinary' | 'pro'
}
```

Offer summary:

```js
{
  id: string,
  title: string,
  postDate: string,
  city: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf',
  previewImage: string,
  isPremium: boolean,
  isFavorite: boolean,
  rating: number,
  type: 'apartment' | 'house' | 'room' | 'hotel',
  price: number,
  commentCount: number
}
```

Offer details:

```js
{
  ...offerSummary,
  description: string,
  images: string[],
  rooms: number,
  guests: number,
  goods: string[],
  author: User,
  location: {
    latitude: number,
    longitude: number
  }
}
```

Comment:

```js
{
  id: string,
  text: string,
  postDate: string,
  rating: number,
  offerId: string,
  author: User
}
```
