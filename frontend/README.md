# Frontend Deployment Instructions

## 1. Environment Variables

Create a `.env` file in the `frontend` directory with the following content:

```
VITE_API_URL=https://your-backend-domain.com
```

Replace the value with your actual backend URL for production.

## 2. Install Dependencies

```
npm install
```

## 3. Build for Production

```
npm run build
```

The production-ready files will be in the `dist/` folder.

## 4. Preview Production Build (Optional)

```
npm run preview
```

---

For local development, you can use the default `.env` with `VITE_API_URL=http://localhost:8080`.
