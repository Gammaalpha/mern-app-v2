import express, { Express } from "express";
import mongoose, { mongo } from "mongoose";
import * as appInsights from "applicationinsights";
import * as path from "path";
// import * as cookieParser from "cookie-parser";
const bodyParser = require('body-parser');
// const mongoose = require("mongoose");
require('dotenv').config();
// let cors = require('cors');
let https = require('https');
let passport = require('passport');
// import * as passport from "passport";
import { getAccessToken } from "./services/tokens";
import { AuthorizationCode, AuthorizationTokenConfig } from 'simple-oauth2';
// import { Passport } from "passport";
import { OIDCStrategy } from "passport-azure-ad";
import { getUserDetails } from "./services/graph";
let createError = require('http-errors');
// let OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
let authRoute = require("./routes/api/Auth");
let logRoute = require('./routes/api/Log');
let session = require('express-session');
let flash = require('connect-flash');
// let graph = require('./services/graph');
let cookieParser = require('cookie-parser');

const appInsight = process.env.APPINSIGHTS_INSTRUMENTATIONKEY || null
if (appInsight !== null) {
    appInsights.setup(appInsight);
    appInsights.start();
}

let users: any = {};
// let passport = new Passport();
/**
 * ------------------------------------------------------
 * Passport setup
 * ------------------------------------------------------
 */
passport.serializeUser((user: any, done: any) => {
    users[user.profile.oid] = user;
    done(null, user.profile.oid);
})

passport.deserializeUser((id: any, done: any) => {
    done(null, users[id]);
})

const config = {
    client: {
        id: `${process.env.AZURE_CLIENT_ID}`,
        secret: `${process.env.AZURE_CLIENT_SECRET}`,
    },
    auth: {
        tokenHost: `${process.env.AUTHORITY}/${process.env.AZURE_TENANT_ID}/`,
        // tokenHost: `${process.env.AUTHORITY}`,
        // authorizationPatch: `${process.env.OAUTH_AUTHORIZE_ENDPIONT}`,
        tokenPath: `${process.env.OAUTH_TOKEN_ENDPOINT}`
    }
}

const loginRequest = {
    scopes: ["openid", "profile", "User.Read", "offline_access"],
    prompt: "select_account"
}
const signInComplete = async (iss: any, sub: any, profile: any, accessToken: any, refreshToken: any, params: any, done: any) => {
    const client = new AuthorizationCode(config);
    const tokenParams: AuthorizationTokenConfig = ({
        code: `${process.env.AZURE_CLIENT_SECRET}`,
        redirect_uri: `${process.env.OAUTH_REDIRECT_URI}`,
        scope: loginRequest.scopes
    })

    if (!profile.oid) {
        return done(new Error("No OID found in user profile."));
    }
    try {
        const user: any = await getUserDetails(accessToken);
        if (user) {
            profile['email'] = user.mail ? user.mail : user.userPrincipalName;
        }
    } catch (error) {
        console.error(error);

    }
    let oauthToken = client.createToken(params);
    users[profile.oid] = { profile, oauthToken };
    return done(null, users[profile.oid]);

}

// Configure OIDC strategy
passport.use(new OIDCStrategy(
    {
        identityMetadata: `${process.env.AUTHORITY}/${process.env.AZURE_TENANT_ID}/${process.env.OAUTH_ID_METADATA}`,
        clientID: `${process.env.AZURE_CLIENT_ID}`,
        responseType: 'code id_token',
        responseMode: 'form_post',
        redirectUrl: `${process.env.OAUTH_REDIRECT_URI}`,
        allowHttpForRedirectUrl: true,
        clientSecret: `${process.env.AZURE_CLIENT_SECRET}`,
        validateIssuer: false,
        passReqToCallback: false,
        scope: ["profile", "offline_access", "user.read"]
    },
    signInComplete
));




// Serve Static assests if in production
const PORT = process.env.PORT || 1337;
const app: Express = express();
// app.use(cors());
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Session middleware
// NOTE: Uses default in-memory session store, which is not
// suitable for production
app.use(session({
    secret: `${process.env.AZURE_CLIENT_SECRET}`,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy'
}));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


/** 
 * -------------------------------------------------------
 * Enable Cors
 * -------------------------------------------------------
 */

// if (process.env.NODE_ENV !== "production") {
//     app.use(function(req, res, next) {
//         res.header("Access-Control-Allow-Origin", "http://localhost:3000/*"); // update to match the domain you will make the request from
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//         next();
//       });
// }

/**
 * -------------------------------------------------------
 * Connect to mongodb
 * -------------------------------------------------------
 */
const dbConn = `mongodb://${process.env.COSMOS_MONGO_USERNAME}:${process.env.COSMOS_MONGO_PASSWORD}@${process.env.COSMOS_DB_PATH}`;
const checkMongooseState = () => {
    const state = mongoose.STATES[mongoose.connection.readyState]
    console.log("Mongoose state: ", state);
    return state;
}
if (checkMongooseState() === "disconnected") {

    mongoose.connect(dbConn, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result: any) => {
            console.log("⚡️[server]: MongoDB connection established...");
            checkMongooseState();
        }).catch((err: Error) => {
            console.error("Error in connecting to MongoDB: ", err);
        });
}

const server = app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

/**
 * -------------------------------------------------------
 * Logger Middlware
 * -------------------------------------------------------
 */
const loggerMiddleware = (req: express.Request, res: express.Response, next: any) => {
    console.log(`${process.env.NODE_ENV} ${req.method} ${req.path}`);
    next();
}
app.use(loggerMiddleware);

/**
 * -------------------------------------------------------
 * Welcome Routes
 * -------------------------------------------------------
 */

app.get('/api/welcome', (req: any, res: any) => res.json({ msg: 'Why hello there! said Kanobi to the sith lord ;-)' }));


// redirect to welcome on '/'
app.get("/api", (req: any, res: any) => {
    res.status(301).redirect("/api/welcome");
})


/**
 * -------------------------------------------------------
 * Auth Routes
 * -------------------------------------------------------
 */

app.use('/api/auth', authRoute);

/**
 * -------------------------------------------------------
 * Log Routes
 * -------------------------------------------------------
 */
app.get('/api/logs/all', logRoute.all);
app.use("/api/logs", logRoute);

// redirect logs base to logs/all
app.get("/api/logs", (req: express.Request, res: express.Response) => {
    res.status(301).redirect("/api/logs/all");
})

/**
 * -------------------------------------------------------
 * Setting Front-End in production
 * -------------------------------------------------------
 */

if (process.env.NODE_ENV === "production") {
    console.log("In production, using client.");
    const __dirname = path.resolve();
    app.use(express.static(path.resolve(__dirname, "client"))); // change this if your dir structure is different
    app.get("*", (req: express.Request, res: express.Response) => {
        res.sendFile(path.resolve(__dirname, "client", "index.html"));
    });
}
else {
    app.get("*", (req: express.Request, res: express.Response) => {
        res.status(301).redirect("/api/welcome");
    });
}

const serverStatus = () => {
    return {
        state: 'up',
        dbState: checkMongooseState()
    }
}

/**
 * -------------------------------------------------------
 * DB Status Check
 * -------------------------------------------------------
 */

app.use('/api/db_status', (req: any, res: any) => {
    res.json({
        healthStatus: serverStatus()
    })
})

export default server;