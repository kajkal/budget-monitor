// import React, { Component } from 'react';
// import Select from 'react-select';
// import { withStyles } from '@material-ui/core';
// import { emphasize } from '@material-ui/core/styles/colorManipulator';
// import Typography from '@material-ui/core/Typography/Typography';
// import TextField from '@material-ui/core/TextField/TextField';
// import MenuItem from '@material-ui/core/MenuItem/MenuItem';
// import Paper from '@material-ui/core/Paper/Paper';
// import { getCurrencies } from '../../services/entities-services/currencyService';
// import { formInputFullWidth, formInputMargin } from '../../config/theme';
//
//
// const styles = theme => ({
//     root: {
//         flexGrow: 1,
//         height: 250,
//     },
//     input: {
//         display: 'flex',
//         padding: 0,
//         marginTop: 16,
//     },
//     valueContainer: {
//         display: 'flex',
//         flexWrap: 'wrap',
//         flex: 1,
//         alignItems: 'center',
//         overflow: 'hidden',
//     },
//     chip: {
//         margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
//     },
//     chipFocused: {
//         backgroundColor: emphasize(
//             theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
//             0.08,
//         ),
//     },
//     noOptionsMessage: {
//         padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
//     },
//     singleValue: {
//         fontSize: 16,
//     },
//     placeholder: {
//         position: 'absolute',
//         left: 2,
//         fontSize: 16,
//         fontWeight: 300
//     },
//     paper: {
//         position: 'absolute',
//         zIndex: 1,
//         marginTop: theme.spacing.unit,
//         left: 0,
//         right: 0,
//     },
//     divider: {
//         height: theme.spacing.unit * 2,
//     },
// });
//
// function NoOptionsMessage(props) {
//     return (
//         <Typography
//             color="textSecondary"
//             className={props.selectProps.classes.noOptionsMessage}
//             {...props.innerProps}
//         >
//             {props.children}
//         </Typography>
//     );
// }
//
// function inputComponent({ inputRef, ...props }) {
//     return <div ref={inputRef} {...props} />;
// }
//
// function Control(props) {
//     return (
//         <TextField
//             fullWidth
//             InputProps={{
//                 inputComponent,
//                 inputProps: {
//                     className: props.selectProps.classes.input,
//                     inputRef: props.innerRef,
//                     children: props.children,
//                     ...props.innerProps,
//                 },
//             }}
//             {...props.selectProps.textFieldProps}
//         />
//     );
// }
//
// function Option(props) {
//     return (
//         <MenuItem
//             buttonRef={props.innerRef}
//             selected={props.isFocused}
//             component="div"
//             style={{
//                 fontWeight: props.isSelected ? 500 : 400,
//             }}
//             {...props.innerProps}
//         >
//             {props.children}
//         </MenuItem>
//     );
// }
//
// function Placeholder(props) {
//     return (
//         <Typography
//             color="textSecondary"
//             className={props.selectProps.classes.placeholder}
//             {...props.innerProps}
//         >
//             {props.children}
//         </Typography>
//     );
// }
//
// function SingleValue(props) {
//     return (
//         <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
//             {props.children}
//         </Typography>
//     );
// }
//
// function ValueContainer(props) {
//     return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
// }
//
// function Menu(props) {
//     return (
//         <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
//             {props.children}
//         </Paper>
//     );
// }
//
// const components = {
//     Control,
//     Menu,
//     NoOptionsMessage,
//     Option,
//     Placeholder,
//     SingleValue,
//     ValueContainer,
// };
//
// class Test extends Component {
//     state = {
//         selectedOption: null,
//     };
//
//     handleChange = (selectedOption) => {
//         this.setState({ selectedOption });
//         console.log(`Option selected:`, selectedOption);
//     };
//
//     render() {
//         const { classes, theme } = this.props;
//         const { selectedOption } = this.state;
//
//         const selectStyles = {
//             input: base => ({
//                 ...base,
//                 color: theme.palette.text.primary,
//                 '& input': {
//                     font: 'inherit',
//                 },
//             }),
//         };
//
//         const {margin} = this.props;
//         let style = {marginTop: 16, marginBottom: 8};
//         if (margin === 'dense')
//             style = {marginTop: 8, marginBottom: 4};
//
//         return (
//             <Select
//                 classes={classes}
//                 styles={selectStyles}
//
//                 components={components}
//                 placeholder="Select you basic currency"
//
//                 fullWidth={formInputFullWidth}
//                 margin={formInputMargin}
//
//                 value={selectedOption}
//                 onChange={this.handleChange}
//                 options={getCurrencies()}
//             />
//         );
//     }
// }
//
// export default withStyles(styles, { withTheme: true })(Test);