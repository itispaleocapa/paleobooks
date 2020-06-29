import React from "react";
import {Route, Redirect} from "react-router-dom";

const PrivateRoute = ({
                          component: Component,
                          auth,
                          wasInitialized,
                          ...rest
                      }) => {
    return (
        <Route
            {...rest}
            render={props =>
                auth === true ? (
                    <Component {...props} />
                ) : !wasInitialized ? (
                    ""
                ) : (
                    <Redirect to="/login"/>
                )
            }
        />
    );
};

export default PrivateRoute;