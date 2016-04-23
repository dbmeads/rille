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

export default Dir;
export {Dir};