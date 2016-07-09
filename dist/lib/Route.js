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
    var route = this;

    if (key) {
        keys.push(key);
    }

    // Propogate middleware
    function propogate(route, next) {
        for (var _len = arguments.length, entry = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            entry[_key - 2] = arguments[_key];
        }

        root().propagate(_Key2.default.parse(entry[0]), entry);
    }

    function next(funcs, pos, key) {
        for (var _len2 = arguments.length, values = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
            values[_key2 - 3] = arguments[_key2];
        }

        if (pos < funcs.length) {
            funcs[pos].apply(funcs, [root().wrapped, function () {
                for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    values[_key3] = arguments[_key3];
                }

                ++pos;
                next.apply(undefined, [funcs, pos, key].concat(values));
            }, key].concat(values));
        } else if (pos === funcs.length) {
            propogate.apply(undefined, [root(), undefined, key].concat(values));
        }
    }

    function middleware(keys) {
        var cur = options.middleware || {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _key4 = _step.value;

                if (cur[_key4]) {
                    cur = cur[_key4];
                } else if (cur['*']) {
                    cur = cur['*'];
                } else {
                    return [];
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return cur._middleware ? cur._middleware.map(function (v) {
            return v;
        }) : [];
    }

    function root() {
        return route.parent ? route.parent.root() : route;
    }

    Object.assign(route, {
        options: options,
        parent: parent,
        keys: keys,
        children: {},
        subs: new Set(),
        ensureGen: function ensureGen(obj, key) {
            return obj[key] ? obj[key] : obj[key] = new _Route(key, route);
        },
        nextGen: function nextGen(key) {
            return key === '*' ? route.ensureGen(route, key) : route.ensureGen(route.children, key);
        },
        child: function child(keys) {
            if (keys.length > 0) {
                return route.nextGen(keys.shift()).child(keys);
            }
            return route;
        },
        propagate: function propagate(keys, entry) {
            if (keys.length > 0) {
                route.nextGen(keys.shift()).propagate(keys, entry);
                route.nextGen('*').propagate(keys, entry);
            } else {
                route.subs.forEach(function (callback) {
                    return callback.apply(undefined, _toConsumableArray(entry));
                });
            }
        },

        root: root,
        push: function push() {
            for (var _len4 = arguments.length, values = Array(_len4), _key5 = 0; _key5 < _len4; _key5++) {
                values[_key5] = arguments[_key5];
            }

            next.apply(undefined, [middleware(keys), 0, _Key2.default.stringify(keys)].concat(values));
            return route;
        },
        subscribe: function subscribe(cb) {
            var subs = route.subs;
            subs.add(cb);
            return function () {
                return subs.delete(cb);
            };
        },
        key: function key() {
            return _Key2.default.stringify(keys);
        },
        childKeys: function childKeys() {
            return Object.keys(route.children);
        },
        raw: function raw() {
            var obj = {
                key: key,
                children: {}
            };

            Object.keys(route.children).forEach(function (key) {
                obj.children[key] = route.children[key].raw();
            });

            if (route['*']) {
                obj['*'] = route['*'].raw();
            }

            return obj;
        },
        toJSON: function toJSON() {
            return JSON.stringify(route.raw());
        }
    });

    if (options.route) {
        options.route(route);
    }

    // Wrap the route at the end
    route.wrapped = wrap(route);
}

function calcMiddleware(map) {
    var middleware = {};

    var _loop = function _loop(key) {
        var cur = middleware;
        var keys = _Key2.default.parse(key);
        keys.forEach(function (key) {
            if (!cur[key]) {
                cur[key] = {};
            }
            cur = cur[key];
        });
        cur._middleware = map[key].reverse();
    };

    for (var key in map) {
        _loop(key);
    }
    return middleware;
}

function wrap(route) {
    var childKeys = route.childKeys;
    var key = route.key;
    var push = route.push;
    var subscribe = route.subscribe;
    var toJSON = route.toJSON;


    var wrapper = Object.assign(function (key) {
        return route.child(_Key2.default.parse(key)).wrapped;
    }, {
        childKeys: childKeys,
        key: key,
        push: function push() {
            route.push.apply(this, arguments);
            return wrapper;
        },

        subscribe: subscribe,
        toJSON: toJSON
    });

    if (route.options.wrap) {
        route.options.wrap(wrapper, route);
    }

    return wrapper;
}

function Route(options) {
    options = Object.assign({}, options);
    options.middleware = calcMiddleware(options.middleware);
    return new _Route(undefined, undefined, options).wrapped;
}

exports.default = Route;
exports.Route = Route;