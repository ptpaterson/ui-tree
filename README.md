# ui-tree [![npm](https://img.shields.io/npm/v/ui-tree.svg)](https://www.npmjs.com/package/ui-tree) [![Build Status](https://travis-ci.org/ptpaterson/ui-tree.svg?branch=master)](https://travis-ci.org/ptpaterson/ui-tree)

> A UI Tree data structure for any front end, or none at all!

## Introduction

I was looking for a way to work with several different sets of hierarchical data with the same library.  At the same time, I was unable to commit to a front-end, so I needed to keep the data structure library independent.

### Features

Still working on some of the basics...

- [x] Simple API for simple data
- [x] Lazy loading
- [x] Custom data loading
- [ ] Return nodes by field Value
- [ ] Mask selection by ancestor Value
- [ ] Filtering
- [ ] Add/Remove/Insert nodes

## Installation

``` bash
# npm
npm install ui-tree --save
# or yarn
yarn add ui-tree
```

## Usage

``` javascript
const uiTree = require('ui-tree')

var data = { /* your data */ }
var options = { /* options */ }

var tree = uiTree.CreateTree(data, options)
```

## CreateTree data
A hierarchical object to be displayed as a tree.  The simplest form can be

``` javascript
var data = {
  label: 'root',
  children: [
    { label: 'child1', children: [] },
    { label: 'child2', children: [] }
  ]
}
```

where each level has a `label` field, and a `children` field

## CreateTree options

### options.lazy: Boolean
determines whether or not children nodes are automatically loaded

### options.columns: Object[]
Compute custom columns from any node information.  An array of `Object`, consisting of a `label` property, and a `Value(node)` function that performs calculation.

Columns are computed and returned by a `treeNode.ReadColumns()` method.

``` javascript
// default columns
var defaultColumns = [
  { label: 'label', Value (node) { return node.data.label } }
]

// ex. user columns
var columns = [
  { label: 'Level', Value (node) { return node.level } },
  { label: 'Title', Value (node) { return node.data.title } }
]
```

### options.Load(node, resolve): Function
All children, even if not using "lazy-loading" (`options.lazy = true`), are loaded through the same function.  The `options.Load()` function can be passed in to override the default.  The function is called from a tree-node, and passed in a `resolve` callback.  The `resolve` callback accepts an array of data objects for the children that will be used to build new tree-nodes.

parameters:
- `node`: Reference to `treeNode` Object which is to be appended with children
- `resolve`: Callback function that accepts an array of Objects to wrapped up into new `treeNode` children

> NOTE: the `resolve` function must be called.  If there are no children to add, then and empty array should be passed in (`resolve([])`)

The default `options.Load` function allows simple data to be processed

``` javascript
// default Load
Load: function (node, resolve) {
  if (node.data.children) {
    resolve(node.data.children)
  } else {
    resolve([])
  }
}
```

More complex data can be loaded.  The `options.Load` function is compatible with asynchronous or Promise functions.

``` javascript
// Load via some service
Load: function (node, resolve) {
  if (node.data.id) {
    Database.SomeAjaxCallForChildren(node.data.id)
      .then((children) => {
        resolve(children)
      })
  } else {
    resolve([])
  }
}
```
