function CreateTreeNode(data, tree, options = {}) {
  if (!data) {
    throw new Error('CreateTreeNode error: data is required.');
  }

  if (!tree) {
    throw new Error('CreateTreeNode error: tree is required.');
  }

  // set default node
  let node = {
    data: data,
    tree: tree,
    parent: null,
    children: [],
    level: 0,
    selected: false,
    indeterminate: false,
    expanded: false,
    visible: true,
    loaded: false,
    loading: false,
    LoadChildren: function () {
      if (this.tree.lazy === true && !this.loaded && !this.loading) {
        this.loading = true;
      }

      const resolve = (childrenData) => {
        this.loaded = true;
        this.loading = false;

        if (childrenData && childrenData.length > 0) {
          for (let childData of childrenData) {
            this.children.push(CreateTreeNode(childData, this.tree, { parent: this }));
          }
        }
      };
      this.tree.Load(this, resolve);
    },
    ReadColumns: function () {
      let readColumns = this.tree.columns.map((col) => {
        let result = Object.assign({}, col)
        result.Value = col.Value(this)
        return result
      })
      return readColumns
    }
  }

  // append user options
  Object.assign(node, options)

  // compute updated state
  if (node.parent) {
    node.level = node.parent.level + 1;
  }

  if (node.tree.lazy !== true) {
    node.LoadChildren()
  }

  return node
}

module.exports = CreateTreeNode
