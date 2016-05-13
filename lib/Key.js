const delimiter = '/';

function parse(key) {
    if(Array.isArray(key)) {
        return key;
    }
    key = key || '';
    if (key.length > 0 && key.charAt(0) === delimiter) {
        key = key.trim().slice(1);
    }
    return key === '' ? [] : key.split(delimiter);
}

function stringify(keys) {
    if(typeof keys === 'string') {
        return keys;
    }
    if(keys.length > 0) {
        var key = '';
        keys.forEach(subKey => key += delimiter + subKey);
        return key;
    }
    return '/';
}

const Key = {parse, stringify};

export default Key;
export {Key};