import React, { useContext } from "react";
import { AuthContext } from "../state/auth.context";
import { Button } from "@material-ui/core";

export default function Home() {
    const { auth } = useContext(AuthContext)

    const testCall = () => {
        console.log(auth);
    }

    const render = () => {
        return (<div>
            Homepage
            <Button onClick={testCall}>Test</Button>
        </div>)
    }

    return render();
};
