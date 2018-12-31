import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'native-base';
import { someAreFalsy } from './loading/LoadingScreen';
import LoadingScreen from './loading/LoadingScreen';
import EntryForm from './forms/EntryForm';


class EntryFormScreen extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        const { entry } = navigation.state.params;
        const title = entry ? 'Edit entry' : 'Add entry';
        return ({
            title: title
        });
    };

    state = {
        type: null,
        currency: null,
        rootCategory: null,
        entry: null,
        selectedCategoryData: null,
    };

    componentDidMount() {
        console.log('EntryFormScreen, cdm');

        const { navigation } = this.props;
        const { type, currency, rootCategory, entry } = navigation.state.params;

        const rootCategoryObject = rootCategory ? JSON.parse(rootCategory) : null;
        const entryObject = entry ? JSON.parse(entry) : null;

        this.setState({
            type: type,
            currency : currency,
            rootCategory: rootCategoryObject,
            entry: entryObject
        });

        navigation.addListener('didFocus', this.handleScreenFocus);
    }

    handleScreenFocus = ({ state }) => {
        const { params: { path, idCategory } } = state;

        const newPath = (path && JSON.parse(path)) || null;
        const newIdCategory = idCategory || null;

        const { selectedCategoryData } = this.state;
        const currentPath = (selectedCategoryData && selectedCategoryData.path) || null;
        const currentIdCategory = (selectedCategoryData && selectedCategoryData.idCategory) || null;

        if (newPath !== currentPath || newIdCategory !== currentIdCategory) {
            this.setState({
                selectedCategoryData: {
                        path: newPath,
                        idCategory: newIdCategory,
                }
            });
        }
    };

    handleFinishProcessingSelectedCategoryData = () => {
        this.setState({ selectedCategoryData: null });
    };


    render() {
        const { type, currency, rootCategory, selectedCategoryData, entry } = this.state;
        const { navigation } = this.props;

        console.log('ENTRY', Boolean(entry));
        console.log('CATEGORY', Boolean(selectedCategoryData));

        if (someAreFalsy(type, currency, rootCategory)) return <LoadingScreen />;
        return (
            <Container>

                <EntryForm
                    type={type}
                    currency={currency}
                    rootCategory={rootCategory}
                    selectedCategoryData={selectedCategoryData}
                    onFinishProcessingSelectedCategoryData={this.handleFinishProcessingSelectedCategoryData}
                    entry={entry}
                    onSubmit={() => console.log('form submited')}
                    navigation={navigation}
                />

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
