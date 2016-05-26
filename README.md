# [Rille](http://www.rille.io) [![Build Status](https://img.shields.io/travis/dbmeads/rille/master.svg?style=flat-square)](https://travis-ci.org/dbmeads/rille) [![Coverage Status](https://img.shields.io/coveralls/dbmeads/rille/master.svg?style=flat-square)](https://coveralls.io/github/dbmeads/rille?branch=master) [![npm version](https://img.shields.io/npm/v/rille.svg?style=flat-square)](https://www.npmjs.com/package/rille) [![npm downloads](https://img.shields.io/npm/dm/rille.svg?style=flat-square)](https://www.npmjs.com/package/rille) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md#pull-requests)

## Quick Links

#### General
* [Installation](#installation)
* [Contributing](#contributing)
* [Examples](#examples)
* [Change Log](#change-log)

#### Modules
* [Entry](#entry)
* [Key](#key)
* [Route](#route)
* [Store](#store)

## Examples

TBD

[Back To Top](#quick-links)

## Installation

`npm install rille --save`

[Back To Top](#quick-links)

## Contributing

* To Build: `npm run build`
* To Test: `npm test`

[Back To Top](#quick-links)

## Entry

Entry provides some convenience functions for working with entries.  An entry is an array where the head is the key and the tail is data (e.g.: ['/some/key', data1, data2, ...]).


```js

// Returns the array of data for an entry
var data = Entry.data(entry);

// Returns the key of an entry
var key = Entry.key(entry);

```

[Back To Top](#quick-links)

## Key

Key provides convenience functions for parsing and stringify'ing keys.

```js

// Converts string format into array format
var keys = Key.parse('/i/am/a/key');

// Converts array format into string format
var key = Key.stringify(['i','am','a','key']);

```

[Back To Top](#quick-links)

## Route

Route is the core of Rille and provides support for routing event data to appropriate subscribers.

```js

// Create a route
const route = Route();

// Subscribe to receive updates to a route
route.subscribe((key, ...data) => {
    console.log('My key is ' + key + ' and my data is ' + JSON.stringify(data));
});

// Subscribe to receive updates on a child route
route('/child/1').subscribe((key, ...data) => {
    console.log('My key is ' + key + ' and my data is ' + JSON.stringify(data));
});

// Subscribe to receive updates for all child of a route (a wildcard route)
route('/child/*').subscribe((key, ...data) => {
    console.log('Wildcard Route: My key is ' + key + ' and my data is ' + JSON.stringify(data));
});
                 
// Push data to a route
route.push('Hi!');

// Push multiple pieces and types of data to a route
route.push('Hi!', {user: 'Frank'}); 

// Push data to a child route
route('/child/1').push('Hi child!');

```

[Back To Top](#quick-links)

## Store

Store is a route that retains it's most recent entry.

```js

// Create a store just like a route
const store = Store();

var child = store('/some/child');

// Subscribe to a store just like a route
child.subscribe((...entry) => {
    console.log('received ' + JSON.stringify(entry));
});

// Push to a store just like a route
child.push('Hello child!');

// Get the most recent entry
var entry = child.entry();
console.log('most recent entry ' + JSON.stringify(entry));

// Get the array of data for the most recent entry
var data = child.data();
console.log('most recent data ' + JSON.stringify(data));

// Get a particular data item from the most recent entry
console.log('message is "' + child.data(0) + '".');

```

[Back To Top](#quick-links)

## Change Log

#### 0.16.0
1. `Entry.data()` always returns an array.

#### 0.13.0
1. Added `Entry`.

[Back To Top](#quick-links)