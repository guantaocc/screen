class Node {
  constructor(val) {
    this.val = val
    this.left = null
    this.right = null
    this.rootNode = null
  }
}

function widthPucr(node) {
  if (node == null) {
    return
  }
  let levelMap = {}
  let curLevel = 1
  levelMap[node] = curLevel

  let stack = []
  stack.push(node)
  while (stack.length !== 0) {
    let cur = stack.shift()
    cur.rootNode = node
    let curNodeLevel = levelMap[cur]

    console.log(curNodeLevel, levelMap);

    if (curNodeLevel != curLevel) {
      curLevel++
    }
    
    if (cur.left !== null) {
      stack.push(cur.left)
      levelMap[cur.left] = curNodeLevel + 1
    }

    if (cur.right !== null) {
      stack.push(cur.right)
      levelMap[cur.right] = curNodeLevel + 1
    }
  }
}

node = new Node(1)
node.left = new Node(2)
node.right = new Node(3)
node.left.left = new Node(4)
node.left.right = new Node(5)
node.right.left = new Node(6)
node.right.right = new Node(7)

widthPucr(node)