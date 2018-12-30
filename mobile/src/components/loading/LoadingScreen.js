import React from 'react';
import { Spinner } from 'native-base';


export function someAreFalsy(...rest) {
    return rest.some(e => !e);
}

export function allAreTruthy(...rest) {
    return rest.every(e => e);
}

const LoadingScreen = () => {
    return <Spinner />;
};

export default LoadingScreen;
