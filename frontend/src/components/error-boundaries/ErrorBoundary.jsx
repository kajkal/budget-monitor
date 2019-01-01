import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import logger from './../../services/logService';


class ErrorBoundary extends PureComponent {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        logger.log(error);
    }

    render() {
        if (this.state.hasError) {
            return <h1 style={{ margin: 'auto', marginTop: '64px' }}>Your browser does not support this chart. Try on Chrome.</h1>;
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.element.isRequired,
};

export default ErrorBoundary;
