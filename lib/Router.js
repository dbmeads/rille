import Immutable from 'immutable';
import Log from './Log';

const delimeter = '/';

function split(key) {
    if (key === undefined) {
        throw new Error('You\'ll need a "key" for this ride...');
    } else if (key.length > 0 && key.charAt(0) === delimeter) {
        key = key.slice(1);
    }

    return key.split(delimeter);
}

function Router(callback) {
    var trie = Trie();

    var router = {
        route(key) {
            return resolve(trie, split(key));
        }
    };

    var log = Log(log => {
        callback(Object.assign({
            push(key, value) {
                log.push({
                    key: key,
                    value: value
                })
            },
            toJSON() {
                return JSON.stringify(trie);
            }
        }, router));
    });

    log.subscribe(entry => {
        propagate(trie, split(entry.get('key')), entry);
    });

    return router;
}

function resolve(trie, fragments) {
    if (fragments.length > 1) {
        var fragment = fragments.shift();
        return resolve(trie.children[fragment] || (trie.children[fragment] = Trie()), fragments);
    }
    return trie.obs;
}

function propagate(trie, fragments, entry) {
    if (fragments.length > 1) {
        var fragment = fragments.shift();
        propagate(trie[fragment], fragments, entry);
        var wildcard = trie['*'];
        if (wildcard) {
            wildcard.push(entry);
            propagate(wildcard, fragments, entry);
        }
    } else if (trie) {
        trie.push(entry);
    }
}

function Trie() {
    var subs = new Set();
    var obs = {
        subscribe(cb) {
            subs.add(cb);
            trie.subs++;
        }
    };
    var trie = {
        children: {},
        push(entry) {
            subs.forEach(cb => {
                cb(entry.toJS());
            });
        },
        subs: 0,
        obs: obs
    };
    return trie;
}

export default Router;
export {Router};