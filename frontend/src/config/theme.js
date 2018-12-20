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

export const tooltipEnterDelay = 500;
export const tooltipLeaveDelay = 200;


// xs: 600
// sm: 960
// md: 1280
// lg: 1920
export const mobileDialogBreakpoint = 'xs';
export const dialogPaperProps = { style: { minWidth: '600px', minHeight: '400px' } };