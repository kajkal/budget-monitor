import categories from '../../components/___data/categories.json';


export function getCategoriesByType(rootCategory, type) {
    const name = type === 'income' ? 'INCOME_CATEGORIES' : 'EXPENSE_CATEGORIES';
    if (!categories || !categories.subCategories) return null;
    return rootCategory.subCategories.find(c => c.name === name);
}

export function getRootCategory() {
    const processLevel = (category, path) => {
        category.subCategories.forEach(c => {
            const newPath = [ ...path, 'subCategories', category.subCategories.indexOf(c)];
            c.lodashPath = newPath;
            processLevel(c, newPath);
        });
    };

    const rootCategory = JSON.parse(JSON.stringify(categories));
    processLevel(rootCategory, []);
    return rootCategory;
}
