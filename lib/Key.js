const delimiter = '/';

function parse(key, locs) {
    if (Array.isArray(key)) {
        return key;
    }
    key = key || '';
    if (key.length > 0 && key.charAt(0) === delimiter) {
        key = key.trim().slice(1);
    }
    let fragments = key === '' ? [] : key.split(delimiter);
    if (locs) {
        let requested = [];
        locs.forEach(loc => {
            if (loc < fragments.length) {
                requested.push(fragments[loc]);
            } else {
                throw `Invalid loc [${loc}] passed to Key.parse`;
            }
        });
        return requested;
    }
    return fragments;
}

function stringify(keys) {
    if (typeof keys === 'string') {
        return keys;
    }
    if (keys.length > 0) {
        let key = '';
        keys.forEach(subKey => key += delimiter + subKey);
        return key;
    }
    return '/';
}

const Key = {
    parse,
    stringify
};

module.exports = Key;