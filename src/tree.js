import { CreateTreeNode } from './tree-node.js'

export function CreateTree (data, options = {}) {
  if (!data) {
    throw new Error('CreateTree error: data is required.');
  }

  // set default tree

  // default behavior for the tree is to assume that the data structure is:
  // data = {
  //   label: 'root',
  //   children: [
  //     { label: 'child 1', children: []},
  //     { label: 'child 2', children: []},
  //   ]
  // }
  //
  // tree.load can be overriden to allow for more complex hierarchical data
  let tree = {
    data: data,
    root: null,
    lazy: false,
    columns: [{ label: 'Label', Value (node) { return data.label } }],
    Load: function (node, resolve) {
      if (node.data.children) {
        resolve(node.data.children)
      }
    }
  }

  // update with user input
  // NOTE bad config could really break something, so maybe we should pick out
  // only specific properties from the options argument
  Object.assign(tree, options)

  // Create new node directly from initial dataset
  tree.root = CreateTreeNode(data, tree)

  return tree;
}
