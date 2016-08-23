function key(entry) {
    return entry[0];
}

function value(entry, loc) {
    if (entry) {
        return entry[(loc !== undefined ? loc : 0) + 1];
    }
}

function values(entry) {
    if (Array.isArray(entry)) {
        return entry.slice(1);
    }
    return [];
}

const Entry = {
    key,
    value,
    values
};

export default Entry;
export {key, value, values};