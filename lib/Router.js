import Store from './Store';

function Router() {
    var root = Store();

    return Object.assign({
        route(key) {
            return root.child(Store.parseKey(key)).consumer;
        }
    }, root);
}

export default Router;
export {Router};