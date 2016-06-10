# [Rille](http://www.rille.io) [![Build Status](https://img.shields.io/travis/dbmeads/rille/master.svg?style=flat-square)](https://travis-ci.org/dbmeads/rille) [![Coverage Status](https://img.shields.io/coveralls/dbmeads/rille/master.svg?style=flat-square)](https://coveralls.io/github/dbmeads/rille?branch=master) [![npm version](https://img.shields.io/npm/v/rille.svg?style=flat-square)](https://www.npmjs.com/package/rille) [![npm downloads](https://img.shields.io/npm/dm/rille.svg?style=flat-square)](https://www.npmjs.com/package/rille) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md#pull-requests)

Think of Rille as a key-value store and router for your application state.  You could also think of it as a message broker / data pipeline for your application state.  

Consuming portions of your application can subscribe to well known routes and simply wait for data to be pushed to them while producing portions of your application can push data without worrying about who is consuming data on the other end.

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

Entry provides some convenience functions for working with entries.  An entry is an array where the head is the key and the tail contains values (e.g.: ['/some/key', value1, value2, ...]).


```js

import {Entry} from 'rille';

// Returns the array of values for an entry
var values = Entry.values(entry);

// Returns the key of an entry
var key = Entry.key(entry);

```

[Back To Top](#quick-links)

## Key

Key provides convenience functions for parsing and stringify'ing keys.

```js

import {Key} from 'rille';

// Converts string format into array format
var keys = Key.parse('/i/am/a/key');

// Return only specific key fragments (useful for parameter extraction)
var [id] = Key.parse('/users/123243/', [1]);  // Will set id = 123243

// Converts array format into string format
var key = Key.stringify(['i','am','a','key']);

```

[Back To Top](#quick-links)

## Route

Route is the core of Rille and provides support for routing entries (key + values) to appropriate subscribers.

```js

import {Route} from 'rille';

// Create a route
const route = Route();

// Subscribe to receive updates to a route
route.subscribe((key, ...values) => {
    console.log('My key is ' + key + ' and my values are ' + JSON.stringify(values));
});

// Subscribe to receive updates on a child route
route('/child/1').subscribe((key, ...values) => {
    console.log('My key is ' + key + ' and my values are ' + JSON.stringify(values));
});

// Subscribe to receive updates for all child of a route (a wildcard route)
route('/child/*').subscribe((key, ...values) => {
    console.log('Wildcard Route: My key is ' + key + ' and my values are ' + JSON.stringify(values));
});
                 
// Push a value(s) to a route
route.push('Hi!');

// Push value(s) of any type to a route
route.push('Hi!', {user: 'Frank'}); 

// Push value(s) to a child route
route('/child/1').push('Hi child!');

```

[Back To Top](#quick-links)

## Store

Store is a route that retains it's most recent entry.

```js

import {Store} from 'rille';

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

// Get the array of values for the most recent entry
var values = child.values();
console.log('most recent values ' + JSON.stringify(values));

// Get a particular value from the most recent entry
console.log('message is "' + child.values(0) + '".');

```

[Back To Top](#quick-links)

## Change Log

#### 0.25.0
1. `Key.parse` now supports parameter extraction.

#### 0.23.0
1. Add `functionTree` to `Route` objects.
2. Add `functionTrees` to `Route` objects.
3. `Entry.values` and `Store.values` should always return an array.

#### 0.21.0
1. `push` now returns the route for chaining.

#### 0.20.0
1. `Entry.data()` is now `Entry.values()` and `store.data` is now `store.values`.

#### 0.16.0
1. `Entry.data()` always returns an array.

#### 0.13.0
1. Added `Entry`.

[Back To Top](#quick-links)