function values(entry) {
    if (Array.isArray(entry)) {
        return entry.slice(1);
    }
    return [];
}

function key(entry) {
    return entry[0];
}

const Entry = {
    values,
    key
};

export default Entry;
export {Entry};