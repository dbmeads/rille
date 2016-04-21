import Immutable from 'immutable';

function Log(cb) {
    var subs = new Set();
    var entries = [];

    if (cb) {
        var log = {
            subscribe(cb) {
                entries.forEach(entry => {
                    cb(entry);
                });
                subs.add(cb);
            }
        };

        cb(Object.assign({
            push(...args) {
                args.forEach(entry => {
                    entry = Immutable.fromJS(entry);
                    entries.push(entry);
                    subs.forEach(cb => {
                        cb(entry);
                    });
                });
                return this;
            }
        }, log));

        return log;
    }
    throw new Error('A "callback" must be provided to Log.');
}

export default Log;
export {Log};