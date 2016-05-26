function data(entry) {
    if (Array.isArray(entry)) {
        return entry.slice(1);
    }
}

function key(entry) {
    return entry[0];
}

const Entry = {
    data,
    key
};

export default Entry;
export {Entry};