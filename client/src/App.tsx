import React, { useState, useEffect, useContext, useMemo } from 'react';
import logo from './logo.svg';
import './App.css';
import CopyrightIcon from '@material-ui/icons/Copyright';
import {
  BrowserRouter,
  Switch,
  Redirect,
  Route,
  Link
} from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import About from './components/About';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthContext, IAuthContext, AUTH_DEFAULT_VALUE } from "./state/auth.context";
import { useAuth } from "./hooks/auth.hooks";
import { IMsalAuth } from './models/Auth';
import { finalize, map, catchError } from 'rxjs/operators';
import { AuthService } from './services/AuthService';


interface IAuthSession {
  error?: any;
  isAuthenticated: boolean;
  user?: any;
  accessToken: String;
  expireAt: string;
}

interface IApp {
  path?: string
}

function App(props: IApp) {

  // const { auth, setAuth } = useContext(AuthContext);
  const authService = new AuthService();
  const defaultMsal = {
    isAuthenticated: false,
    user: {},
    login: () => signIn(),
    logout: () => signOut(),
    // accessToken: "",
    expireAt: "",
    error: null
  };
  // const [authState, setAuthState] = useState<IMsalAuth>(defaultMsal);

  const authContext = useAuth(defaultMsal);
  const clearLocalStorage = () => {
    localStorage.clear();

  }

  const signIn = () => {
    console.log("Sign-In Button pressed...");
    window.location.href = "/api/auth/signin"
  }

  const signOut = () => {
    console.log("sign-Out button pressed...");
    authService.signOut().pipe(finalize(() => {
      setAuthToFalse(null);
      clearLocalStorage();
    })).subscribe();
  }



  const setAuthToFalse = (err: any) => {
    authContext.setAuth(defaultMsal)
  }

  const getInitialStorageState = () => {
    var selectedOption = localStorage.getItem('SessionAuthentication') || JSON.stringify(defaultMsal);
    return JSON.parse(selectedOption);
  }

  const setLocalStorage = (sessionInfo: IMsalAuth) => {
    console.log("User authenticated and the token has expired. Setting local storage...");
    localStorage.setItem('SessionAuthentication', JSON.stringify(sessionInfo))
  }

  /**
   * Checks if the date time passed is beyond current time or not.
   * If the value passed is after the current time then it will return true, else false.
   * @param date date time as string
   */
  const isExpired = (expireDate: string) => {
    if (expireDate !== "") {
      const _expireDate = new Date(expireDate);
      const currentDate = new Date();
      // console.log(localExpireDate < currentDate);
      // console.log(_expireDate.toISOString(), currentDate.toISOString());

      if (currentDate > _expireDate) {
        return true;
      }
    }
    console.log("Token still valid...");
    return false;
  }


  useEffect(() => {
    let storageState: IAuthSession = getInitialStorageState();
    // console.log("Storage State: ", storageState);
    if (storageState.isAuthenticated && !isExpired(storageState.expireAt)) {
      if (!authContext.auth.isAuthenticated) {

        const sessionInfo: IMsalAuth = {
          isAuthenticated: storageState.isAuthenticated,
          user: storageState.user,
          expireAt: storageState.expireAt,
          // accessToken: storageState.accessToken,
          error: null,
          login: () => signIn(),
          logout: () => signOut()
        }
        authContext.setAuth(sessionInfo);
        setLocalStorage(sessionInfo);

      }
    } else {
      getServerSession();
    }

  }, [])

  // useEffect(() => {
  //   debugger;
  //   if (authContext.auth.isAuthenticated) {
  //   }

  // }, [authContext.auth]);

  const getServerSession = () => {
    authService.getSession()
      .pipe(
        map((result: any) => {
          // console.log("result from signin: ", result);
          if (result.authenticated) {
            authContext.setAuth({
              isAuthenticated: result.authenticated,
              user: {
                displayName: result.user.profile.displayName,
                email: result.user.profile.email
              },
              login: () => signIn(),
              logout: () => signOut(),
              // accessToken: result.user.oauthToken.access_token,
              expireAt: result.user.oauthToken.expires_at,
              error: null
            })
          }
          else {
            setAuthToFalse(null);
          }
        }),
        catchError((err: Error) => {
          console.error("Unable to login due to error: ", err);
          setAuthToFalse(err);
          throw err;
        }),
        finalize(() => {
          console.log("function complete.");
        })
      ).subscribe();
  }

  return (
    <div className="App">
      <AuthContext.Provider value={authContext}>
        <BrowserRouter>
          <Navbar />
          <Switch>
            <ProtectedRoute path={["", "/home"]} component={Home} exact={true} />
            <ProtectedRoute path="/about" component={About} exact={true} />
            <Route exact path={["/", "/login"]}>
              {authContext.auth.isAuthenticated ? <Redirect to={props.path || "/home"} /> : <Login />}
            </Route>
          </Switch>
        </BrowserRouter>
      </AuthContext.Provider>
      <footer className="App-footer"><div className="App-row"><CopyrightIcon />  <p>Queen's printer for Ontario, 2020</p></div></footer>
    </div>
  );
}

export default App;
