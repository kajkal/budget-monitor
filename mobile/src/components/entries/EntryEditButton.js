import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { categoryShape, entryShape } from '../../config/propTypesCommon';
import { Button, Text } from "native-base";


class EntryEditButton extends PureComponent {

    handleEditEntry = () => {
        const { navigation, entry, rootCategory, currency } = this.props;
        navigation.navigate('EntryForm', {
            type: type,
            currency: currency,
            rootCategory: JSON.stringify(rootCategory),
            entry: JSON.stringify(entry),
        });
    };

    render() {
        return (
            <Button
                transparent={true}
                onPress={this.handleEditEntry}
            >
                <Text>Edit</Text>
            </Button>
        );
    }
}

EntryEditButton.propTypes = {
    entry: entryShape.isRequired,
    rootCategory: categoryShape.isRequired,
    currency: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default EntryEditButton;
