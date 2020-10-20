export interface IMsalAuth {
    error: any;
    isAuthenticated: boolean;
    user: any;
    login: Function;
    logout: Function;
    // accessToken: String;
    expireAt?: string;
}

export interface IMsalAuthProvider {
    error: any;
    isAuthenticated: boolean;
    user: any;
}