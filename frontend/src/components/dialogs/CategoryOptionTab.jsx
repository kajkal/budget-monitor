import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Add, Delete, Edit } from '@material-ui/icons';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import Button from '@material-ui/core/es/Button/Button';
import CategoryList from '../common/lists/CategoryList';
import DropDownMenu from '../common/menus/DropDownMenu';
import CategoryForm from '../forms/CategoryForm';
import CategoryDeleteForm from '../forms/CategoryDeleteForm';
import { categoryRootShape } from '../../config/propTypesCommon';
import { getCategoriesByType, getCategoryParent } from '../../services/entities-services/categoryService';


class CategoryOptionTab extends PureComponent {
    state = {
        anchorEl: null,
        operationType: null,
        selectedCategory: null,
    };

    handleMenuOpen = (category, event) => {
        this.setState({ anchorEl: event.currentTarget, selectedCategory: category });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
    };

    handleBasicCategoryAddFormOpen = () => {
        const { selectedCategory } = this.state;
        const { rootCategory } = this.props;
        const parentOfSelected = getCategoryParent(rootCategory, selectedCategory.lodashPath);
        this.setState({ operationType: 'add', selectedCategory: parentOfSelected });
    };

    handleCategoryFormOpen = operationType => {
        this.setState({ operationType: operationType });
    };

    handleCategoryFormClose = () => {
        this.setState({ operationType: null });
    };

    renderOptionMenu = (anchorEl, selectedCategory) => {
        const selectedCategoryIsBasicCategory = selectedCategory && selectedCategory.path.length === 2;
        return (
            <DropDownMenu
                anchorEl={anchorEl}
                menuOptions={[
                    {
                        icon: <Add />,
                        label: 'Add category',
                        onClick: () => this.handleBasicCategoryAddFormOpen(),
                        excluded: !selectedCategoryIsBasicCategory,
                    },
                    {
                        icon: <Add />,
                        label: 'Add sub category',
                        onClick: () => this.handleCategoryFormOpen('add'),
                    },
                    {
                        icon: <Edit />,
                        label: 'Edit',
                        onClick: () => this.handleCategoryFormOpen('edit'),
                    },
                    {
                        icon: <Delete />,
                        label: 'Delete',
                        onClick: () => this.handleCategoryFormOpen('delete'),
                    },
                ]}
                onClose={this.handleMenuClose}
            />
        );
    };

    renderCategoryForm = (operationType, selectedCategory) => {
        if (!['add', 'edit'].includes(operationType)) return null;
        const { type, rootCategory, onRootCategoryChange } = this.props;
        return (
            <CategoryForm
                type={type}
                rootCategory={rootCategory}
                superCategory={operationType === 'add' ? selectedCategory : null}
                category={operationType === 'edit' ? selectedCategory : null}
                open={Boolean(selectedCategory) && Boolean(operationType)}
                onClose={this.handleCategoryFormClose}
                onRootCategoryChange={onRootCategoryChange}
            />
        );
    };

    renderDeleteCategoryDialog = (operationType, selectedCategory) => {
        if (!['delete'].includes(operationType)) return null;
        const { onRootCategoryChange } = this.props;
        return (
            <CategoryDeleteForm
                category={selectedCategory}
                open={Boolean(selectedCategory) && Boolean(operationType)}
                onClose={this.handleCategoryFormClose}
                onRootCategoryChange={onRootCategoryChange}
            />
        );
    };

    render() {
        const { anchorEl, selectedCategory, operationType } = this.state;
        const { type, rootCategory, onClose } = this.props;

        const categoryListRootCategory = getCategoriesByType(rootCategory, type);

        return (
            <React.Fragment>

                <DialogContent>

                    <CategoryList
                        rootCategory={categoryListRootCategory}
                        onSelect={(category, event) => this.handleMenuOpen(category, event)}
                        onlySubCategories={true}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color='primary'>
                        Exit
                    </Button>
                </DialogActions>

                {this.renderOptionMenu(anchorEl, selectedCategory)}

                {this.renderCategoryForm(operationType, selectedCategory)}
                {this.renderDeleteCategoryDialog(operationType, selectedCategory)}

            </React.Fragment>
        );
    }
}

CategoryOptionTab.propTypes = {
    type: PropTypes.oneOf(['expense', 'income']).isRequired,
    rootCategory: categoryRootShape.isRequired,
    onClose: PropTypes.func.isRequired,
    onRootCategoryChange: PropTypes.func.isRequired,
};

export default CategoryOptionTab;
