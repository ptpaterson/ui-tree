'use strict'

const expect = require('chai').expect
const assert = require('assert')

// ****************************************************************************
// ****************************************************************************
// test data
// ****************************************************************************
// ****************************************************************************

var data1 = {
  label: 'root',
  children: [
    { label: 'child1', children: [] },
    { label: 'child2', }  // Load must work regardless of presence of children property
  ]
}  

var expectedTreeData1 = {
  data: data1,
  root: {
    data: data1,
    children: [
      {
        data: data1.children[0],
        children: [],
        level: 1,
        selected: false,
        indeterminate: false,
        expanded: false,
        visible: true,
        loaded: true,
        loading: false,
        ReadColumns: [{ label: 'Label', Value: 'child1' }]
      },
      {
        data: data1.children[1],
        children: [],
        level: 1,
        selected: false,
        indeterminate: false,
        expanded: false,
        visible: true,
        loaded: true,
        loading: false,
        ReadColumns: [{ label: 'Label', Value: 'child2' }]
      }
    ],

    level: 0,
    selected: false,
    indeterminate: false,
    expanded: false,
    visible: true,
    loaded: true,
    loading: false,
    ReadColumns:  [{ label: 'Label', Value: 'root' }]
  },
  lazy: false,
  currentNode: null,
  columns: [{ label: 'Label', Value (node) { return data.label } }],
  Load: function (node, resolve) {
    if (node.data.children) {
      resolve(node.data.children)
    }
  }
}

var expectedTreeData2 = {
  data: data1,
  root: {
    data: data1,
    children: [],
    level: 0,
    selected: false,
    indeterminate: false,
    expanded: false,
    visible: true,
    loaded: false,
    loading: false,
  ReadColumns:  [{ label: 'Label', Value: 'root' }]
  },
  lazy: true,
  currentNode: null,
  columns: [{ label: 'Label', Value (node) { return data.label } }],
  Load: function (node, resolve) {
    if (node.data.children) {
      resolve(node.data.children)
    }
  }
}

var simpleCustomLoader = function (node, resolve) {
  if (node.level === 0) {
    if (node.data.children) {
      resolve(node.data.children)
    } else {
      resolve([])
    }
  }
  else if (node.level === 1) {
    resolve([{ label: 'generated' }])
  }
  else {
    resolve([])
  }
}

var expectedTreeData3 = {
  data: data1,
  root: {
    data: data1,
    children: [
      {
        data: data1.children[0],
        children: [
          {
            data: { label: 'generated' },
            children: [],
            level: 2,
            selected: false,
            indeterminate: false,
            expanded: false,
            visible: true,
            loaded: true,
            loading: false,
            ReadColumns: [{ label: 'Label', Value: 'generated' }]
          }
        ],
        level: 1,
        selected: false,
        indeterminate: false,
        expanded: false,
        visible: true,
        loaded: true,
        loading: false,
        ReadColumns: [{ label: 'Label', Value: 'child1' }]
      },
      {
        data: data1.children[1],
        children: [
          {
            data: { label: 'generated' },
            children: [],
            level: 2,
            selected: false,
            indeterminate: false,
            expanded: false,
            visible: true,
            loaded: true,
            loading: false,
            ReadColumns: [{ label: 'Label', Value: 'generated' }]
          }
        ],
        level: 1,
        selected: false,
        indeterminate: false,
        expanded: false,
        visible: true,
        loaded: true,
        loading: false,
        ReadColumns: [{ label: 'Label', Value: 'child2' }]
      }
    ],

    level: 0,
    selected: false,
    indeterminate: false,
    expanded: false,
    visible: true,
    loaded: true,
    loading: false,
    ReadColumns:  [{ label: 'Label', Value: 'root' }]
  },
  lazy: false,
  currentNode: null,
  columns: [{ label: 'Label', Value (node) { return data.label } }],
  Load: function (node, resolve) {
    if (node.data.children) {
      resolve(node.data.children)
    }
  }
}

var optionsTests = [
  { name: 'simple data w/ default options', data: data1, options: {}, expectedTree: expectedTreeData1 },
  { name: 'simple data w/ lazy = true', data: data1, options: { lazy: true }, expectedTree: expectedTreeData2 },
  { name: 'simple data w/ custom Load', data: data1, options: { Load: simpleCustomLoader }, expectedTree: expectedTreeData3 }
]


// ****************************************************************************
// ****************************************************************************
// index.js
// ****************************************************************************
// ****************************************************************************

const UiTree = require('../index.js')

