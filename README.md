# ui-tree [![npm](https://img.shields.io/npm/v/ui-tree.svg)](https://www.npmjs.com/package/ui-tree)


> A UI Tree data structure for any front end, or none at all!

## Introduction

I was looking for a way to manage varying sets of hierarchical data with the same library.  At the same time, I was unable to commit to a front-end, so I needed to keep the data structure library independent.

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

### lazy: Boolean
determines whether or not children nodes are automatically loaded

### columns: Object[]
Custom computed columns from any node information.  An array of Object, consisting of a `label` property, and a `Value(node)` function that performs calculation.

Columns are computed and returned by a `treeNode.ReadColumns()` method.

``` javascript
// default columns
var defaultColumns = [
  { label: 'label', Value (node) { return node.data.label } }
]

// ex. user columns
var columns = [
  { label: 'Level', Value (node) { return node.level } }
  { label: 'Title', Value (node) { return node.data.title } }
]
```

### Load: Function
All children, even if not using lazy-loading, are loaded with through the same function, which can be overridden.  It is called from a tree-node, and passed in a resolve callback.  The resolve callback accepts an array of data objects for the children that will be used to build new tree-nodes.

The default `Load` function allows simple data to be processed

``` javascript
// default Load
Load: function (node, resolve) {
  if (node.data.children) {
    resolve(node.data.children)
  }
}
```
