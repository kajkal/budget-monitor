import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import ListItemSecondaryAction from '@material-ui/core/es/ListItemSecondaryAction/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/es/ListItemText/ListItemText';
import IconButton from '@material-ui/core/es/IconButton/IconButton';
import ListItem from '@material-ui/core/es/ListItem/ListItem';
import Collapse from '@material-ui/core/es/Collapse/Collapse';
import List from '@material-ui/core/es/List/List';
import { getCategoryName } from '../../../services/entities-services/categoryService';
import CategoryCheckbox from '../forms/inputs/CategoryCheckbox';
import { categoryShape } from '../../../config/propTypesCommon';


class CategoryCheckboxList extends PureComponent {

    handleToggleOpen = (category, isExpanded) => {
        const { expandedCategories: currentExpandedCategories } = this.props;
        const expandedCategories = isExpanded ?
            currentExpandedCategories.filter(c => c.idCategory !== category.idCategory) :
            [...currentExpandedCategories, category];
        this.props.onCategoryExpandToggle(expandedCategories);
    };

    handleCheckboxChange = newSelectedCategories => {
        this.props.onSelectedCategoriesChange(newSelectedCategories);
    };

    renderCategory = (category, depth) => {
        const { expandedCategories, selectedCategories } = this.props;

        const isExpanded = expandedCategories.includes(category);
        const expandIcon = isExpanded ? <ExpandLess /> : <ExpandMore />;
        const haveChildren = category.subCategories.length > 0;
        const categoryDisabled = this.props.categoryDisabled && this.props.categoryDisabled(category);

        return (
            <React.Fragment key={category.idCategory}>

                <ListItem button disabled={categoryDisabled} style={{ paddingLeft: depth * 20 + 16 }}
                    onClick={() => this.handleToggleOpen(category, isExpanded)}>

                    <ListItemText primary={getCategoryName(category)} />

                    {
                        <ListItemSecondaryAction>

                            {haveChildren && (
                                <IconButton onClick={() => this.handleToggleOpen(category, isExpanded)}>
                                    {expandIcon}
                                </IconButton>
                            )}

                            <CategoryCheckbox
                                category={category}
                                selectedCategories={selectedCategories}
                                onCheckboxChange={this.handleCheckboxChange}
                            />

                        </ListItemSecondaryAction>
                    }

                </ListItem>

                {
                    haveChildren && (
                        <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                            <List
                                dense={this.props.dense}
                                disablePadding={true}
                            >
                                {category.subCategories.map(c => this.renderCategory(c, depth + 1))}
                            </List>
                        </Collapse>
                    )
                }
            </React.Fragment>
        );
    };

    render() {
        const { rootCategory, className, dense } = this.props;

        return (
            <List
                dense={dense}
                className={className}
            >

                {rootCategory.subCategories.map(c => this.renderCategory(c, 0))}

            </List>
        );
    }
}

CategoryCheckboxList.propTypes = {
    expandedCategories: PropTypes.arrayOf(categoryShape).isRequired,
    selectedCategories: PropTypes.arrayOf(categoryShape).isRequired,
    onCategoryExpandToggle: PropTypes.func.isRequired,
    onSelectedCategoriesChange: PropTypes.func.isRequired,

    rootCategory: categoryShape.isRequired,
    className: PropTypes.string,
    dense: PropTypes.bool,
};

export default CategoryCheckboxList;
