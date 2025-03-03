class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const sortedAndUniqueArray = [...new Set(array)].sort((a, b) => a - b);
    console.log(sortedAndUniqueArray);
    this.root = buildTree(sortedAndUniqueArray, 0, sortedAndUniqueArray.length - 1);
  }

  insert(data) {
    const node = this.root;

    if (node === null) {
      // if root is empty, initialize this node as root node
      this.root = new Node(data);
      return;
    } else {
      // if not, recursively go through tree and place node
      const insertRec = function (node) {
        if (data < node.data) {
          if (node.left === null) {
            node.left = new Node(data);
            return;
          } else if (node.left !== null) {
            return insertRec(node.left);
          }
        } else if (data > node.data) {
          if (node.right === null) {
            node.right = new Node(data);
            return;
          } else if (node.right !== null) {
            return insertRec(node.right);
          }
        } else {
          // exit the function if the data already exists
          return;
        }
      };
      return insertRec(node);
    }
  }

  delete(data) {
    let node = this.root;
    let prevNode = null;
    // while loop runs through nodes until it goes null or finds the node we're looking for
    while (node) {
      if (data < node.data) {
        prevNode = node;
        node = node.left;
      } else if (data > node.data) {
        prevNode = node;
        node = node.right;
      } else {
        // exit the loop once our node has been found
        break;
      }
    }

    if (node === null) {
      // Node not found, return or handle accordingly
      console.log("Node not found.");
      return;
    }

    // deal with deletion of the nodes

    // CASE 1 - leaf node, just delete the references like a linked list item
    if (node.left === null && node.right === null) {
      if (prevNode === null) {
        this.root = null; // Deleting root node when it's a leaf
      } else if (prevNode.left === node) {
        prevNode.left = null;
      } else {
        prevNode.right = null;
      }
      return;
    }
    // CASE 2 - One-child node deletion (ensure it only runs for one child)
    if (
      (node.left === null && node.right !== null) ||
      (node.left !== null && node.right === null)
    ) {
      let child = node.left !== null ? node.left : node.right; // Get the existing child

      if (prevNode === null) {
        this.root = child; // If deleting the root node
      } else if (prevNode.left === node) {
        prevNode.left = child;
      } else {
        prevNode.right = child;
      }
      return;
    }

    // CASE 3 - two children, find the inorder successor and then swap it into the deletion node's place

    if (node.left !== null && node.right !== null) {
      // Step 1: Find the inorder successor (smallest node in the right subtree)
      let successorParent = node; // Keep track of parent
      let successor = node.right;

      while (successor.left !== null) {
        successorParent = successor; // Track the parent of successor
        successor = successor.left;
      }

      // Step 2: Remove successor from its original location
      if (successorParent !== node) {
        successorParent.left = successor.right; // Remove the inorder successor from its old position
      } else {
        successorParent.right = successor.right; // If successor is direct child of node
      }

      // Step 3: Replace the deleted node with the successor
      successor.left = node.left;
      successor.right = node.right;

      if (prevNode === null) {
        this.root = successor; // If deleting the root node
      } else if (prevNode.left === node) {
        prevNode.left = successor;
      } else {
        prevNode.right = successor;
      }
    }
  }

  find(data) {
    let node = this.root;
    while (node !== null) {
      if (data < node.data) {
        node = node.left;
      } else if (data > node.data) {
        node = node.right;
      } else {
        return node;
      }
    }
    return null;
  }

  levelOrder(callback) {
    let queue = [];
    let node = this.root;

    if (typeof callback !== "function") {
      throw new Error("Need a callback fn");
    }

    if (node === null) {
      return;
    }

    queue.push(node);

    while (queue.length > 0) {
      node = queue[0];

      if (node.left !== null) {
        queue.push(node.left);
      }

      if (node.right !== null) {
        queue.push(node.right);
      }
      queue.splice(0, 1);
      callback(node);
    }
  }

  // root -> left -> right
  preOrder(callback) {
    let node = this.root;

    if (typeof callback !== "function") {
      throw new Error("Need a callback fn");
    }

    if (node === null) {
      return;
    } else {
      const preOrderRecursion = function (node) {
        if (node === null) return;
        callback(node);
        preOrderRecursion(node.left);
        preOrderRecursion(node.right);
      };
      return preOrderRecursion(node);
    }
  }

  // left -> root -> right // ALWAYS gives a sorted result!
  inOrder(callback) {
    let node = this.root;

    if (typeof callback !== "function") {
      throw new Error("Need a callback fn");
    }

    if (node === null) {
      return;
    } else {
      const inOrderRecursion = function (node) {
        if (node === null) return;
        inOrderRecursion(node.left);
        callback(node);
        inOrderRecursion(node.right);
      };

      return inOrderRecursion(node);
    }
  }

  // left -> right -> root
  postOrder(callback) {
    let node = this.root;

    if (typeof callback !== "function") {
      throw new Error("Need a callback fn");
    }

    if (node === null) {
      return;
    } else {
      const postOrderRecursion = function (node) {
        if (node === null) return;
        postOrderRecursion(node.left);
        postOrderRecursion(node.right);
        callback(node);
      };

      return postOrderRecursion(node);
    }
  }

  // from a node to longest leaf
  height(node) {
    if (node === null) {
      return -1;
    }

    let height = -1;
    let queue = [];

    // the node that is picked acts as root
    queue.push(node);

    while (queue.length !== 0) {
      let heightLevel = queue.length;

      for (let i = 0; i < heightLevel; i++) {
        node = queue[0];

        if (node.left !== null) {
          queue.push(node.left);
        }

        if (node.right !== null) {
          queue.push(node.right);
        }
        queue.splice(0, 1);
      }

      height++;
    }
    return height;
  }

  //from root to node
  depth(node) {
    let root = this.root;
    let depth = 0;

    // If tree is empty or node is null
    if (!root || !node) return -1;

    while (root) {
        if (node.data < root.data) {
            root = root.left;
            depth++;
        } else if (node.data > root.data) {
            root = root.right;
            depth++;
        } else {
            return depth; // Node found, return depth
        }
    }

    return -1; // Node not found in the tree
  }

  // check balancing by getting height of each root's children node
  isBalanced() {
    let node = this.root;
    let queue = [];

    if (!node) return true;

    queue.push(node);

    while(queue.length !== 0) {
      let heightLevel = queue.length;

      for (let i = 0; i < heightLevel; i++) {
        node = queue[0]

        let leftHeight = this.height(node.left);
        let rightHeight = this.height(node.right);

        // if height val of left child - right child is bigger than 1, the tree is unbalanced
        if (Math.abs(leftHeight - rightHeight) > 1) return false;

        // enqueue the children, if any
        if (node.left !== null) {
          queue.push(node.left);
        }

        if (node.right !== null) {
          queue.push(node.right);
        }

        queue.splice(0, 1)
      }
    }

    return true;
  }

  // grab values of every node, put them into an array and call buildTree func
  rebalance() {
    let array = [];
    this.inOrder(node => array.push(node.data))
    console.table(array)
    // make sure data is unique (data is already sorted from inorder)
    let uniqueArray = [...new Set(array)];
    this.root = buildTree(uniqueArray, 0, uniqueArray.length - 1);
  }
}

function printDataCallback(node) {
  if (node !== null) {
    console.log(node.data);
  } else {
    return;
  }
}

function buildTree(array, start, end) {
  if (start > end) return null;

  const mid = Math.floor((start + end) / 2);
  const node = new Node(array[mid]);

  node.left = buildTree(array, start, mid - 1);
  node.right = buildTree(array, mid + 1, end);

  return node;
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const tree = new Tree([50, 20, 30, 40, 32, 34, 36, 70, 60, 65, 80, 75, 85]);

prettyPrint(tree.root);
tree.inOrder(printDataCallback)
console.log(tree.isBalanced())
tree.rebalance()
tree.insert(90);
tree.insert(95);
tree.insert(100);
console.log(tree.isBalanced())
tree.rebalance()
console.log(tree.isBalanced())
prettyPrint(tree.root);