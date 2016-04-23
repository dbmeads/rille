const delimiter = '/';

function parseKey(key) {
    if (key === undefined) {
        throw new Error('You\'ll need a "key" for this ride...');
    } else if (key.length > 0 && key.charAt(0) === Dir.delimiter) {
        key = key.trim().slice(1);
    }
    return key === '' ? [] : key.split(Dir.delimiter);
}

function child(dir, fragments) {
    if (Array.isArray(fragments)) {
        if (fragments.length > 1) {
            return child(child(dir, fragments.shift()), fragments);
        } else if (fragments.length > 0) {
            return child(dir, fragments.shift());
        }
        return dir;
    }
    return dir.children[fragments] || (dir.children[fragments] = _Dir());
}

function propagate(dir, fragments, entry) {
    if (fragments.length > 0) {
        propagate(child(dir, fragments.shift()), fragments, entry);
        propagate(child(dir, '*'), fragments, entry);
    } else {
        dir.entries.push(entry);
        dir.subs.forEach(callback => callback(...entry));
    }
}

function _Dir() {
    var subs = new Set();
    var entries = [];
    var children = {};

    var consumer = {
        exists(fragment) {
            return !!children[fragment];
        },
        subscribe(cb) {
            subs.add(cb);
            entries.forEach(entry => {
                cb(...entry);
            });
            return () => subs.delete(cb);
        }
    };

    var producer = Object.assign({
        child(...fragments) {
            return child(dir, fragments);
        },
        push(...entry) {
            propagate(dir, parseKey(entry[0]), entry);
        },
        consumer: consumer
    }, consumer);

    var dir = Object.assign({
        children,
        entries,
        subs,
        producer
    }, producer);

    return dir;
}

function Dir() {
    return _Dir().producer;
}

Object.assign(Dir, {delimiter, parseKey});

export default Dir;
export {Dir};