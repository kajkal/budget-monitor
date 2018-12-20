import React, { Component } from 'react';
import Paper from '@material-ui/core/es/Paper/Paper';
import CategoryList from '../common/lists/CategoryList';
import { getCategoriesByType, getRootCategory } from '../../services/entities-services/categoryService';
import categories from './../___data/categories';


class Test extends Component {
    render() {
        const rootCategory = getRootCategory(categories);

        return (
            <Paper>

                <CategoryList
                    rootCategory={getCategoriesByType(rootCategory, 'expense')}
                    onSelect={(category) => console.log('selected', category)}
                    header={'All Categories'}
                />

                <CategoryList
                    rootCategory={getCategoriesByType(rootCategory, 'expense')}
                    onSelect={(category) => console.log('selected', category)}
                    header={'All Categories'}
                    onlySubCategories
                />

            </Paper>
        );
    }
}

export default Test;
