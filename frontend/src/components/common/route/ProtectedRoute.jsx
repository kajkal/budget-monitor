import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import authService from '../../../services/authService';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (!authService.getCurrentUser()) return <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />;
                return Component ? <Component {...props} /> : render(props);
            }}
        />
    );
};

ProtectedRoute.propTypes = {
    component: PropTypes.func,
    render: PropTypes.func,
    path: PropTypes.string.isRequired
};

export default ProtectedRoute;
