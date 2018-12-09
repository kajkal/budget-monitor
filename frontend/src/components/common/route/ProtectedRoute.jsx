import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import authService from '../../../services/authService';

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (!authService.getCurrentUser()) return <Redirect to={{
                    pathname: '/login',
                    state: {from: props.location}
                }} />;
                return Component ? <Component {...props} /> : render(props);
            }}
        />
    );
};

export default ProtectedRoute;
