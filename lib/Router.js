import Immutable from 'immutable';
import Dir from './Dir';
import Log from './Log';
import {parseKey} from './util';

function Router(callback) {
    var root = Dir();

    var router = {
        route(key) {
            return resolve(root, parseKey(key));
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
                return JSON.stringify(root);
            }
        }, router));
    });

    log.subscribe(entry => {
        propagate(root, parseKey(entry.get(0)), entry);
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

export default Router;
export {Router};