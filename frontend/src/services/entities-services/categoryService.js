import http from '../httpService';
import { CATEGORY, ID_CATEGORY, NAME } from '../../config/fieldNames';
import _ from 'lodash';


const apiEndpoint = '/categories';

function entryUrl(categoryId) {
    return `${apiEndpoint}/${categoryId}`;
}

function parseCategory(category) {
    return ({
        idSuperCategory: category[CATEGORY][ID_CATEGORY],
        name: category[NAME],
    });
}


export function getCategories() {
    return http.get(apiEndpoint);
}

export function addCategory(category) {
    return http.post(apiEndpoint, parseCategory(category));
}

export function updateCategory(category, updatedCategory) {
    return http.put(entryUrl(category[ID_CATEGORY]), parseCategory(updatedCategory));
}

export function deleteCategory(category) {
    return http.delete(entryUrl(category[ID_CATEGORY]));
}



// DATA OPERATIONS:

const categoryNamesMap = new Map([
    ['ROOT_CATEGORY', 'All categories'],
    ['INCOME_CATEGORY', 'Income categories'],
    ['EXPENSE_CATEGORY', 'Expense categories'],
]);

export function getCategoryName(category) {
    const name = categoryNamesMap.get(category.name);
    return name || category.name;
}

export function getRootCategory(categories) {
    const processLevel = (category, path) => {
        category.subCategories.forEach(c => {
            const newPath = [ ...path, 'subCategories', category.subCategories.indexOf(c)];
            c.lodashPath = newPath;
            processLevel(c, newPath);
        });
    };

    const rootCategory = categories;
    processLevel(rootCategory, []);
    return rootCategory;
}

export function getCategoriesByType(rootCategory, type) {
    const name = type === 'income' ? 'INCOME_CATEGORY' : 'EXPENSE_CATEGORY';
    if (!rootCategory || !rootCategory.subCategories) return null;
    return rootCategory.subCategories.find(c => c.name === name);
}

export function getCategoryParent(rootCategory, categoryPath) {
    const parentPath = categoryPath.slice(0, categoryPath.length - 2);
    return _.get(rootCategory, parentPath);
}
