# Collectr
Group project for Mount Allison's COMP-4721 (Software Design) Course

## Team members
- **Nimesh Nayaju** (Project Manager and Product Owner)
- **Weiting Li** (Revision Control Master)
- **Patrick Andrews** (Scrum Master)
- **Saralin Zassman** (Documentation Lead)
- **Alexander Little** (Architect)

The overall **project** comprises of a [back-end server](https://github.com/nimeshnayaju/collectr) and a "[front-end server](https://github.com/nimeshnayaju/collectr-client) developed in separate GitHub repositories. Please refer to [collectr-client](https://github.com/nimeshnayaju/collectr-client) to learn about our front-end development.

## Installation

Clone the repo;

```bash
git clone --depth 1 https://github.com/nimeshnayaju/collectr.git
cd collectr
```

Install the dependencies:

```bash
npm install
```

The environment variables can be found and modified in the `.env` file.

```bash
# Port number
PORT=

# MongoDB URL
# Production
PROD_MONGODB_URI=
# Development
DEV_MONGODB_URI=

# Active environment
ACTIVE_ENV=

# JWT
# JWT Secret Key
ACCESS_TOKEN_SECRET=
# Number of minutes after which an access token expires
ACCESS_TOKEN_LIFE=

# SMTP configuration options for the email service (smtp.gmail.com used by default)
FROM_EMAIL=
FROM_PASSWORD=

# Server URL
SERVER_URL=

# Client URL
CLIENT_URL=
```

## Commands

Running locally:

```bash
npm run dev-start
```

Running in production:

```bash
npm start
```

Testing:

```bash
# run all tests
npm run test
```