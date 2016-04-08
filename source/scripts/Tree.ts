///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="TreeNode.ts"/>

module JOEC {

	export class Tree {

		public rootNode: JOEC.TreeNode = null;     // Root Node
		public currentNode: JOEC.TreeNode = null;  // Current Node

		public constructor() {}

		// Add a node: kind in {branch, leaf}.
   		public addNode(name, kind) {

			var node = new JOEC.TreeNode(name);
        	
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
    	}
    	public endChildren() {
    		console.log("current" + this.currentNode.parent);
			// ... by moving "up" to our parent node (if possible).
			if ((this.currentNode.parent !== null) && (this.currentNode.parent.name !== undefined)) {
				this.currentNode = this.currentNode.parent;
			}
			else {
				// TODO: Some sort of error logging.
				// This really should not happen, but it will, of course.
			}
    	}
    	public toString() {
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
    }
  }
}