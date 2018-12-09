import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            main: '#4e84e7',
        },
        secondary: {
            main: '#86d7de',
        },
        error: {
            main: '#ff1e23',
        },
    },
});

export const formInputMargin = 'normal';
export const formInputFullWidth = false;
