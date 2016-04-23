import Immutable from 'immutable';
import Store from './Store';
import Log from './Log';
import {parseKey} from './util';

function Router(callback) {
    var root = Store();

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

function resolve(store, fragments) {
    if (fragments.length > 0) {
        var fragment = fragments.shift();
        return resolve(store.children[fragment] || (store.children[fragment] = Store()), fragments);
    }
    return store.obs;
}

function propagate(store, fragments, entry) {
    if (fragments.length > 0) {
        propagate(ensure(store, fragments.shift()), fragments, entry);
        propagate(ensure(store, '*'), fragments, entry);
    } else {
        store.push(entry);
    }
}

function ensure(store, fragment) {
    return store.children[fragment] ? store.children[fragment] : (store.children[fragment] = Store());
}

export default Router;
export {Router};