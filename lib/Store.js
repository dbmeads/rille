import Key from './Key';

function myChild(store, fragment) {
    if (fragment === '*') {
        return store.wildcard || (store.wildcard = Store());
    } else {
        return store.children[fragment] || (store.children[fragment] = Store());
    }
}

function child(store, fragments) {
    if (fragments.length > 0) {
        return child(myChild(store, fragments.shift()), fragments);
    }
    return store;
}

function propagate(store, fragments, entry) {
    if (fragments.length > 0) {
        propagate(myChild(store, fragments.shift()), fragments, entry);
        propagate(myChild(store, '*'), fragments, entry);
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
        child(key) {
            return child(this, Array.isArray(key) ? key : Key.parse(key));
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