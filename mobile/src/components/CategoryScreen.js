import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'native-base';
import CategoryList from './common/lists/CategoryList';
import LoadingScreen, { someAreFalsy } from './loading/LoadingScreen';


class CategoryScreen extends PureComponent {
    static navigationOptions = {
        title: 'Select category',
    };

    state = {
        path: null,
        rootCategory: null,
    };
    handleSelect = category => {
        const { navigation } = this.props;
        const { path } = this.state;
        navigation.navigate('EntryForm', {
            path: JSON.stringify(path),
            idCategory: category.idCategory,
        });
    };

    componentDidMount() {
        const { navigation } = this.props;
        const { path, rootCategory } = navigation.state.params;

        const pathObj = path ? JSON.parse(path) : null;
        const rootCategoryObject = rootCategory ? JSON.parse(rootCategory) : null;

        this.setState({ path: pathObj, rootCategory: rootCategoryObject });
    }

    render() {
        const { rootCategory } = this.state;

        if (someAreFalsy(rootCategory)) return <LoadingScreen />;
        return (
            <Container>
                <CategoryList
                    rootCategory={rootCategory}
                    onSelect={this.handleSelect}
                    onlySubCategories={true}
                />
            </Container>
        );
    }
}

CategoryScreen.propTypes = {
    navigation: PropTypes.shape({
        state: PropTypes.shape({
            params: PropTypes.shape({
                rootCategory: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default CategoryScreen;
