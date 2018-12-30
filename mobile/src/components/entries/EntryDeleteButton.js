import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { Button, Text } from 'native-base';
import { deleteEntry } from '../../services/entities-services/entryService';
import alertService from '../../services/alertService';
import { translateErrorMessage } from '../../services/errorMessageService';
import { entryShape } from '../../config/propTypesCommon';


class EntryDeleteButton extends PureComponent {

    deleteEntryAction = async () => {
        const { entry, onEntriesChange } = this.props;
        try {
            await deleteEntry(entry);
            alertService.success('Entry successfully deleted.');
            onEntriesChange();
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                translateErrorMessage(e.response.data.message);
            }
        }
    };

    render() {
        return (
            <Button
                transparent={true}
                onPress={() => Alert.alert(
                    'Are you sure you want to delete this entry?',
                    'Confirm and delete',
                    [
                        {text: 'Cancel', onPress: null, style: 'cancel'},
                        {text: 'OK', onPress: this.deleteEntryAction},
                    ],
                    { cancelable: false }
                )}
            >
                <Text>Delete</Text>
            </Button>
        );
    }
}

EntryDeleteButton.propTypes = {
    entry: entryShape.isRequired,
    onEntriesChange: PropTypes.func.isRequired,
};

export default EntryDeleteButton;
