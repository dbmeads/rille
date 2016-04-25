import Key from './Key';

function myChild(router, key) {
    if (key === '*') {
        return router.wildcard || (router.wildcard = Router(router, key));
    } else {
        return router.children[key] || (router.children[key] = Router(router, key));
    }
}

function child(router, keys) {
    if (keys.length > 0) {
        return child(myChild(router, keys.shift()), keys);
    }
    return router;
}

function propagate(router, keys, entry) {
    if (keys.length > 0) {
        propagate(myChild(router, keys.shift()), keys, entry);
        propagate(myChild(router, '*'), keys, entry);
    } else {
        router.entries[0] = entry;
        router.subs.forEach(callback => callback(...entry));
    }
}

function Router(parent, key) {
    var subs = new Set();
    var entries = [];
    var children = {};
    var keys = parent ? parent.keys.map(value => value) : [];

    if (key) {
        keys.push(key);
    }

    return {
        route(key) {
            return child(this, Array.isArray(key) ? key : Key.parse(key));
        },
        push(...entry) {
            if (parent) {
                entry[0] = Key.parse(entry[0]);
                entry[0].unshift(keys[keys.length - 1]);
                parent.push(...entry);
            } else {
                entry[0] = Key.stringify(entry[0]);
                propagate(this, Key.parse(entry[0]), entry);
            }
        },
        entry() {
            return entries[entries.length - 1];
        },
        exists(key) {
            return !!children[key];
        },
        key() {
            return Key.stringify(keys);
        },
        subscribe(cb) {
            subs.add(cb);
            entries.forEach(entry => {
                cb(...entry);
            });
            return () => subs.delete(cb);
        },
        parent,
        keys,
        children,
        entries,
        subs,
        wildcard: undefined
    };
}

export default Router;
export {Router};