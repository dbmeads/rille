import Immutable from 'immutable';
import Dir from './Dir';

function Router(callback) {
    var router = {
        route(key) {
            return root.child(Dir.parseKey(key)).consumer;
        }
    };

    callback(Object.assign({}, router, Dir()));

    return router;
}

export default Router;
export {Router};