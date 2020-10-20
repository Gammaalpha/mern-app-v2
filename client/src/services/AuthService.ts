import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { graphConfig } from "../configs/graphConfig";
import { ajax } from "rxjs/ajax";
type GRAPH_TYPE = 'me' | "mail";

export class AuthService {
    // private msalInstance: UserAgentApplication;

    constructor() {
        // console.log("msalConfig", MSAL_CONFIG);
        // this.msalInstance = new UserAgentApplication(MSAL_CONFIG);
        // console.log("MSAL", this.msalInstance);
    }

    // public login = () => {
    //     return from(this.msalInstance.loginPopup(loginRequest))
    //         .pipe(
    //             map((loginResponse: AuthResponse) => {
    //                 // console.log("Login Response: ", loginResponse);
    //                 return loginResponse;
    //             }),
    //             catchError((error: Error) => {
    //                 throw "Login Error Encountered: " + error
    //             })
    //         );
    // }

    // public logout = () => {
    //     this.msalInstance.logout();
    // }

    public callMSGraph = (theUrl: string, accessToken: string, callback: any) => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                let status = xmlHttp.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    console.log("xmlHttp responnse text: ", xmlHttp.responseText);
                    return callback(JSON.parse(xmlHttp.responseText))
                }
            }
        }
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.setRequestHeader("Authorization", "Bearer" + accessToken);
        xmlHttp.send();
    }


    public normalizeError(error: string | Error): any {
        var normalizedError = {};
        if (typeof (error) === 'string') {
            var errParts = error.split('|');
            normalizedError = errParts.length > 1 ?
                { message: errParts[1], debug: errParts[0] } :
                { message: error };
        } else {
            normalizedError = {
                message: error?.message,
                debug: JSON.stringify(error)
            };
        }
        return normalizedError;
    }

    public getSession() {
        return ajax.getJSON("/api/auth/session").pipe(
            map((res: any) => {
                // console.log("session response: ", res);
                return res
            }),
            catchError((err: Error) => {
                console.error("Error in retrieving session information\n ", err);
                return throwError(err)
            })
        )
    }

    // public getSession() {
    //     return from(fetch("/api/auth/session").then((res: any) => {
    //         return res.json()
    //     }).then(result => {
    //         console.log(result);
    //         return result;
    //     }))
    // }

    public signOut = () => {
        return ajax.getJSON("/api/auth/signout").pipe(map(() => {
            console.log("Sign-Out done.");
        }))
    }

    public jsonResponse = (data: any) => {
        console.log("MS Graph callback data: ", data);
    }

    public getMsGraphData = (type: GRAPH_TYPE, accessToken: string) => {
        let account = null;
        switch (type) {
            case "me":
                account = this.callMSGraph(graphConfig.graphMeEndpoint, accessToken, this.jsonResponse)
                break;
            case "mail":
                account = this.callMSGraph(graphConfig.graphMailEndpoint, accessToken, this.jsonResponse)
                break;
            default:
                break;
        }
        return account;
    }

};

