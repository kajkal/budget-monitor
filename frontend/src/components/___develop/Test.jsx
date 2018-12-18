import React, { Component } from 'react';
import Paper from '@material-ui/core/es/Paper/Paper';
import CategoryList from '../common/lists/CategoryList';
import { getCategoriesByType, getRootCategory } from '../../services/entities-services/categoryService';


class Test extends Component {
    render() {
        const rootCategory = getRootCategory();

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
