import {Route} from './Route';
import {Entry} from './Entry';

function Store() {
    return Route({
        route(route) {
            route.entry = undefined;
            route.subscribe((...entry) => {
                route.entry = entry;
            });
        },
        wrap(wrapper, route) {
            wrapper.entry = () => route.entry;
            wrapper.data = () => Entry.data(route.entry);
        }
    })
}

export default Store;
export {Store};