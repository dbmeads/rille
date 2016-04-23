import Immutable from 'immutable';
import Store from './Store';

function Router(callback) {
    var root = Store();
    
    var router = {
        route(key) {
            return root.child(Store.parseKey(key)).consumer;
        }
    };

    callback(Object.assign({}, router, root));

    return router;
}

export default Router;
export {Router};