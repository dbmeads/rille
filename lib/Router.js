import Key from './Key';
import Store from './Store';

function Router() {
    const root = Store();
    return Object.assign({
        route: root.child
    }, root);
}

export default Router;
export {Router};