'use strict'

const expect = require('chai').expect
const assert = require('assert')

const UiTree = require('../index.js')

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
// Tests
// ****************************************************************************
// ****************************************************************************

describe('UiTree module', () => {

  describe('.CreateTree(data, options)', () => {

    it('should export a function', () => {
      expect(UiTree.CreateTree).to.be.a('function')
    })  

    optionsTests.forEach( test => {
      describe('w/ parameters (' + test.name + ')', () => {
        it('should return a tree Object', () => {
          var tree = UiTree.CreateTree(test.data, test.options)
          expect(tree.data).to.equal(test.data)
          expect(tree.lazy).to.equal(test.expectedTree.lazy)
          expect(tree.currentNode).to.equal(test.expectedTree.currentNode)
          expect(tree.Load).to.be.a('function')
        })

        it('should return tree with root node and children based on data', () => {
          var tree = UiTree.CreateTree(test.data, test.options)
          
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

    describe('tree.Load', () => {
      var tree = UiTree.CreateTree(data1)
      it('should be a function', () => {
        expect(tree.Load).to.be.a('function')
      })

      it('should return a promise', () => {
        expect(tree.Load(tree.root).then).to.be.a('function')
        expect(tree.Load(tree.root).catch).to.be.a('function')
      })
    })

    describe('tree.GetSelected', () => {
      it.skip('should be a function', () => {
        //expect(tree.GetSelected).to.be.a('function')
      })

      it.skip('should return a tree "view"', () => {
      })
    })
  })
})
