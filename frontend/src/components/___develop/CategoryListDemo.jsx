import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import fetchedData from '../___data/fetchedCategories.json';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import Radio from '@material-ui/core/Radio/Radio';
import RadioGroup from '@material-ui/core/RadioGroup/RadioGroup';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class CategoryListDemo extends React.Component {
    state = {
        categories: fetchedData,
    };

    getPath = (category) => {
        const categories = this.state.categories;
        let path = [category];
        let currentCategory = category;

        while (currentCategory.idSuperCategory !== 0) {
            currentCategory = categories.find(c => c.idCategory === currentCategory.idSuperCategory);
            path.push(currentCategory);
        }
        return path;
    };

    handleClick = (category) => {
        const path = this.getPath(category);
        const categories = this.state.categories
            .map(c => {
                if (!path.includes(c)) {
                    delete c.open;
                    return c;
                } else {
                    return c;
                }
            })
        ;
        category.open = !category.open;
        this.setState({ categories: categories });
    };

    renderSubCategories = (category, indentTier) => {
        const subCategories = this.state.categories.filter(c => c.idSuperCategory === category.idCategory);
        console.log('length: ', subCategories.length);
        if (subCategories.length) {
            return (
                <React.Fragment key={category.idCategory} >

                    <ListItem button onDoubleClick={() => console.log('boudle click')} onClick={() => this.handleClick(category)}  key={category.idCategory} style={this.getIndent(indentTier + 1)}>

                        {category.open ? <ExpandLess /> : <ExpandMore />}

                        <ListItemText inset primary={category.name} />

                        <ListItemSecondaryAction>
                            <Checkbox
                                onChange={() => this.handleToggle(category)}
                                checked={category.toogled}
                            />
                            {/*<Radio color="primary" />*/}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <Collapse in={category.open} timeout="auto" unmountOnExit>
                        <List
                            dense={true} component="div" disablePadding>
                            {subCategories.map(c => this.renderSubCategories(c, indentTier+1))}
                        </List>
                    </Collapse>

                </React.Fragment>
            );
        } else {
            return (
                <ListItem onDoubleClick={() => console.log('boudle click')} key={category.idCategory} button style={this.getIndent(indentTier + 1)}>
                    <ExpandLess style={{opacity: 0}}/>
                    <ListItemText inset primary={category.name} />

                    <ListItemSecondaryAction>
                        <Checkbox
                            onChange={() => this.handleToggle(category)}
                            checked={category.toogled}
                        />
                        {/*<Radio color="primary" />*/}
                    </ListItemSecondaryAction>
                </ListItem>
            );
        }
    };
    getIndent = (indentTier) => ({
        paddingLeft: (indentTier * 40)
    });

    render() {
        const { classes } = this.props;
        const { categories } = this.state;
        console.log(categories);

        return (
            <List
                dense={true}
                component="nav"
                subheader={<ListSubheader component="div">Categories</ListSubheader>}
                className={classes.root}
            >

                {categories.filter(c => c.idSuperCategory === 0).map(c => this.renderSubCategories(c, 0))}
            </List>
        );
    }

    handleToggle(category) {
        console.log('toogle check', category);
        const categories = [...this.state.categories];
        const index = categories.indexOf(category);
        categories[index].toogled = !categories[index].toogled;
        this.setState({ categories: categories });
    }
}

CategoryListDemo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CategoryListDemo);
