import React from 'react';
import { Toast } from 'native-base';


const displayAlert = (message, variant, duration) => {
    Toast.show({
        text: message,
        type: variant,
        duration: duration,
    });
};

export default {
    success: message => displayAlert(message, 'success', 2000),
    warning: message => displayAlert(message, 'warning', 3000),
    error: message => displayAlert(message, 'danger', 4000),
};
