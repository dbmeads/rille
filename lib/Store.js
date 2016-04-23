const delimiter = '/';

function parseKey(key) {
    if (key === undefined) {
        throw new Error('You\'ll need a "key" for this ride...');
    } else if (key.length > 0 && key.charAt(0) === Store.delimiter) {
        key = key.trim().slice(1);
    }
    return key === '' ? [] : key.split(Store.delimiter);
}

function child(store, fragments) {
    if (Array.isArray(fragments)) {
        if (fragments.length > 1) {
            return child(child(store, fragments.shift()), fragments);
        } else if (fragments.length > 0) {
            return child(store, fragments.shift());
        }
        return store;
    }
    return store.children[fragments] || (store.children[fragments] = _Store());
}

function propagate(store, fragments, entry) {
    if (fragments.length > 0) {
        propagate(child(store, fragments.shift()), fragments, entry);
        propagate(child(store, '*'), fragments, entry);
    } else {
        store.entries.push(entry);
        store.subs.forEach(callback => callback(...entry));
    }
}

function _Store() {
    var subs = new Set();
    var entries = [];
    var children = {};

    var consumer = {
        exists(fragment) {
            return !!children[fragment];
        },
        subscribe(cb) {
            subs.add(cb);
            entries.forEach(entry => {
                cb(...entry);
            });
            return () => subs.delete(cb);
        }
    };

    var producer = Object.assign({
        child(...fragments) {
            return child(store, fragments);
        },
        push(...entry) {
            propagate(store, parseKey(entry[0]), entry);
        },
        consumer: consumer
    }, consumer);

    var store = Object.assign({
        children,
        entries,
        subs,
        producer
    }, producer);

    return store;
}

function Store() {
    return _Store().producer;
}

Object.assign(Store, {delimiter, parseKey});

export default Store;
export {Store};