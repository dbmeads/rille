const Benchmark = require('benchmark');
const Rille = require('./lib');

let rille = Rille();

rille('/test/a/route').sub(() => {});
rille('/test/*/route').sub(() => {});
rille('/test/*/*').sub(() => {});
rille('/*/*/*').sub(() => {});

new Benchmark
    .Suite()
    .add('no op', () => {})
    .add('pub (shallow route)', () => rille.pub())
    .add('pub (wildcard routes)', () => rille('/test/a/route').pub())
    .add('pub (deep route)', () => rille('/1/2/3/4/5/6/7/8/9/0').pub())
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run({'async': true});