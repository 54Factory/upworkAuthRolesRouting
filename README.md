# EdenGreen

## Setup

**Clone repo**

- `git clone https://github.com/54Factory/upworkAuthRolesRouting.git`
- `cd upworkAuthRolesRouting`

**Configure email provider**

- `firebase functions:config:set email.host=smtp.somemail.host`
- `firebase functions:config:set email.port=587`
- `firebase functions:config:set email.auth.user=your_email`
- `firebase functions:config:set email.auth.password=your_password`

**Set environment variables**

Create a file called .env and paste this into it.

    # upworkAuthRolesRouting/.env
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_DATABASE_URL=your_database_url
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_CLOUD_FUNCTIONS=your_cloud_function_url
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_gc_storage_bucket_url


**Create admin user**

Login to firebase console and create a user with the email `admin@admin.co`

**Run**

`yarn start` or `npm run start`

