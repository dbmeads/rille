import Immutable from 'immutable';
import tv4 from 'tv4';

function Log(...args) {
    var options = args.length > 1 ? args[0] : {};
    var {schema} = options;
    var cb = args.length > 1 ? args[1] : args[0];
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
                var entry = args.length === 1 ? args[0] : args;
                if (schema && !tv4.validate(entry, schema)) {
                    throw tv4.error;
                }
                entry = Immutable.fromJS(entry);
                entries.push(entry);
                subs.forEach(cb => {
                    cb(entry);
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