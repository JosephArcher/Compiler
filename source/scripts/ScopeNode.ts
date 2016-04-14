///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="Tree.ts"/>
///<reference path="Variable.ts"/>

module JOEC {

	export class ScopeNode {

		public scopeLevel: number = 0;
		public scopeStuff = {};
		public parent: JOEC.ScopeNode = null;
		public children = [];
		public visted: boolean = false;
		public visted1: boolean = false;
		public addChildNode(node: JOEC.ScopeNode) {
			this.children.push(node);
		}
		public addNewVariable(variableName: string , variableType) {
			console.log("adding new variable");
			this.scopeStuff[variableName] = new JOEC.Variable(variableName , variableType);
		}
		public lookupVariable(variableName: string){

			if(this.scopeStuff[variableName]){
				var joe = this.scopeStuff[variableName];
				return joe;
			}
			else{
				return null;
			}
		}
		public getNextUnvistedChildNode() {

			var nextNode: JOEC.ScopeNode = null;

			// Iterate over the list of child nodes to find the next no visted node
			for (var i = 0; i < this.children.length; i++) {

				// Get the next node
				nextNode = this.children[i];

				// Check to see if the next node has been visited
				if (!nextNode.visted) { // If the node has not been visted

					nextNode.visted = true;
					// Return it for use
					return nextNode;
				}
			}
			// If the list ends and no useable children exist then return null
			return null;
		}
		public getNextUnvistedChildNode1() {

			var nextNode: JOEC.ScopeNode = null;

			// Iterate over the list of child nodes to find the next no visted node
			for (var i = 0; i < this.children.length; i++) {

				// Get the next node
				nextNode = this.children[i];

				// Check to see if the next node has been visited
				if (!nextNode.visted1) { // If the node has not been visted

					nextNode.visted1 = true;
					// Return it for use
					return nextNode;
				}
			}
			// If the list ends and no useable children exist then return null
			return null;
		}
	}
}