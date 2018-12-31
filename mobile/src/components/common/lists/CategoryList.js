import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { categoryShape } from '../../../config/propTypesCommon';
import { neutralColor } from '../../../config/theme';


class CategoryList extends PureComponent {
    state = {
        expandedCategories: [],
    };

    handleToggleOpen = (category, expanded) => () => {
        const oldExpandedCategories = [...this.state.expandedCategories];
        const expandedCategories = (expanded) ?
            oldExpandedCategories.filter(c => c.idCategory !== category.idCategory) :
            [...oldExpandedCategories, category];
        this.setState({ expandedCategories });
    };

    getExpandIcon = (category, expanded) => {
        const iconName = (expanded) ? 'expand-less' : 'expand-more';
        return (
            <Button
                transparent={true}
                onPress={this.handleToggleOpen(category, expanded)}
                style={styles.listItemSecondaryAction}
            >
                <Icon
                    name={iconName}
                    type='MaterialIcons'
                    style={styles.expandIcon}
                />
            </Button>
        );
    };

    renderCategory = (category, depth) => {
        const { expandedCategories } = this.state;
        const { onSelect } = this.props;
        const expanded = expandedCategories.includes(category);

        const haveChildren = category.subCategories.length > 0;
        const subListStyle = (expanded) ? null : { display: 'none' };

        if (category.idCategory === 0) return null;
        return (
            <React.Fragment key={category.idCategory}>

                <View style={{ ...styles.flexRow, ...styles.listItem, paddingLeft: depth * 20 }}>

                    <Text
                        style={styles.listItemText}
                        onPress={() => onSelect(category)}
                    >
                        {category.name}
                    </Text>

                    {haveChildren && this.getExpandIcon(category, expanded)}

                </View>

                {
                    haveChildren && (
                        <View style={subListStyle}>
                            {category.subCategories.map(c => this.renderCategory(c, depth + 1))}
                        </View>
                    )
                }

            </React.Fragment>
        );
    };

    render() {
        const { rootCategory, onlySubCategories } = this.props;

        return (
            <ScrollView>
                <View style={styles.categoryList}>

                    {
                        onlySubCategories ?
                            rootCategory.subCategories.map(c => this.renderCategory(c, 0))
                            :
                            this.renderCategory(rootCategory, 0)
                    }

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    listItem: {
        height: 50,
    },
    listItemText: {
        flexGrow: 1,
        padding: 12,
    },
    expandIcon: {
        fontSize: 28,
        color: neutralColor,
    },
    listItemSecondaryAction: {
        height: 50,
    },

    categoryList: {
        padding: 12,
    },
});

CategoryList.propTypes = {
    rootCategory: categoryShape.isRequired,
    onlySubCategories: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
};

export default CategoryList;
