# MERN App with OAuth2

## About

App template built with MongoDb, Express, React and Node with OAuth2 using passport.js for session management. This app was built for AzureAD OAuthv2 authentication management using passport-azure-ad. This app also uses Webpack, babel and typescript to build and compile the project for easy deployment onto Azure Web Services running on Ubuntu-latest.

## Azure App Registration Configuration

To ensure proper working complete the steps below.

### Manifest

Find the value "accessTokenAcceptedVersion" and change it to 2

This will allow for the OAuthv2 to be retrieved.

### Authentication

Add the following URLs into the Authentication section

#### Local Dev Environment

http://localhost:3000/api/auth/callback
http://localhost:1337/api/auth/callback


#### Production environment

Add the url for your azure site e.g.

https://<custom_url>.azurewebsites.net/api/auth/callback

## Environments used

The following environment variables are used in the app at the server directory level.

`Note: In production, add these variables as well`

WEBSITE_NODE_DEFAULT_VERSION="12.18.3"
WEBSITE_HTTPLOGGING_RETENTION_DAYS="7"

NODE_ENV="development"

AZURE_TENANT_ID=""
AZURE_CLIENT_ID=""
AZURE_CLIENT_SECRET=""

COSMOS_URI=""
COSMOS_MONGO_USERNAME=""
COSMOS_MONGO_PASSWORD=""
COSMOS_DB_PATH=""

AUTHORITY="https://login.microsoftonline.com"

OAUTH_REDIRECT_URI="http://localhost:3000/api/auth/callback"
OAUTH_AUTHORIZE_ENDPOINT="oauth2/v2.0/authorize"
OAUTH_TOKEN_ENDPOINT="oauth2/v2.0/token"
OAUTH_ID_METADATA="v2.0/.well-known/openid-configuration"
OAUTH_SCOPES='profile offline_access user.read calendars.read'
OAUTH_ID_METADATA="v2.0/.well-known/openid-configuration"
