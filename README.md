# BillCraft

## Local development

The API reads environment variables from `backend/.env` when started from the backend directory:

```env
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a long random secret>
GEMINI_API_KEY=<your Google Gemini API key>
# Optional; defaults to gemini-3.6-flash
GEMINI_MODEL=gemini-3.6-flash
# Optional comma-separated fallbacks; defaults to gemini-3.8-flash
GEMINI_FALLBACK_MODELS=gemini-3.8-flash
PORT=8000

# Required to send email directly from BillCraft
SMTP_HOST=<your email provider SMTP host>
SMTP_PORT=587
SMTP_USER=<your SMTP username>
SMTP_PASS=<your SMTP password or app password>
SMTP_FROM=<verified sender email address>
# Set true when your provider requires implicit TLS (commonly port 465)
SMTP_SECURE=false
```

Start the backend with `cd backend && npm install && npm run dev`. AI invoice extraction, payment reminders, and dashboard insights require `GEMINI_API_KEY`; invoice management remains available without it.

In a second terminal, start the frontend with `cd frontend/BillCraft && npm install && npm run dev`. Vite proxies `/api` to `http://localhost:8000` by default. Set `VITE_API_PROXY_TARGET` in the frontend environment to use a different backend URL.

Email delivery uses the SMTP provider configured above. Keep SMTP credentials only in `backend/.env`; never put them in frontend variables. `SMTP_FROM` must be an address your provider permits. For Gmail, use an app password rather than your account password. Restart the backend after changing these values.

## Production deployment

BillCraft runs as two services: an Express API and a static React frontend. Both require Node.js 20.19.0 or newer. Use the example environment files as templates, and set real secrets in your hosting provider's environment settings.

### Backend API

- Set the service root to `backend/`.
- Install with `npm ci` and start with `npm start`.
- Set `MONGO_URI` and a strong, unique `JWT_SECRET`.
- Set `CORS_ORIGIN` to the exact public frontend origin, including `https://` and no path.
- Set `GEMINI_API_KEY` to enable invoice extraction, dashboard insights, and AI reminder drafts. Model overrides are optional.
- Set the `SMTP_*` variables to enable direct email delivery; these are not needed to draft reminders.
- Allow the hosting service to connect to MongoDB in your database network access rules.

### Frontend

- Set the static-site root to `frontend/BillCraft/`.
- Install with `npm ci`, build with `npm run build`, and publish `dist/`.
- Set `VITE_API_BASE_URL` to the public backend origin before building. This value is included in the browser bundle and must not contain secrets.
- Configure the static host to serve `index.html` for unknown paths so React Router routes such as `/how-it-works` work on direct visits.
- `VITE_API_PROXY_TARGET` is for the local Vite development server only; production requests use `VITE_API_BASE_URL`.

`backend/.env.example` and `frontend/BillCraft/.env.example` list the available variables without credentials.

### Provider configuration

- **Render:** use the root `render.yaml` Blueprint. After the services are created, set the API's `CORS_ORIGIN` to the static-site URL and the frontend's `VITE_API_BASE_URL` to the API URL, then redeploy the frontend.
- **Railway:** create one service with root directory `backend/` and another with root directory `frontend/BillCraft/`. Each directory contains a `railway.toml`; set the same API/frontend URL variables in the service settings.
- **AWS:** run the backend as a Node.js Elastic Beanstalk application from `backend/` (the `Procfile` starts the API). Build the frontend with `VITE_API_BASE_URL` set, create the private S3/CloudFront frontend from `deploy/aws/frontend-cloudfront.template.json`, and upload `dist/` to its bucket. Set `CORS_ORIGIN` to the CloudFront URL.

These files describe deployment configuration only; cloud resources and secrets must be created in the selected provider account. For AWS, invalidate the CloudFront cache after uploading a new build.