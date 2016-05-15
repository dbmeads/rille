const Entry = {
    data(entry) {
        return entry.length > 2 ? entry.slice(1) : entry[1];
    },
    key(entry) {
        return entry[0];
    }
};

export default Entry;
export {Entry};