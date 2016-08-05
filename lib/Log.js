import Route from './Route';
import Entry from './Entry';

function Log(options) {
    return Route(Object.assign({
        route(route) {
            var entries = [];

            route.size = () => {
                return entries.length;
            };
        },
        wrap(wrapper, route) {
            wrapper.size = route.size;
        }
    }, options));
}

export default Log;
export {};