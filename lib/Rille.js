const Key = require('./Key');

function Rille(key, parent) {
    key = key || Key();

    let children = {};
    let callbacks = new Set();
    let root = parent ? parent.root : rille;

    /**
     * Return a specific child rille if available.
     * @param name
     * @returns {*}
     */
    function child(name) {
        return children[name];
    }

    /**
     * Finds all rilles concerned with events for a given key.
     * @param key
     * @returns {[*]}
     */
    function find(key) {
        let nodes = [root];

        key.parts.forEach(part => {
            nodes = nodes.reduce((result, node) => {
                if (node.child(part)) {
                    result.push(node.child(part));
                }
                if (node.child('*')) {
                    result.push(node.child('*'));
                }
                return result;
            }, []);
        });

        return nodes;
    }

    /**
     * Emit publishes to the immediate rille only (excludes wildcard routes).
     * @param event
     * @returns {emit}
     */
    function emit(event) {
        callbacks.forEach(callback => callback(event));
        return this;
    }

    /**
     * Subscribe to a given rille.  Invoke the returned function to unsubscribe.
     * @param callback
     * @returns {function()}
     */
    function sub(callback) {
        callbacks.add(callback);
        return () => {
            callbacks.remove(callback);
        };
    }

    /**
     * Publish data to a given rille. Will emit the event to all concerned subscribers.
     * @param data
     */
    function pub(...event) {
        event.key = key;
        find(key).forEach(rille => rille.emit(event));
    }

    /**
     *
     * @param parts
     * @returns {*}
     */
    function rille(parts) {
        if (!Array.isArray(parts)) {
            parts = Key(parts).parts;
        }
        let [part] = parts;
        if (part) {
            if (!children[part]) {
                children[part] = Rille(key.concat(part), rille);
            }
            return children[part](parts.slice(1));
        } else {
            return rille;
        }
    }

    Object.assign(rille, {
        child,
        emit,
        key,
        sub,
        pub,
        root
    });

    return rille;
}

Object.assign(Rille, {Key});

module.exports = Rille;