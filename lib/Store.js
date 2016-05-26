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
            wrapper.values = ordinal => {
                var values = Entry.values(route.entry);
                return ordinal != undefined ? values[ordinal] : values;
            };
        }
    })
}

export default Store;
export {Store};