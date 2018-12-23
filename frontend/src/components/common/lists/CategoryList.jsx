import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import { categoryShape } from '../../../config/propTypesCommon';
import { getCategoryName } from '../../../services/entities-services/categoryService';


class CategoryList extends PureComponent {
    
    componentDidMount() {
        const { rootCategory, onlySubCategories } = this.props;
        if (!onlySubCategories) {
            rootCategory.open = true;
            this.forceUpdate();
        }
    }

    handleToggleOpen = category => {
        category.open = !category.open;
        this.forceUpdate();
    };

    renderCategory = (category, depth) => {
        const expandIcon = category.open ? <ExpandLess /> : <ExpandMore />;
        const haveChildren = category.subCategories.length > 0;
        const categoryDisabled = this.props.categoryDisabled && this.props.categoryDisabled(category);

        if (category.idCategory === 0) return null;
        return (
            <React.Fragment key={category.idCategory}>

                <ListItem button disabled={categoryDisabled} style={{paddingLeft: depth*20+16}} onClick={event => this.props.onSelect(category, event)}>

                    <ListItemText primary={getCategoryName(category)} />

                    {
                        haveChildren && (
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => this.handleToggleOpen(category)}>
                                    {expandIcon}
                                </IconButton>
                            </ListItemSecondaryAction>
                        )
                    }

                </ListItem>

                {
                    haveChildren && (
                        <Collapse in={category.open} timeout='auto' unmountOnExit>
                            <List
                                dense={this.props.dense}
                                disablePadding={true}
                            >
                                {category.subCategories.map(c => this.renderCategory(c, depth+1))}
                            </List>
                        </Collapse>
                    )
                }
            </React.Fragment>
        )
    };

    render() {
        const { header, rootCategory, onlySubCategories, dense } = this.props;
        const subHeader = header && <ListSubheader>{header}</ListSubheader>;

        return (
            <List
                dense={dense}
                subheader={subHeader}
            >

                {
                    onlySubCategories ?
                        rootCategory.subCategories.map(c => this.renderCategory(c, 0))
                        :
                        this.renderCategory(rootCategory, 0)
                }

            </List>
        );
    }
}

CategoryList.propTypes = {
    rootCategory: categoryShape.isRequired,
    onlySubCategories: PropTypes.bool,
    header: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    dense: PropTypes.bool,
    categoryDisabled: PropTypes.func,
};

export default CategoryList;
