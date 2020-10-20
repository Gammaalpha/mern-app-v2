import { makeStyles, Container, Paper, Button } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../state/auth.context";
const styles = makeStyles({
    mainContainer: {
        padding: 25,
        width: '75%',
        minHeight: '75%'
    },
    column: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
        padding: 20
    },

    textField: {
        // marginBottom: 10,
        marginTop: 10
    },
    button: {
        // paddingTop: 10,
        // paddingBottom: 10,
        marginBottom: 10,
        marginTop: 10
    }
})

export default function Login() {

    const { auth } = useContext(AuthContext);

    const classes = styles();
    const [email] = useState("");
    const [password] = useState("");
    const [, setEmailValid] = useState(false);



    const validateEmail = () => {
        const regex = /^[A-Za-z0-9._]+@ontario.ca$/g;
        return regex.test(email) && email.length > 0;
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
    }

    useEffect(() => {
        console.log("in login: ", auth)
    }, [auth])

    useEffect(() => {
        if (email !== "") {
            setEmailValid(validateEmail());
        }
    }, [email])


    const userNotAuthenticatedRender = () => {
        return (
            <Paper>
                <h1>
                    Welcome to the Tracker Manager tool.
                    </h1>
                <form onSubmit={handleSubmit} autoComplete="off" className={classes.column}>
                    <div className={`${classes.column}`} >
                        <p>
                            Please sign in by clicking the button below to use the site functions.
                        </p>
                        <Button onClick={() => { auth.login() }} variant="contained" color="primary" aria-label="Sign in using OPS single sign on credentials.">
                            Sign-In
                        </Button>
                    </div>
                </form>
            </Paper>
        );
    }

    const userAuthenticatedRender = () => {
        return (
            <Paper>
                <h1>
                    Welcome to the Tracker Manager tool. You have been authenticated.
            </h1>
                <form onSubmit={handleSubmit} autoComplete="off" className={classes.column}>
                    <div className={`${classes.column}`} >
                        <p>
                            You can sign-out by clicking the button below.
                    </p>
                        <Button onClick={() => auth.logout()} variant="contained" color="primary" aria-label="Sign out button.">
                            Sign-Out
                    </Button>
                    </div>
                </form>
            </Paper>
        );
    }

    const render = () => {
        return <div>
            <Container className={classes.mainContainer}>
                {auth.isAuthenticated ? userAuthenticatedRender() : userNotAuthenticatedRender()}
            </Container>
        </div>
    }

    return render();
};