const Route = require('./Route');
const Entry = require('./Entry');

function Store(options) {
    return Route(Object.assign({
        route(route) {
            route.entry = undefined;
            route.subscribe((...entry) => {
                route.entry = entry;
            });
        },
        wrap(wrapper, route) {
            wrapper.entry = () => route.entry;
            wrapper.values = () => Entry.values(route.entry);
            wrapper.value = loc => Entry.value(route.entry, loc);
        }
    }, options));
}

module.exports = Store;