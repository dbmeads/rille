const Benchmark = require('benchmark');
const {Key} = require('./lib');

new Benchmark
    .Suite()
    .add('key.join', function () {
        Key.join('/test', 'this', 'out');
    })
    .add('key.parse', function () {
        Key.parse('/test/this/out');
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run({'async': true});