const Benchmark = require('benchmark');
const {Route} = require('./lib');

const route = Route();

new Benchmark
    .Suite()
    .add('route.push', function () {
        route.push('test');
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run({'async': true});