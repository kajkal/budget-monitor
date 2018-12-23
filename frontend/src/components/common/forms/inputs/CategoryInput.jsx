import React, { PureComponent } from 'react';
import TextField from '@material-ui/core/TextField/TextField';
import Dialog from '@material-ui/core/Dialog/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog/withMobileDialog';
import PropTypes from 'prop-types';
import CategoryList from '../../lists/CategoryList';
import DialogTitle from '@material-ui/core/es/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import Button from '@material-ui/core/es/Button/Button';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import { categoryShape } from '../../../../config/propTypesCommon';
import { getCategoryName } from '../../../../services/entities-services/categoryService';
import { desktopDialogMaxWidth, mobileDialogBreakpoint } from '../../../../config/theme';


class CategoryInput extends PureComponent {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleReset = () => {
        this.setState({ open: false });
        this.props.onChange({});
    };

    handleSelectCategory = category => {
        this.setState({ open: false });
        this.props.onChange(category);
    };

    render() {
        const { name, label, value, margin, autoFocus, className, error } = this.props;
        const { rootCategory, onlySubCategories, header, categoryDisabled, resetDisabled, fullScreen } = this.props;

        const isResetDisabled = resetDisabled || !value.name;

        return (
            <React.Fragment>
            <TextField
                autoComplete={name}

                name={name}
                label={label}

                error={error !== undefined}
                helperText={error}

                margin={margin}
                autoFocus={autoFocus}

                className={className}

                value={getCategoryName(value) || ''}
                InputProps={{
                    readOnly: true,
                }}

                onClick={this.handleOpen}
                onKeyPress={this.handleOpen}
            />

                <Dialog
                    fullScreen={fullScreen}
                    scroll={'body'}
                    maxWidth={desktopDialogMaxWidth}
                    fullWidth={true}

                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby='category-input-dialog'
                >

                    <DialogTitle id='category-input-dialog'>
                        Select category
                    </DialogTitle>

                    <DialogContent>
                        <CategoryList
                            rootCategory={rootCategory}
                            onlySubCategories={onlySubCategories}
                            header={header}
                            categoryDisabled={categoryDisabled}
                            onSelect={this.handleSelectCategory}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button disabled={isResetDisabled} onClick={this.handleReset} color='primary'>
                            Reset
                        </Button>
                        <Button onClick={this.handleClose} color='primary' autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>

                </Dialog>

            </React.Fragment>
        );
    }
}

CategoryInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([categoryShape, PropTypes.shape({})]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,

    autoFocus: PropTypes.bool.isRequired,
    margin: PropTypes.string.isRequired,
    className: PropTypes.string,

    rootCategory: categoryShape.isRequired,
    onlySubCategories: PropTypes.bool.isRequired,
    header: PropTypes.string,
    categoryDisabled: PropTypes.func,
    resetDisabled: PropTypes.bool,

    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog({ breakpoint: mobileDialogBreakpoint })(CategoryInput);
