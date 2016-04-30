import Key from './Key';

function _Route(parent, key) {
    var keys = parent ? parent.keys.map(v => v) : [];

    if (key) {
        keys.push(key);
    }

    Object.assign(this, {
        parent,
        keys: keys,
        children: {},
        subs: new Set()
    });
}

Object.assign(_Route.prototype, {
    ensureGen(obj, key) {
        return obj[key] ? obj[key] : (obj[key] = new _Route(this, key));
    },
    nextGen(key) {
        return key === '*' ? this.ensureGen(this, key) : this.ensureGen(this.children, key);
    },
    child(keys) {
        if (keys.length > 0) {
            return this.nextGen(keys.shift()).child(keys);
        }
        return this;
    },
    propagate(keys, entry) {
        if (keys.length > 0) {
            this.nextGen(keys.shift()).propagate(keys, entry);
            this.nextGen('*').propagate(keys, entry);
        } else {
            this.subs.forEach(callback => callback(...entry));
        }
    },
    root() {
        return this.parent ? this.parent.root() : this;
    },
    push(entry) {
        this.root().propagate(this.keys, [Key.stringify(this.keys)].concat(entry));
    }
});

function wrap(_route) {
    function route(key) {
        return wrap(_route.child(Key.parse(key)));
    }

    return Object.assign(route, {
        push(...entry) {
            _route.push(...entry);
        },
        key() {
            return Key.stringify(_route.keys);
        },
        subscribe(cb) {
            _route.subs.add(cb);
            return () => _route.subs.delete(cb);
        }
    });
}

function Route() {
    return wrap(new _Route());
}

export default Route;
export {Route};