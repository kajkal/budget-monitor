import http from '../httpService';
import { CATEGORY, DATE, DESCRIPTION, ID_CATEGORY, ID_ENTRY, SUB_ENTRIES, VALUE } from '../../config/fieldNames';
import DateTime from 'luxon/src/datetime';
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

export function getEntry(entry) {
    // TODO: add get one entry in rest
    // return http.get(entryUrl(entry[ID_ENTRY]));
}

export function addEntry(entry, type) {
    return http.post(apiEndpoint, parseEntry(entry, type));
}

export function updateEntry(entry, type) {
    return http.put(entryUrl(entry[ID_ENTRY]), parseEntry(entry, type));
}

export function deleteEntry(entry) {
    return http.delete(entryUrl(entry[ID_ENTRY]));
}
