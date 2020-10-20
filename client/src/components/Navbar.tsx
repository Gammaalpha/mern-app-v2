import React, { useContext } from "react";
import { makeStyles, Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { INavBarprops } from "../models/NavBar";
import { AuthContext } from "../state/auth.context";
const styles = makeStyles({
    navbar: {
        paddingTop: '5px',
        paddingBottom: '5px',
        backgroundColor: "#282c34",
        minHeight: '8vh',
        display: 'flex',
        flexDirection: 'column',
        color: 'white'
    },
    selected: {
        color: "white"
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,

    },
    navLinks: {
        display: 'flex',
        listStyle: "none",
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "space-evenly",
        width: "auto",
    },
    navLinkActive: {
        textDecoration: 'none',
        fontWeight: "bold",
        border: "2px solid white",
        borderRadius: '5px',
        color: "white",
        padding: 2
    },
    navLink: {
        textDecoration: 'none',
        color: "white!important",
        padding: 10
    },
    siteTitle: {
        fontSize: 'calc(10px + 2vmin)'
    },
    displayNone: {
        display: 'none',
    }
})

export default function Navbar() {
    const classes = styles();
    const { auth } = useContext(AuthContext)
    const navbarRender = () => {

        // const isAuthenticated = props.isAuthenticated;
        return <header className={`${classes.navbar} ${classes.row}`}>
            <div className={classes.siteTitle}>
                Azure Auth Protected
                </div>
            <nav className={classes.row}>
                <div className={auth.isAuthenticated ? "" : classes.displayNone} >
                    <ul className={classes.navLinks}>
                        <NavLink to="/home"
                            className={classes.navLink}
                            activeClassName={classes.navLinkActive}>
                            <li>
                                Home
                                    </li>
                        </NavLink>
                        <NavLink to="/about" className={classes.navLink}
                            activeClassName={classes.navLinkActive}
                        >
                            <li>About</li>
                        </NavLink>
                    </ul>
                </div>
            </nav>
            <div>
                {auth.isAuthenticated ?
                    <Button variant="contained" color="primary">{auth.user.displayName}</Button>
                    : ""
                    // <Button href="/login" variant="contained" color="primary">{}</Button>
                }
            </div>
        </header>
    }

    const render = () => {
        return <div>{navbarRender()}</div>
    }

    return render();
};


