import http from '../httpService';
import { CATEGORY, DATE, DESCRIPTION, ID_CATEGORY, ID_ENTRY, SUB_ENTRIES, VALUE } from '../../config/fieldNames';
import { DateTime } from 'luxon';
import _ from 'lodash';

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

export function getEntry(entry) {
    // TODO: add get one entry in rest
    // return http.get(entryUrl(entry[ID_ENTRY]));
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
    if (!entries) return null;

    const dayEntriesMap = new Map();
    entries.forEach(entry => {
        const day = entry.date.toISODate();
        const entriesByDay = dayEntriesMap.get(day) || [];
        entriesByDay.push(entry);
        dayEntriesMap.set(day, entriesByDay);
    });

    console.log('dayEntriesMap', dayEntriesMap);

    // // from map to array:
    const dataStructure = [];
    dayEntriesMap.forEach((value, key) => {
        dataStructure.push({
            day: DateTime.fromISO(key).setLocale('local'),
            entries: sort(value, 'date', 'desc'),
        })
    });

    console.log('dataStructure', dataStructure);

    // sort by day:
    return sort(dataStructure, 'day', 'desc');
    // return dataStructure.sort(({ day: a }, { day: b }) => sortDesc(a, b));
}



