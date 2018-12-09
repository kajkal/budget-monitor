import React, { Component } from 'react';
import categories from '../___data/categories.json';

class SimpleCategoryListDemo extends Component {

    handleClick = () => {
        this.setState(state => ({ open: !state.open }));
    };
    renderSubList = (category, indentTier) => {
        return (
            <div style={this.getIndentClass(indentTier)}>
                {category.name}
                {category.subCategories.map(category => {
                        console.log('indent: ', indentTier);
                        console.log(category);
                        return this.renderSubList(category, indentTier+1);
                    }
                )}
            </div>
        );
    };

    render() {
        console.log(categories);
        return (
            <div>
                {categories.map(category =>
                    this.renderSubList(category, 0)
                )}
            </div>
        );
    }

    getIndentClass = (indentTier) => {
        return ({
            paddingLeft: (indentTier * 20),
        })
    }
}

export default SimpleCategoryListDemo;
