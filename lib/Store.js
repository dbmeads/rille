import {Route} from './Route';

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
        }
    })
}

export default Store;
export {Store};