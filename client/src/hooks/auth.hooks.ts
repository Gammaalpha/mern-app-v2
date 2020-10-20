import { useState, useCallback } from "react";
import { IAuthContext, AUTH_DEFAULT_VALUE } from "../state/auth.context";

export const useAuth = (_default = AUTH_DEFAULT_VALUE): IAuthContext => {
    const [auth, setAuthState] = useState(_default);

    const setAuth = useCallback((data: any) => {
        setAuthState(data)
    }, []);

    return {
        auth,
        setAuth
    };
}