'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Route = undefined;

var _Key = require('./Key');

var _Key2 = _interopRequireDefault(_Key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _Route(key, parent, options) {
    options = parent ? parent.options : options || {};

    var keys = parent ? parent.keys.map(function (v) {
        return v;
    }) : [];

    if (key) {
        keys.push(key);
    }

    Object.assign(this, {
        options: options,
        parent: parent,
        keys: keys,
        children: {},
        subs: new Set()
    });

    if (options.route) {
        options.route(this);
    }
}

Object.assign(_Route.prototype, {
    ensureGen: function ensureGen(obj, key) {
        return obj[key] ? obj[key] : obj[key] = new _Route(key, this);
    },
    nextGen: function nextGen(key) {
        return key === '*' ? this.ensureGen(this, key) : this.ensureGen(this.children, key);
    },
    child: function child(keys) {
        if (keys.length > 0) {
            return this.nextGen(keys.shift()).child(keys);
        }
        return this;
    },
    propagate: function propagate(keys, entry) {
        if (keys.length > 0) {
            this.nextGen(keys.shift()).propagate(keys, entry);
            this.nextGen('*').propagate(keys, entry);
        } else {
            this.subs.forEach(function (callback) {
                return callback.apply(undefined, _toConsumableArray(entry));
            });
        }
    },
    root: function root() {
        return this.parent ? this.parent.root() : this;
    },
    push: function push() {
        for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
            entry[_key] = arguments[_key];
        }

        this.root().propagate(this.keys, [_Key2.default.stringify(this.keys)].concat(entry));
    },
    subscribe: function subscribe(cb) {
        var subs = this.subs;
        subs.add(cb);
        return function () {
            return subs.delete(cb);
        };
    }
});

function wrap(_route) {
    var route = Object.assign(function (key) {
        return wrap(_route.child(_Key2.default.parse(key)));
    }, {
        push: function push() {
            _route.push.apply(_route, arguments);
        },
        key: function key() {
            return _Key2.default.stringify(_route.keys);
        },
        subscribe: function subscribe(cb) {
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

exports.default = Route;
exports.Route = Route;