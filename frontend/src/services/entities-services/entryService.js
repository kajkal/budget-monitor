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
        value: (entry[VALUE] * factor).toFixed(0),
        description: entry[DESCRIPTION].trim(),
        date: DateTime.fromISO(entry[DATE]).valueOf(),
        idCategory: _.get(entry, [CATEGORY, ID_CATEGORY]),
        subEntries: Object.values(entry[SUB_ENTRIES]).map(subEntry => ({
            value: (subEntry[VALUE] * factor).toFixed(0),
            description: subEntry[DESCRIPTION].trim(),
            idCategory: _.get(subEntry, [CATEGORY, ID_CATEGORY]),
        })),
    });
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
    if (!entry.idCategory) entry.idCategory = 0;
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
            day: DateTime.fromISO(key),
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

function isEntryBetweenDates(entry, from, to) {
    return (entry.date > from && entry.date < to);
}
function isEntryOfSelectedCategory(entry, selectedCategoriesIds) {
    return selectedCategoriesIds.includes(entry.idCategory) ||
        entry.subEntries.some(subEntry => selectedCategoriesIds.includes(subEntry.idCategory));
}


export function filterEntryByDate(entry, selectionSpec) {
    if (!isEntryAndSelectionSpecValid(entry, selectionSpec)) return null;

    const { from, to } = selectionSpec;
    if (isEntryBetweenDates(entry, from, to)) return entry;
    return null;
}

export function filterEntryByCategory(entry, selectionSpec) {
    if (!isEntryAndSelectionSpecValid(entry, selectionSpec)) return null;
    const { selectedCategoriesType, selectedCategoriesIds } = selectionSpec;

    const entryType = entry.value > 0 ? 1 : -1;
    if (entryType !== selectedCategoriesType) return null;

    if (isEntryOfSelectedCategory(entry, selectedCategoriesIds)) return entry;
    return null;
}

export function filterEntriesByCategory(entries, selectionSpec) {
    if (!isEntriesAndSelectionSpecValid(entries, selectionSpec)) return [];
    return entries.filter(entry => filterEntryByCategory(entry, selectionSpec));
}
