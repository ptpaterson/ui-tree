'use strict'

const expect = require('chai').expect
const assert = require('assert')

const CreateTree = require('../lib/tree')

describe('Tree module', () => {
  it('should export a function', () => {
    expect(CreateTree).to.be.a('function')
  })

  describe('w/ default options', () => {
    var data = {
      label: 'root',
      children: [
        { label: 'child1', children: [] },
        { label: 'child2', children: [] }
      ]
    }

    var tree = CreateTree(data)

    it('should create a simple tree with default options', () => {
      expect(tree).to.not.equal(undefined)
    })

    it('should create a node and attach to tree.root', () => {
      expect(tree.root).to.not.equal(undefined)
      expect(tree.root.data.label).to.equal('root')
    })

    it('children should be loaded automatically', () => {
      expect(tree.root.children.length).to.equal(2)
      expect(tree.root.children[0]).to.not.equal(undefined)
      expect(tree.root.children[0].data.label).to.equal('child1')
      expect(tree.root.children[1]).to.not.equal(undefined)
      expect(tree.root.children[1].data.label).to.equal('child2')
    })
  })

  describe('tree.lazy = true', () => {
    it('children should be loaded manually', () => {
      var data = {
        label: 'root',
        children: [
          { label: 'child1', children: [] },
          { label: 'child2', children: [] }
        ]
      }

      var tree = CreateTree(data, { lazy: true })
      expect(tree.root.children.length).to.equal(0)

      tree.root.LoadChildren()

      expect(tree.root.children.length).to.equal(2)
      expect(tree.root.children[0]).to.not.equal(undefined)
      expect(tree.root.children[0].data.label).to.equal('child1')
      expect(tree.root.children[1]).to.not.equal(undefined)
      expect(tree.root.children[1].data.label).to.equal('child2')
    })
  })

  describe('tree.Load = UserFunction', () => {
    it.skip('children loaded using the user function', () => {
      assert(false)
    })
  })
})
