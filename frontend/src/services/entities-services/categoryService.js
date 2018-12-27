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

let idCategoryCategoryMap;

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
            idCategoryCategoryMap.set(c.idCategory, c);
            processLevel(c, newPath);
        });
    };
    const addUncategorizedSubCategory = category => {
        category.subCategories.push({
            idCategory: 0,
            path: [1, category.idCategory],
            name: 'Uncategorized',
            color: 0,
            subCategories: [],
            lodashPath: [ ...category.lodashPath, 'subCategories', category.subCategories.length],
        });
    };

    const rootCategory = categories;
    idCategoryCategoryMap = new Map();
    processLevel(rootCategory, []);
    rootCategory.subCategories.forEach(c => addUncategorizedSubCategory(c));
    return rootCategory;
}

export function getCategoryIds(category) {
    const processLevel = (category, ids) => {
        ids.push(category.idCategory);
        category.subCategories.forEach(c => processLevel(c, ids));
        return ids;
    };

    return processLevel(category, []);
}

export function getCategoriesIds(categories) {
    if (!categories) return [];
    const processLevel = (category, ids) => {
        ids.push(category.idCategory);
        category.subCategories.forEach(c => processLevel(c, ids));
    };
    const categoriesIds = [];
    categories.forEach(c => processLevel(c, categoriesIds));
    return categoriesIds;
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

export function getCategoryByIdCategory(idCategory) {
    if (!idCategoryCategoryMap) return null;
    return idCategoryCategoryMap.get(idCategory);
}

