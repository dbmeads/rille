const delimiter = '/';

function parse(key) {
    key = key || '';
    if (key.length > 0 && key.charAt(0) === delimiter) {
        key = key.trim().slice(1);
    }
    return key === '' ? [] : key.split(delimiter);
}

function stringify(keys) {
    var key = '';
    keys.forEach(subKey => key += delimiter + subKey);
    return key;
}

const Key = {parse, stringify};

export default Key;
export {Key};