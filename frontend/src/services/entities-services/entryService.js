import http from '../httpService';
import { DateTime } from 'luxon';
import _ from 'lodash';
import { CATEGORY, DATE, DESCRIPTION, ID_CATEGORY, ID_ENTRY, SUB_ENTRIES, VALUE } from '../../config/fieldNames';

const apiEndpoint = '/entries';

function entryUrl(entryId) {
    return `${apiEndpoint}/${entryId}`;
}

function parseEntry(entry, type) {
    const factor = type === 'income' ? 100 : -100;
    return ({
        value: entry[VALUE] * factor,
        description: entry[[DESCRIPTION]],
        date: DateTime.fromISO(entry[DATE]).valueOf(),
        idCategory: _.get(entry, [CATEGORY, ID_CATEGORY]),
        subEntries: Object.values(entry[SUB_ENTRIES]).map(subEntry => ({
            value: subEntry[VALUE] * factor,
            description: subEntry[DESCRIPTION],
            idCategory: _.get(subEntry, [CATEGORY, ID_CATEGORY]),
        })),
    });
}


export function getEntries() {
    return http.get(apiEndpoint);
}

export function getRecentEntries() {
    return http.get(`${apiEndpoint}/recent`);
}

export function getEntriesBetween(from, to) {
    return http.get(`${apiEndpoint}/${from.toISODate()}/${to.toISODate()}`);
}

export function addEntry(entry, type) {
    return http.post(apiEndpoint, parseEntry(entry, type));
}

export function updateEntry(idEntry, entry, type) {
    return http.put(entryUrl(idEntry), parseEntry(entry, type));
}

export function deleteEntry(entry) {
    return http.delete(entryUrl(entry[ID_ENTRY]));
}



// DATA OPERATIONS:

export function processEntry(entry) {
    entry.date = DateTime.fromMillis(entry.date);
    return entry;
}

export function processEntries(entries) {
    entries.forEach(entry => {
        entry.date = DateTime.fromMillis(entry.date);
    });
    return entries;
}

export function processEntryDate(entry) {
    entry.date = DateTime.fromMillis(entry.date);
    return entry;
}

export function processEntriesDate(entries) {
    entries.forEach(entry => processEntryDate(entry));
    return entries;
}


export function sort(items, fieldName, order) {
    const orderFactor = order === 'desc' ? -1 : 1;
    return items.sort(({ [fieldName]: a }, { [fieldName]: b }) => {
        if (a < b) return -1 * orderFactor;
        if (a > b) return orderFactor;
        else return 0;
    });
}

// return array of object {day: '2018-10-22', entries: [Object]}
export function splitByDays(entries) {
    if (!entries) return [];

    const dayEntriesMap = new Map();
    entries.forEach(entry => {
        const day = entry.date.toISODate();
        const entriesByDay = dayEntriesMap.get(day) || [];
        entriesByDay.push(entry);
        dayEntriesMap.set(day, entriesByDay);
    });

    // // from map to array:
    const dataStructure = [];
    dayEntriesMap.forEach((value, key) => {
        dataStructure.push({
            day: DateTime.fromISO(key).setLocale('local'),
            entries: sort(value, 'date', 'desc'),
        })
    });

    // sort by day:
    return sort(dataStructure, 'day', 'desc');
    // return dataStructure.sort(({ day: a }, { day: b }) => sortDesc(a, b));
}


// FILTER ENTRIES

function isEntryAndSelectionSpecValid(entry, selectionSpec) {
    return Boolean(entry && selectionSpec);
}
function isEntriesAndSelectionSpecValid(entries, selectionSpec) {
    return Boolean(entries && selectionSpec);
}


export function filterEntryByDate(entry, selectionSpec) {
    if (!isEntryAndSelectionSpecValid(entry, selectionSpec)) return null;

    const { from, to } = selectionSpec;
    if (entry.date > from && entry.date < to) return entry;
    return null;
}

export function filterSubEntryByCategory(subEntry, selectedCategoriesIds) {
    // console.log('sprawdzanie pod kategori: ', subEntry);
    // console.log('                   wobec: ', selectedCategoriesIds);
    // console.log('                  zwraca: ', selectedCategoriesIds.includes(subEntry.idCategory));
    // console.log('\n\n');
    return selectedCategoriesIds.includes(subEntry.idCategory);
}

export function filterEntryByCategory(entry, selectionSpec) {
    if (!entry || !selectionSpec) return null;
    const { selectedCategories, selectedCategoriesIds } = selectionSpec;
    if (!entry || selectedCategoriesIds.length === 0) return null;

    if (entry.idCategory === 0) {
        // categoryType: 2 => income, 3 => expense, undefined => no category selected
        const categoryType = selectedCategories.filter(c => c.idCategory === 0).map(c => c.path[1]).find(e => e);
        if ((entry.value > 0 ? 2 : 3) === categoryType) return entry;

        if (entry.subEntries.some(subEntry => filterSubEntryByCategory(subEntry, selectedCategoriesIds))) return entry;
        return null;
    }

    if (selectedCategoriesIds.includes(entry.idCategory)) return entry;
    if (entry.subEntries.some(subEntry => filterSubEntryByCategory(subEntry, selectedCategoriesIds))) return entry;
    return null;
}

export function filterEntriesByByCategory(entries, selectionSpec) {
    if (!isEntriesAndSelectionSpecValid(entries, selectionSpec)) return [];

    const filteredEntries = [];
    entries.forEach(e => {
        if (filterEntryByCategory(e, selectionSpec))
            filteredEntries.push(e);
    });
    return filteredEntries;
}




export function filterEntriesByCategoryAndDate(entries, selectionSpec) {
    if (!entries || !selectionSpec) return [];

    const filteredEntries = [];
    entries.forEach(e => {
        if (filterEntryByCategory(e, selectionSpec) && filterEntryByDate(e, selectionSpec))
            filteredEntries.push(e);
    });
    return filteredEntries;
}

// export function filterEntryByCategory2(entry, selectionSpecification) {
//     if (!entry || !selectionSpecification) return null;
//     const { selectedCategories, selectedCategoriesIds } = selectionSpecification;
//     if (!entry || selectedCategoriesIds.length === 0) return null;
//
//     if (entry.idCategory === 0) {
//         const category = selectedCategories.find(c => c.idCategory === 0);
//         if (!category) return null;
//         if ((entry.value > 0 ? 2 : 3) === (category.path[1])) return entry;
//         return null;
//     }
//
//     const entryCategoryIsSelected = selectedCategoriesIds.filter(id => id === entry.idCategory).length > 0;
//     if (entryCategoryIsSelected) return entry;
//     return null;
// }
//
//
//
// export function filterBySelectionSpecification(entries, selectionSpecification) {
//     if (!entries || !selectionSpecification) return [];
//
//     const filteredEntries = [];
//     entries.forEach(e => {
//         if (filterEntryByCategory(e, selectionSpecification))
//             filteredEntries.push(e);
//     });
//     return filteredEntries;
// }
//
//
