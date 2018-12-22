import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            main: '#388E3C',
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

export const tooltipEnterDelay = 500;
export const tooltipLeaveDelay = 200;


// [xs, sm, md, lg] 600, 960, 1280, 1920
export const mobileDialogBreakpoint = 'xs'; // 600px
export const desktopDialogMaxWidth = 'sm'; // 600px