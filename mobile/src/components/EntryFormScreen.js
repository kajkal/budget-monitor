import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Button, Content, Footer, FooterTab, Form, Text, Spinner, Icon, Container } from 'native-base';
import { categoryShape, entryShape } from '../config/propTypesCommon';


class EntryFormScreen extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        return ({
            title: 'Entry form'
        });
    };


    render() {
        return (
            <Container>
                <Text>
                    Hello entry form
                </Text>
            </Container>
        );
    }
}

EntryFormScreen.propTypes = {
    navigation: PropTypes.shape({
        state: PropTypes.shape({
            params: PropTypes.shape({
                type: PropTypes.oneOf(['expense', 'income']).isRequired,
                currency: PropTypes.string.isRequired,
                rootCategory: PropTypes.string.isRequired,
                entry: PropTypes.string,
            }).isRequired
        }).isRequired,
        push: PropTypes.func.isRequired,
    }).isRequired,
};

export default EntryFormScreen;
