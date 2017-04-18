'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _chai = require('chai');

var _index = require('../lib/index');

describe('Key', function () {
    describe('parse', function () {
        it('should parse correctly', function () {
            (0, _chai.expect)(_index.Key.parse('/')).to.eql([]);
            (0, _chai.expect)(_index.Key.parse('/child')).to.eql(['child']);
            (0, _chai.expect)(_index.Key.parse('/lobby/1')).to.eql(['lobby', '1']);
        });

        it('should handle parsed input', function () {
            (0, _chai.expect)(_index.Key.parse(['child'])).to.eql(['child']);
        });

        it('should return specific path fragments when requested', function () {
            var _Key$parse = _index.Key.parse('/i/am/a/key', [0, 3]),
                _Key$parse2 = _slicedToArray(_Key$parse, 2),
                a = _Key$parse2[0],
                b = _Key$parse2[1];

            (0, _chai.expect)(a).to.equal('i');
            (0, _chai.expect)(b).to.equal('key');
        });

        it('should throw proper exception if requested fragment is out of range', function () {
            (0, _chai.expect)(function () {
                return _index.Key.parse('/i/am/a/key', [0, 4]);
            }).to.throw;
        });
    });

    describe('stringify', function () {
        it('should stringify correctly', function () {
            (0, _chai.expect)(_index.Key.stringify([])).to.eql('/');
            (0, _chai.expect)(_index.Key.stringify(['child'])).to.eql('/child');
            (0, _chai.expect)(_index.Key.stringify(['lobby', '1'])).to.eql('/lobby/1');
        });

        it('should handle stringified input', function () {
            (0, _chai.expect)(_index.Key.stringify('/child')).to.equal('/child');
        });
    });
});