import React, { useState, useEffect, useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../state/auth.context";

interface IProtectedRouteProps {
    path: string[] | string,
    component: any,
    exact?: boolean,
}

export default function ProtectedRoute(props: IProtectedRouteProps) {

    const { auth } = useContext(AuthContext)
    const render = () => {
        const Component = props.component;
        return <Route path={props.path} render={(innerProps: any) => auth.isAuthenticated ? <Component {...innerProps} /> : <Redirect to="/login" />} />

    }

    return render();
};
