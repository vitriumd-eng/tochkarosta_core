# MODULE_TEMPLATE

## Files
- backend/
  - main.py
  - api/
  - services/
  - models/
  - migrations/
  - payments/
  - ai/
- frontend/
  - app/
    - home/page.tsx
  - lib/
    - api/
    - dtos/
  - themes/
- manifest.json
- Dockerfile

## manifest.json example
{
  "id": "shop",
  "name": "Online Shop",
  "version": "1.0.0",
  "dependencies": ["payments"],
  "themes": ["default", "premium"],
  "publicRoutes": ["/"],
  "dashboardRoutes": ["/admin","/settings"]
}
