import { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

const AppRouter = () => {
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    return (
        <Router>
            <Switch>
                <Route />
            </Switch>
        </Router>
    )
}

export default AppRouter