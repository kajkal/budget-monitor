import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ConfirmationDialog from '../common/dialogs/ConfirmationDialog';
import { alertService } from '../../services/alertService';
import { translateErrorMessage } from '../../services/errorMessageService';
import { deleteCategory } from '../../services/entities-services/categoryService';
import { categoryRootShape } from '../../config/propTypesCommon';


class DeleteCategoryDialog extends PureComponent {
    state = {
        header: 'Delete category',
        content: 'Are you sure you want to delete this category?',
    };

    componentDidMount() {
        const { category } = this.props;
        if (category) {
            const content = `Are you sure you want to delete '${category.name}' category?`;
            this.setState({ content });
        }
    }

    handleOk = async () => {
        try {
            const { category } = this.props;
            const response = await deleteCategory(category);

            console.log('response from server: ', response);
            alertService.success('Category successfully deleted.');
            this.props.onClose();
            this.props.onRootCategoryChange();
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                console.log('messageKey: ', e.response.data.message);
                const errors = translateErrorMessage(e.response.data.message);
                console.log('translated errors: ', errors);
                this.setState({ errors });
            }
        }
    };

    render() {
        const { header, content } = this.state;
        const { open, onClose } = this.props;

        return (
            <ConfirmationDialog
                header={header}
                content={content}
                onOk={this.handleOk}

                open={open}
                onClose={onClose}
            >
            </ConfirmationDialog>
        );
    }
}

DeleteCategoryDialog.propTypes = {
    category: categoryRootShape.isRequired,

    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onRootCategoryChange: PropTypes.func.isRequired,
};

export default DeleteCategoryDialog;
