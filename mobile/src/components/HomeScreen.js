import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Content, Container } from 'native-base';
import { getCategories, getRootCategory } from '../services/entities-services/categoryService';
import { translateErrorMessage } from '../services/errorMessageService';
import { getRecentEntries, sort } from '../services/entities-services/entryService';
import { someAreFalsy } from './loading/LoadingScreen';
import LoadingScreen from './loading/LoadingScreen';
import EntryCard from './entries/EntryCard';
import UserOptionsMenu from './navigation/UserOptionsMenu';
import NewEntryOptions from './navigation/NewEntryOptions';


class HomeScreen extends PureComponent {
    static navigationOptions = {
        title: 'Recent entries',
    };

    state = {
        user: null,
        rootCategory: null,
        recentEntries: null,
    };

    constructor(props) {
        super(props);
        console.log('HomeScreen constructor');
    }


    fetchCategories = async () => {
        try {
            const { data: rawRootCategory } = await getCategories();
            const rootCategory = getRootCategory(rawRootCategory);
            this.setState({ rootCategory });
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                console.log('error while fetching categories: ', e);
                const errors = translateErrorMessage(e.response.data.message);
                console.log('error while fetching root category: ', errors);
            }
        }
    };

    fetchRecentEntries = async () => {
        try {
            const { data: rawRecentEntries } = await getRecentEntries();
            const recentEntries = sort(rawRecentEntries, 'dateOfLastModification', 'desc');
            this.setState({ recentEntries });
        } catch (e) {
            if (e.response && [400, 401, 403].includes(e.response.status)) {
                console.log('error while fetching recent entries: ', e);
                const errors = translateErrorMessage(e.response.data.message);
                console.log('error while fetching recent entries: ', errors);
            }
        }
    };

    componentDidMount() {
        const { navigation } = this.props;
        const userInString = navigation.getParam('user', null);
        if (!userInString) {
            console.log('UNEXPECTED ERROR, USER IS MISSING');
            navigation.replace('Login');
        }

        console.log('HomeScreen cdm user', userInString);
        const user = JSON.parse(userInString);
        this.setState({ user });
        this.fetchCategories();
        this.fetchRecentEntries();

        navigation.addListener('didFocus', this.handleScreenFocus);
    }

    handleScreenFocus = ({ state }) => {
        const { params: { fetchRecentEntries } } = state;

        if (fetchRecentEntries) {
            const { navigation } = this.props;
            navigation.setParams({ fetchRecentEntries : null });
            this.fetchRecentEntries();
        }
    };

    render() {
        const { user, rootCategory, recentEntries } = this.state;
        const { navigation } = this.props;

        if (someAreFalsy(user, rootCategory, recentEntries)) return <LoadingScreen />;
        return (
            <Container>
                <Content>
                        {
                            recentEntries.map(entry => (
                                <EntryCard
                                    key={entry.idEntry}
                                    entry={entry}
                                    rootCategory={rootCategory}
                                    currency={user.currency}
                                    onEntriesChange={this.fetchRecentEntries}
                                    navigation={navigation}
                                />
                            ))
                        }
                        <View style={{ height: 80 }}/>
                </Content>

                <UserOptionsMenu
                    positionNumber={1}
                    navigation={navigation}
                />

                <NewEntryOptions
                    positionNumber={0}
                    currency={user.currency}
                    rootCategory={rootCategory}
                    navigation={navigation}
                />

            </Container>
        );
    }
}

HomeScreen.propTypes = {
    navigation: PropTypes.shape({
        state: PropTypes.shape({
            params: PropTypes.shape({
                user: PropTypes.string,
                fetchRecentEntries: PropTypes.bool,
            }).isRequired
        }).isRequired,
        navigate: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
    }).isRequired,
};

export default HomeScreen;
