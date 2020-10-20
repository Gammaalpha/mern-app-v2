export const prodCheck = (envName: string): string => {
    let env = envName;
    if (process.env.NODE_ENV === "production") {
        env = envName.replace("REACT_APP_", "");
    }
    return process.env[env] || "";



}