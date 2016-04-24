import Key from './Key';

function child(store, fragments) {
    if (Array.isArray(fragments)) {
        if (fragments.length > 1) {
            return child(child(store, fragments.shift()), fragments);
        } else if (fragments.length > 0) {
            return child(store, fragments.shift());
        }
        return store;
    }
    if (fragments === '*') {
        return store.wildcard || (store.wildcard = Store());
    } else {
        return store.children[fragments] || (store.children[fragments] = Store());
    }
}

function propagate(store, fragments, entry) {
    if (fragments.length > 0) {
        propagate(child(store, fragments.shift()), fragments, entry);
        propagate(child(store, '*'), fragments, entry);
    } else {
        store.entries[0] = entry;
        store.subs.forEach(callback => callback(...entry));
    }
}

function Store() {
    var subs = new Set();
    var entries = [];
    var children = {};

    return {
        child(...fragments) {
            return child(this, fragments);
        },
        push(...entry) {
            propagate(this, Key.parse(entry[0]), entry);
        },
        entry() {
            return entries[entries.length - 1];
        },
        exists(fragment) {
            return !!children[fragment];
        },
        subscribe(cb) {
            subs.add(cb);
            entries.forEach(entry => {
                cb(...entry);
            });
            return () => subs.delete(cb);
        },
        children,
        entries,
        subs,
        wildcard: undefined
    };
}

export default Store;
export {Store};