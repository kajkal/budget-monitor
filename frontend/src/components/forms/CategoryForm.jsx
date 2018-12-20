import React from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import _ from 'lodash';
import DialogTitle from '@material-ui/core/es/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import withMobileDialog from '@material-ui/core/es/withMobileDialog/withMobileDialog';
import Dialog from '@material-ui/core/es/Dialog/Dialog';
import Form from '../common/forms/Form';
import { addCategory, getCategoriesByType, getCategoryParent, updateCategory, } from '../../services/entities-services/categoryService';
import { translateErrorMessage } from '../../services/errorMessageService';
import { alertService } from '../../services/alertService';
import { desktopDialogMaxWidth, mobileDialogBreakpoint } from '../../config/theme';
import { CATEGORY, ID_CATEGORY, NAME } from '../../config/fieldNames';
import { categoryRootShape } from '../../config/propTypesCommon';


class CategoryForm extends Form {
    state = {
        data: {
            [CATEGORY]: {},
            [NAME]: '',
        },
        errors: {},
    };

    schema = {
        [CATEGORY]: Joi.object()
            .label('Parent category'),
        [NAME]: Joi.string()
            .required()
            .label('Name'),
    };

    validationIgnoreList = [CATEGORY];

    isCategoryDisabled = category => {
        const { category: editedCategory } = this.props;

        if (editedCategory) {
            if (category.idCategory === editedCategory.idCategory)
                return true;

            if (category.path.includes(editedCategory.idCategory))
                return true;
        }
    };

    doSubmit = async () => {
        try {
            const { data } = this.state;
            const { category } = this.props;

            if (category) {
                if (_.last(category.path) !== data[CATEGORY][ID_CATEGORY] || category[NAME] !== data[NAME]) {
                    await updateCategory(category, data);
                    alertService.success('Category successfully updated.');
                    this.props.onRootCategoryChange();
                }
                this.props.onClose();

            } else {
                await addCategory(this.state.data);
                alertService.success('Category successfully added.');
                this.props.onClose();
                this.props.onRootCategoryChange();
            }
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                const errors = translateErrorMessage(e.response.data.message);
                this.setState({ errors });
            }
        }
    };

    componentDidMount() {
        const { rootCategory, superCategory, category } = this.props;
        const data = { ...this.state.data };

        if (category) {
            data[CATEGORY] = getCategoryParent(rootCategory, category.lodashPath);
            data[NAME] = category[NAME];
        } else if (superCategory) {
            data[CATEGORY] = superCategory;
        }

        this.setState({ data });
    }

    render() {
        const { type, rootCategory, category, open, onClose, fullScreen } = this.props;
        const formTitle = category ? 'Edit category' : 'Add category';
        const submitButtonTitle = category ? 'Save' : 'Add';

        const categoryDetails = {
            rootCategory: getCategoriesByType(rootCategory, type),
            onlySubCategories: false,
            resetDisabled: true,
            categoryDisabled: this.isCategoryDisabled,
        };

        return (
            <Dialog
                fullScreen={fullScreen}
                maxWidth={desktopDialogMaxWidth}
                fullWidth={true}

                open={open}
                onClose={onClose}
                disableBackdropClick={true}
                aria-labelledby='category-form-dialog'
            >

                <DialogTitle
                    id='category-form-dialog'
                    className='form-header'
                    disableTypography={true}
                >
                    {formTitle}
                </DialogTitle>

                <DialogContent>
                    <form autoComplete='on' onKeyDown={this.onEnterDown}>

                        <div className='form-content category-form'>
                            {this.renderCategoryInput([CATEGORY], 'Parent category', categoryDetails, { className: 'category-input' })}
                            {this.renderTextInput([NAME], 'Name', {}, { className: 'category-name-input' })}
                        </div>

                    </form>
                </DialogContent>

                <DialogActions>
                    {this.renderCancelButton(onClose)}
                    {this.renderSubmitButton(submitButtonTitle)}
                </DialogActions>

            </Dialog>
        );
    }
}

CategoryForm.propTypes = {
    type: PropTypes.oneOf(['expense', 'income']).isRequired,
    rootCategory: categoryRootShape.isRequired,
    superCategory: categoryRootShape,
    category: categoryRootShape,

    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onRootCategoryChange: PropTypes.func.isRequired,

    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog({ breakpoint: mobileDialogBreakpoint })(CategoryForm);
