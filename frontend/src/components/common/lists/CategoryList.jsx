import React, { Component } from 'react';
import _ from 'lodash';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider/Divider';
import PropTypes from 'prop-types';
import { categoryRootShape } from '../../../config/propTypesCommon';


const dense = false;

class CategoryList extends Component {
    state = {
        categories: {},
    };

    componentDidMount() {
        this.setState({ categories: this.props.categories });
    }

    handleToggleOpen = category => {
        // console.log('handleToggleOpen', category);

        const categories = { ...this.state.categories };
        category.open = !category.open;
        _.set(categories, category.lodashPath, category);
        this.setState({ categories });

        // const categories = getRootCategory();
        //
        // for (let i = category.lodashPath.length; i > 0; i-=2) {
        //     const path = category.lodashPath.slice(0, i);
        //     console.log('modyfikowana sciezka: ', path);
        //     const categoryToOpen = _.get(categories, path);
        //     categoryToOpen.open = !category.open;
        //     _.set(categories, path, categoryToOpen);
        // }
        //
        // this.setState({ categories });
    };

    renderCategory = (category, depth) => {
        const expandIcon = category.open ? <ExpandLess /> : <ExpandMore />;
        const haveChildren = category.subCategories.length > 0;

        return (
            <React.Fragment key={category.idCategory}>

                {!depth && <Divider />}

                <ListItem button style={{paddingLeft: depth*20+16}} onClick={() => this.props.onSelect(category)}>

                    <ListItemText primary={category.name} />

                    {
                        haveChildren && (
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => this.handleToggleOpen(category)}>
                                    {category.subCategories.length > 0 && expandIcon}
                                </IconButton>
                            </ListItemSecondaryAction>
                        )
                    }

                </ListItem>

                {
                    haveChildren && (
                        <Collapse in={category.open} timeout="auto" unmountOnExit>
                            <List
                                dense={dense}
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
        const { header, rootCategory, onlySubCategories } = this.props;
        return (
            <List
                dense={dense}
                subheader={header && <ListSubheader>{header}</ListSubheader>}
                disablePadding={true}
                style={{minWidth: 260}}
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
    rootCategory: categoryRootShape.isRequired,
    onlySubCategories: PropTypes.bool,
    header: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
};

export default CategoryList;
