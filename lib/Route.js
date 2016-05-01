import Key from './Key';

function _Route(key, parent, options) {
    options = parent ? parent.options : (options || {});

    var keys = parent ? parent.keys.map(v => v) : [];

    if (key) {
        keys.push(key);
    }

    Object.assign(this, {
        options,
        parent,
        keys: keys,
        children: {},
        subs: new Set()
    });

    if (options.route) {
        options.route(this);
    }
}

Object.assign(_Route.prototype, {
    ensureGen(obj, key) {
        return obj[key] ? obj[key] : (obj[key] = new _Route(key, this));
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
    push(...entry) {
        this.root().propagate(this.keys, [Key.stringify(this.keys)].concat(entry));
    },
    subscribe(cb) {
        var subs = this.subs;
        subs.add(cb);
        return () => subs.delete(cb);
    }
});

function wrap(_route) {
    var route = Object.assign(key => {
        return wrap(_route.child(Key.parse(key)));
    }, {
        push(...entry) {
            _route.push(...entry);
        },
        key() {
            return Key.stringify(_route.keys);
        },
        subscribe(cb) {
            return _route.subscribe(cb);
        }
    });

    if (_route.options.wrap) {
        _route.options.wrap(_route, route);
    }

    return route;
}

function Route(options) {
    return wrap(new _Route(undefined, undefined, options));
}

export default Route;
export {Route};