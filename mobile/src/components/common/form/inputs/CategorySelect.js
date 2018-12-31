import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Item, Label } from 'native-base';
import { categoryShape,lodashPathShape } from '../../../../config/propTypesCommon';


class CategorySelect extends PureComponent {

    handleFocus = () => {
        const { path, rootCategory, navigation } = this.props;
        navigation.navigate('CategoryScreen', {
            path: JSON.stringify(path),
            rootCategory: JSON.stringify(rootCategory)
        });
    };

    render() {
        const { label, category } = this.props;

        return (
            <React.Fragment>
                <Item
                    floatingLabel
                >

                    <Label>{label}</Label>

                    <Input
                        value={category ? category.name : ''}
                        onFocus={this.handleFocus}
                    />

                </Item>
            </React.Fragment>
        );
    }
}

CategorySelect.propTypes = {
    path: lodashPathShape.isRequired,
    label: PropTypes.string.isRequired,
    category: categoryShape,
    rootCategory: categoryShape.isRequired,
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default CategorySelect;
