const delimiter = '/';

function parse(key) {
    if (Array.isArray(key)) {
        return key;
    }
    key = key || '';
    if (key.length > 0 && key.charAt(0) === delimiter) {
        key = key.trim().slice(1);
    }
    return key === '' ? [] : key.split(delimiter);
}

function join(keys) {
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

function Key(...args) {
    let parts = parse(args.length > 1 ? args : args[0]);

    function concat(...args) {
        return Key(parts.concat(args));
    }

    function toString() {
        return join(parts);
    }

    return {
        concat,
        parts,
        toString
    };
}

module.exports = Key;