describe('UiTree', function () {

  describe('#CreateTree(data, options)', function () {
    it('should be a function', function () {
      expect(UiTree.CreateTree).to.be.a('function')
    }) 
  })

  describe('#CreateTreeNode(data, tree, options)', function () {
    it('should be a function', function () {
      expect(UiTree.CreateTreeNode).to.be.a('function')
    }) 
  })

})

// ****************************************************************************
// ****************************************************************************
// lib/tree.js
// ****************************************************************************
// ****************************************************************************

const CreateTree = require('../lib/tree.js')

describe('CreateTree', function () {

  it('should export a function', function () {
    expect(CreateTree).to.be.a('function')
  })  

  it('requires data', function () {
    expect(() => CreateTree()).to.throw()
  })

  optionsTests.forEach( test => {
    describe('w/ parameters (' + test.name + ')', function () {
      it('should return a tree Object', function () {
        var tree = CreateTree(test.data, test.options)
        expect(tree.data).to.equal(test.data)
        expect(tree.lazy).to.equal(test.expectedTree.lazy)
        expect(tree.currentNode).to.equal(test.expectedTree.currentNode)
        expect(tree.Load).to.be.a('function')
      })

      it('should return tree with root node and children based on data', function () {
        var tree = CreateTree(test.data, test.options)
        
        function testTreeNode(node, expected) {
          expect(JSON.stringify(node.data)).to.equal(JSON.stringify(expected.data))
          expect(node.level).to.equal(expected.level)
          expect(node.selected).to.equal(expected.selected)
          expect(node.indeterminate).to.equal(expected.indeterminate)
          expect(node.expanded).to.equal(expected.expanded)
          expect(node.visible).to.equal(expected.visible)
          expect(node.loaded).to.equal(expected.loaded)
          expect(node.loading).to.equal(expected.loading)
          expect(JSON.stringify(node.ReadColumns())).to.equal(JSON.stringify(expected.ReadColumns))

          for (var index in node.children) {
            testTreeNode(node.children[index], expected.children[index])
          }
        }
        
        testTreeNode(tree.root, test.expectedTree.root)
      })
    })
  })

  describe('tree.Load', function () {
    it('should be a function', function () {
      var tree = CreateTree(data1)
      expect(tree.Load).to.be.a('function')
    })

    it('should return a promise', function () {
      expect(tree.Load(tree.root).then).to.be.a('function')
      expect(tree.Load(tree.root).catch).to.be.a('function')
    })
  })

  describe('tree.SetCurrentNode', function () {
    it('should be a function', function () {
      var tree = CreateTree(data1)
      expect(tree.SetCurrentNode).to.be.a('function')
    })

    it('should set node.isCurrent to true and update tree reference', function () {
      var tree = CreateTree(data1)
      expect(tree.root.isCurrent).to.equal(false)
      tree.SetCurrentNode(tree.root)
      expect(tree.root.isCurrent).to.equal(true)
      // reset current node before changing to new one
      tree.SetCurrentNode(tree.root.children[0])
      expect(tree.root.isCurrent).to.equal(false)
      expect(tree.root.children[0].isCurrent).to.equal(true)
    })
  })

  describe('tree.GetSelected', function () {
    it.skip('should be a function', function () {
      //var tree = CreateTree(data1)
      //expect(tree.GetSelected).to.be.a('function')
    })

    it.skip('should return a tree "view"', function () {
    })
  })
})


const CreateTreeNode = require('../lib/tree-node.js')

describe('CreateTreeNode', function () {

  it('should export a function', function () {
    expect(CreateTreeNode).to.be.a('function')
  })  

  it('requires data and tree', function () {
    var tree = CreateTree(data1)
    expect(() => CreateTreeNode()).to.throw()
    expect(() => CreateTreeNode(data1)).to.throw()
    expect(() => CreateTreeNode(data1, tree)).to.not.throw()
  })

  describe('treeNode.LoadChildren', function () {

    it('should be a function', function() {
      var tree = CreateTree(data1, {lazy: true})
      expect(tree.root.LoadChildren).to.be.a('function')
    })

    it('should check if already loaded', function() {
      var tree = CreateTree(data1, {lazy: true})
      assert(false)
    })

    it('should set .loading for tree.lazy and !treeNode.loaded', function() {
      var tree = CreateTree(data1, {lazy: true})
      tree.root.LoadChildren()
      expect(tree.root.loading).to.be(true)// failing because simple data calls resolve synchronously.  will need an async load to test.
    })
  })

})
