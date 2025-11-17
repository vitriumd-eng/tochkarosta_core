# Platform Dashboard

Dashboard for managing platform landing page content.

## Access

- **URL**: `http://localhost:7001/platform-dashboard`
- **Login**: `89535574133`
- **Password**: `Tehnologick987`
- **Role**: `platform_master`

## Running

To run the platform dashboard on port 7001:

```bash
npm run dev:auth
```

Or:

```bash
next dev -p 7001
```

## Features

- Manage landing page content sections
- Edit hero banner, features, pricing, etc.
- JSON-based content editing
- Authentication via login/password (not OTP)

## Structure

- `/platform-dashboard/login` - Login page
- `/platform-dashboard` - Main dashboard
- `/platform-dashboard/sections/[key]` - Content section editor

## API

- `POST /api/platform/login` - Platform master login
- `GET /api/platform/content` - Get all content sections
- `PUT /api/platform/content/{key}` - Update content section


