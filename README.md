# EdenGreen

## Setup

**Clone repo**

- `git clone https://github.com/54Factory/upworkAuthRolesRouting.git`
- `cd upworkAuthRolesRouting`

**Configure email provider**

- `firebase functions:config:set email.provider=Gmail`
- `firebase functions:config:set email.auth.user=your_email`
- `firebase functions:config:set email.auth.password=your_password`

**Set environment variables**

Create a file called .env and paste this into it.

```
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_CLOUD_FUNCTIONS=your_cloud_function_url
```

**Create admin user**

Login to firebase console and create a user with the email `admin@admin.co`

**Run**

`yarn start` or `npm run start`

Database Graph
---
https://mongo.tools/ed/project/5c3645b263d6f961f60e9787


TODO
---
- Copy user photo to photos document
- Make user decide to be Driver or Customer on first login
- Create Admin Page, Driver Page, Customer Page
