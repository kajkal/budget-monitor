import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/es/styles/withStyles';
import Typography from '@material-ui/core/es/Typography/Typography';


const styles = {
    containerWrapper: {
        flexGrow: 1,
        minWidth: '300px',
        position: 'relative',
    },
    chartWrapper: {
        height: 'calc(100% - 4px)',
        width: '100%',
        position: 'absolute',
    },
    withTitle: {
        height: 'calc(100% - 36px)',
    },
    withTitleAndCaption: {
        height: 'calc(100% - 55px)',
    },
    chartDescription: {
        paddingLeft: '12px',
    },
};


const ChartWrapper = ({ title, caption, fullWidth = false, children, classes }) => {
    const chartWrapperClassName = [
        {element: true, className: classes.chartWrapper},
        {element: title, className: classes.withTitle},
        {element: caption, className: classes.withTitleAndCaption},
    ].filter(e => e.element).map(e => e.className).join(' ');
    const wrapperOptions = fullWidth ? { width: '100%' } : null;

    return (
        <div className={classes.containerWrapper} style={wrapperOptions}>
            {
                title && (
                    <Typography variant='h6' className={classes.chartDescription}>
                        {title}
                    </Typography>
                )
            }
            {
                caption && (
                    <Typography variant='caption' className={classes.chartDescription}>
                        {caption}
                    </Typography>
                )
            }
            <div className={chartWrapperClassName}>
                {children}
            </div>
        </div>
    );
};

ChartWrapper.propTypes = {
    title: PropTypes.string,
    caption: PropTypes.string,
    fullWidth: PropTypes.bool,
    children: PropTypes.element.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChartWrapper);
