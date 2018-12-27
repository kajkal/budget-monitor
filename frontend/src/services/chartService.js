import { Interval } from 'luxon';
import { getCategoryIds } from './entities-services/categoryService';

function sumCategoryValuesInEntry(entry, categoryIds) {
    const totalEntryValue = Math.abs(entry.value);

    if (categoryIds.includes(entry.idCategory)) {
        return totalEntryValue;
    } else {
        return entry.subEntries
            .filter(subEntry => categoryIds.includes(subEntry.idCategory))
            .reduce((sum, subEntry) => sum + Math.abs(subEntry.value), 0);
    }
}

export function prepareDataStructureForBarChart(entries, selectionSpec) {
    if (!entries || !selectionSpec) return null;
    if (entries.length === 0) return { timePeriod: '', keys: [], data: [] };

    const { from, to, selectedCategories } = selectionSpec;
    const durationInWeeks = Interval.fromDateTimes(from, to).length('weeks');
    const timePeriodUnit = (durationInWeeks > 5) ? 'Month' : 'Week';
    const format = (timePeriodUnit === 'Month') ? 'yyyy-MM' : 'kkkk-WW';

    const timePeriodEntriesMap = new Map();

    // assign entries to times periods
    entries.forEach(entry => {
        const timePeriod = entry.date.toFormat(format);
        const entriesByTimePeriod = timePeriodEntriesMap.get(timePeriod) || [];
        entriesByTimePeriod.push(entry);
        timePeriodEntriesMap.set(timePeriod, entriesByTimePeriod);
    });


    const selectedCategoryCategoryIdsMap = new Map();
    selectedCategories.forEach(category => selectedCategoryCategoryIdsMap.set(category, getCategoryIds(category)));

    // create data structure: array of object with all data needed to display chart
    const data = [];
    timePeriodEntriesMap.forEach((entriesForTimePeriod, timePeriod) => {
        const dataSetForTimePeriod = {};
        selectedCategoryCategoryIdsMap.forEach((categoryIds, category) => {
            const value = entriesForTimePeriod
                .reduce((sum, entry) => sum + sumCategoryValuesInEntry(entry, categoryIds), 0);
            if (value > 0)
                dataSetForTimePeriod[category.name] = value / 100;
        });

        data.push({
            timePeriod,
            ...dataSetForTimePeriod,
        });
    });

    return {
        timePeriod: timePeriodUnit,
        keys: selectedCategories.map(c => c.name),
        data,
    };
}



export function prepareDataStructureForSunburstChart(entries, rootCategory) {
    if (!entries || !rootCategory) return null;

    console.log('prepareDataStructureForSunburstChart', entries);
    console.log('prepareDataStructureForSunburstChart', rootCategory);

    const incomeIdCategoryNodeMap = new Map();
    const expenseIdCategoryNodeMap = new Map();

    const mapCategoryToNode = (category, map) => {
        const node = {
            idCategory: category.idCategory,
            name: category.name,
            value: 0,
            children: category.subCategories.map(c => mapCategoryToNode(c, map)),
        };
        map.set(category.idCategory, node);
        return node;
    };

    // INCOME PART
    const incomeTree = mapCategoryToNode(rootCategory.subCategories.find(c => c.name === 'INCOME_CATEGORY'), incomeIdCategoryNodeMap);
    const expenseTree = mapCategoryToNode(rootCategory.subCategories.find(c => c.name === 'EXPENSE_CATEGORY'), expenseIdCategoryNodeMap);


    const mapValueToNode = entry => {
        const map = (entry.value > 0) ? incomeIdCategoryNodeMap : expenseIdCategoryNodeMap;
        const node = map.get(entry.idCategory);
        node.value += Math.abs(entry.value) / 100;
    };

    entries.forEach(entry => {
        mapValueToNode(entry);
        entry.subEntries.forEach(subEntry => mapValueToNode(subEntry));
    });


    delete incomeTree.value;
    incomeTree.totalValue = incomeTree.children.reduce((sum, node) => sum + node.value, 0);
    expenseTree.totalValue = expenseTree.children.reduce((sum, node) => sum + node.value, 0);

    console.log('INCOME');
    console.log('    tree', incomeTree);
    console.log('    map ', incomeIdCategoryNodeMap);


    console.log('EXPENSE');
    console.log('    tree', expenseTree);
    console.log('    map ', expenseIdCategoryNodeMap);


    return {
        incomeTree,
        expenseTree,
    }
}

export function prepareDataStructureForCalendarChart(entries, selectionSpec) {
    console.log('prepareDataStructureForCalendarChart', selectionSpec);

    if (!entries || !selectionSpec) return null;
    const { from, to } = selectionSpec;
    if (entries.length === 0) return { from: from.toISODate(), to: to.toISODate(), incomeData: [], expenseData: [] };


    const incomeDayValueMap = new Map();
    const expenseDayValueMap = new Map();

    entries.forEach(entry => {
        const dayValueMap = (entry.value > 0) ? incomeDayValueMap : expenseDayValueMap;
        const day = entry.date.toISODate();
        const value = dayValueMap.get(day) || 0;
        dayValueMap.set(day, value + Math.abs(entry.value) / 100);
    });

    const incomeDataArray = [];
    const expenseDataArray = [];

    incomeDataArray.forEach((value, day) => incomeDataArray.push({ day, value }));
    expenseDayValueMap.forEach((value, day) => expenseDataArray.push({ day, value }));

    console.log('INCOME:', incomeDataArray);
    console.log('EXPENSE:', expenseDataArray);

    return {
        from: from.toISODate(),
        to: to.toISODate(),
        incomeData: incomeDataArray,
        expenseData: expenseDataArray,
    }
}
