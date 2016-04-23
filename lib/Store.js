function Store() {
    var subs = new Set();
    var entries = [];
    var obs = {
        subscribe(cb) {
            subs.add(cb);
            store.subs++;
            entries.forEach(entry => {
                cb(...entry);
            });
            return () => subs.delete(cb);
        }
    };
    var store = {
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
    return store;
}

export default Store;
export {Store};