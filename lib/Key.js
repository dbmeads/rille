const delimiter = '/';

function parse(key) {
    key = key || '';
    if (key.length > 0 && key.charAt(0) === delimiter) {
        key = key.trim().slice(1);
    }
    return key === '' ? [] : key.split(delimiter);
}

const Key = {parse};

export default Key;
export {Key};