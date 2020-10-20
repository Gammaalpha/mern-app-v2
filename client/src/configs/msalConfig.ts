import { Configuration, LogLevel, Logger } from "msal";
import { prodCheck } from "./common";

export const MSAL_CONFIG: Configuration = {
    auth: {
        clientId: prodCheck("REACT_APP_AZURE_CLIENT_ID") !== undefined ? prodCheck("REACT_APP_AZURE_CLIENT_ID") : '',
        // authority: `${process.env.REACT_APP_AUTHORITY}/${process.env.REACT_APP_AZURE_TENANT_ID}`,
        authority: `${prodCheck("REACT_APP_AUTHORITY")}/${prodCheck("REACT_APP_AZURE_TENANT_ID")}`,
        redirectUri: `${window.location.origin}`,
        // postLogoutRedirectUri: `${process.env.REACT_APP_BASE_URI}/logout`,
        navigateToLoginRequestUrl: true,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
    system: {
        // logger:{}
        logger: new Logger(
            (level, message, contaisnPii) => {
                if (contaisnPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            },
            {
                level: LogLevel.Verbose,
                piiLoggingEnabled: false
            }),
        // windowHashTimeout: 60000,
        // iframeHashTimeout: 6000,
        loadFrameTimeout: 0
    }
}

export const loginRequest = {
    scopes: ["openid", "profile", "User.Read"],
    prompt: "select_account"
}

export const tokenRequest = {
    scopes: ["User.Read", "Mail.Read"],
    forceRefresh: false
}