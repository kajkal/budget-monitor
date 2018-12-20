import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider/Divider';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import { categoryRootShape } from '../../../config/propTypesCommon';
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

        return (
            <React.Fragment key={category.idCategory}>

                {!depth && <Divider />}

                <ListItem button style={{paddingLeft: depth*20+16}} onClick={event => this.props.onSelect(category, event)}>

                    <ListItemText primary={getCategoryName(category)} />

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
        const subheader = header && <ListSubheader>{header}</ListSubheader>;

        return (
            <List
                dense={dense}
                subheader={subheader}
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
    dense: PropTypes.bool,
};

export default CategoryList;
