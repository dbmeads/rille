const delimiter = '/';

function parse(key, ordinals) {
    if (Array.isArray(key)) {
        return key;
    }
    key = key || '';
    if (key.length > 0 && key.charAt(0) === delimiter) {
        key = key.trim().slice(1);
    }
    var fragments = key === '' ? [] : key.split(delimiter);
    if (ordinals) {
        var requested = [];
        ordinals.forEach(ordinal => {
            if (ordinal < fragments.length) {
                requested.push(fragments[ordinal]);
            } else {
                throw `Invalid ordinal [${ordinal}] passed to Key.parse`;
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
        var key = '';
        keys.forEach(subKey => key += delimiter + subKey);
        return key;
    }
    return '/';
}

const Key = {
    parse,
    stringify
};

export default Key;
export {Key};