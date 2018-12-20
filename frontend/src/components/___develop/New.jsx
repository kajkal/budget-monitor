import React, { Component } from 'react';
import Button from '@material-ui/core/es/Button/Button';
import CategoryForm from '../forms/CategoryForm';
import { getCategoryParent } from '../../services/entities-services/categoryService';
import _ from 'lodash';

class New extends Component {
    state = {
        open: false,
    };

    render() {
        const rootCategory = this.props.rootCategory;
        const category = _.get(rootCategory, ["subCategories", 1, "subCategories", 2, "subCategories", 0]);
        const parentCategory = getCategoryParent(rootCategory, ["subCategories", 1, "subCategories", 2, "subCategories", 0]);
        if (!rootCategory) return null;

        console.log('new categories: ', rootCategory);
        console.log('category: ', category);
        console.log('parentCategory: ', parentCategory);

        /*<EntryForm currency='PLN' type='expense'  onCancel={() => console.log('cancel')}/>*/


        return (
            <React.Fragment>
                <Button onClick={() => this.setState(state => ({ open: !state.open }))}>
                    Open form
                </Button>

                <CategoryForm
                    type={'expense'}
                    rootCategory={rootCategory}
                    superCategory={parentCategory}
                    category={category}
                    open={this.state.open}
                    onClose={() => this.setState({open: false})}
                />
            </React.Fragment>
        );
    }
}

export default New;