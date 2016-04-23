import Immutable from 'immutable';
import Log from './Log';

const delimeter = '/';

function split(key) {
    if (key === undefined) {
        throw new Error('You\'ll need a "key" for this ride...');
    } else if (key.length > 0 && key.charAt(0) === delimeter) {
        key = key.trim().slice(1);
    }

    return key === '' ? [] : key.split(delimeter);
}

function Router(callback) {
    var dir = Dir();

    var router = {
        route(key) {
            return resolve(dir, split(key));
        }
    };

    var log = Log({
        schema: {
            type: 'array',
            'minItems': 2,
        }
    }, log => {
        callback(Object.assign({
            log,
            toJSON() {
                return JSON.stringify(dir);
            }
        }, router));
    });

    log.subscribe(entry => {
        propagate(dir, split(entry.get(0)), entry);
    });

    return router;
}

function resolve(dir, fragments) {
    if (fragments.length > 0) {
        var fragment = fragments.shift();
        return resolve(dir.children[fragment] || (dir.children[fragment] = Dir()), fragments);
    }
    return dir.obs;
}

function propagate(dir, fragments, entry) {
    if (fragments.length > 0) {
        propagate(ensure(dir, fragments.shift()), fragments, entry);
        propagate(ensure(dir, '*'), fragments, entry);
    } else {
        dir.push(entry);
    }
}

function ensure(dir, fragment) {
    return dir.children[fragment] ? dir.children[fragment] : (dir.children[fragment] = Dir());
}

function Dir() {
    var subs = new Set();
    var entries = [];
    var obs = {
        subscribe(cb) {
            subs.add(cb);
            dir.subs++;
            entries.forEach(entry => {
                cb(...entry);
            })
        }
    };
    var dir = {
        children: {},
        push(entry) {
            entries.push(entry);

            subs.forEach(cb => {
                cb(...entry);
            });
        },
        subs: 0,
        obs: obs
    };
    return dir;
}

export default Router;
export {Router};