///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="Tree.ts"/>

module JOEC {

	export class TreeNode {

		public name = "";
		public value = ""; 
		public parent: TreeNode = null;
		public children = [];
		public visted: boolean = false;
		public lineNumber: number = 0;

		public constructor(theName , lineNumber?){
			this.name = theName;
			this.lineNumber = lineNumber;
		}
	

		public addChildNode(node:JOEC.TreeNode) {
			this.children.push(node);
		}
		public getNextUnvistedChildNode(){

			var nextNode: JOEC.TreeNode = null;

			// Iterate over the list of child nodes to find the next no visted node
			for (var i = 0; i < this.children.length; i++){

				// Get the next node
				nextNode = this.children[i];

				// Check to see if the next node has been visited
				if(!nextNode.visted) { // If the node has not been visted
					// Return it for use
					return nextNode;
				}

			}
			// If the list ends and no useable children exist then return null
			return null;
		}

	}
}