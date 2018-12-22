import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { entryShape } from '../../config/propTypesCommon';
import { alertService } from '../../services/alertService';
import { translateErrorMessage } from '../../services/errorMessageService';
import { deleteEntry } from '../../services/entities-services/entryService';
import ConfirmationDialog from '../common/dialogs/ConfirmationDialog';


class EntryDeleteForm extends PureComponent {
    state = {
        header: 'Delete entry',
        content: 'Are you sure you want to delete this entry?',
    };

    componentDidMount() {
        const { entry } = this.props;
        if (entry) {
            const content = `Are you sure you want to delete '${entry}' entry?`;
            this.setState({ content });
        }
    }

    handleOk = async () => {
        try {
            const { entry } = this.props;
            await deleteEntry(entry);
            alertService.success('Entry successfully deleted.');
            this.props.onClose();
            this.props.onEntriesChange(entry, 'delete');
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                const errors = translateErrorMessage(e.response.data.message);
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

EntryDeleteForm.propTypes = {
    entry: entryShape.isRequired,

    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onEntriesChange: PropTypes.func.isRequired,
};

export default EntryDeleteForm;
