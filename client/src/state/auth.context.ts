import { createContext } from "react";
import { IMsalAuth } from "../models/Auth";

export interface IAuthContext {
    auth: IMsalAuth;
    setAuth: (authData: IMsalAuth) => void;
}

export const AUTH_DEFAULT_VALUE: IMsalAuth = {
    error: null,
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
    // accessToken: ""

}

export const AuthContext = createContext<IAuthContext>({ auth: AUTH_DEFAULT_VALUE, setAuth: () => { } })