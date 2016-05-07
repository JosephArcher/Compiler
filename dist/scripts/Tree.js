///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="TreeNode.ts"/>
var JOEC;
(function (JOEC) {
    var Tree = (function () {
        function Tree() {
            this.rootNode = null; // Root Node
            this.currentNode = null; // Current Node
        }
        // Add a node: kind in {branch, leaf}.
        Tree.prototype.addNode = function (name, kind, type, lineNumber) {
            var node = new JOEC.TreeNode(name, type, lineNumber);
            // Check to see if it needs to be the root node.
            if ((this.rootNode == null) || (!this.rootNode)) {
                // We are the root node.
                this.rootNode = node;
            }
            else {
                // We are the children.
                // Make our parent the CURrent node...
                node.parent = this.currentNode;
                // ... and add ourselves (via the unfrotunately-named
                // "push" function) to the children array of the current node.
                this.currentNode.children.push(node);
            }
            // If we are an interior/branch node, then...
            if (kind == "Branch") {
                // ... update the CURrent node pointer to ourselves.
                this.currentNode = node;
            }
        };
        Tree.prototype.endChildren = function () {
            // ... by moving "up" to our parent node (if possible).
            if ((this.currentNode.parent !== null) && (this.currentNode.parent.name !== undefined)) {
                this.currentNode = this.currentNode.parent;
            }
            else {
            }
        };
        Tree.prototype.toString = function () {
            // Initialize the result string.
            var traversalResult = "";
            // Recursive function to handle the expansion of the nodes.
            function expand(node, depth) {
                // Space out based on the current depth so
                // this looks at least a little tree-like.
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }
                // If there are no children (i.e., leaf nodes)...
                if (!node.children || node.children.length === 0) {
                    // ... note the leaf node.
                    traversalResult += "[" + node.name + "]";
                    traversalResult += "\n";
                }
                else {
                    // There are children, so note these interior/branch nodes and ...
                    traversalResult += "<" + node.name + "> \n";
                    // .. recursively expand them.
                    for (var i = 0; i < node.children.length; i++) {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            // Make the initial call to expand from the root.
            expand(this.rootNode, 0);
            // Return the result.
            return traversalResult;
        };
        return Tree;
    })();
    JOEC.Tree = Tree;
})(JOEC || (JOEC = {}));
