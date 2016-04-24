import Key from './Key';
import Store from './Store';

function Router() {
    return Object.assign({
        route(key) {
            return this.child(Key.parse(key));
        }
    }, Store());
}

export default Router;
export {Router};