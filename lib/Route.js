import Key from './Key';

function myChild(route, key) {
    if (key === '*') {
        return route.wildcard || (route.wildcard = Route(route, key));
    } else {
        return route.children[key] || (route.children[key] = Route(route, key));
    }
}

function child(route, keys) {
    if (keys.length > 0) {
        return child(myChild(route, keys.shift()), keys);
    }
    return route;
}

function propagate(route, keys, entry) {
    if (keys.length > 0) {
        propagate(myChild(route, keys.shift()), keys, entry);
        propagate(myChild(route, '*'), keys, entry);
    } else {
        entry[0] = Key.stringify(entry[0]);
        route.subs.forEach(callback => callback(...entry));
    }
}

function push(route, entry) {
    while (route.parent) {
        route = route.parent;
    }
    propagate(route, entry[0].map(v=>v), entry);
}

function Route(parent, key) {
    var subs = new Set();
    var children = {};
    var keys = parent ? parent.keys.map(v => v) : [];

    if (key) {
        keys.push(key);
    }

    function route(key) {
        return child(route, Key.parse(key));
    }

    return Object.assign(route, {
        push(...entry) {
            push(this, [keys].concat(entry));
        },
        exists(key) {
            return !!children[key];
        },
        key() {
            return Key.stringify(keys);
        },
        subscribe(cb) {
            subs.add(cb);
            return () => subs.delete(cb);
        },
        parent,
        keys,
        children,
        subs,
        wildcard: undefined
    });
}

export default Route;
export {Route};