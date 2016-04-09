///<reference path="ScopeNode.ts"/>

module JOEC {

	export class SymbolTable {

		/*
		* Symbol Table
		*/
		public currentScope: JOEC.ScopeNode = null;
		public rootScope: JOEC.ScopeNode = null;

		public constructor () {}

		public addNewScope() { 
			
			// Make a new scope node
			var node = new JOEC.ScopeNode();

			// Check to see if it needs to be the root node.
			if ((this.rootScope == null) || (!this.rootScope)) {
				// We are the root node.
				this.rootScope = node;
			}
			else {
				// We are the children.
				// Make our parent the CURrent node...
				node.parent = this.currentScope;
				// ... and add ourselves (via the unfrotunately-named
				// "push" function) to the children array of the current node.
				this.currentScope.children.push(node);
			}

			// Update the current scope
			this.currentScope = node;
		}
		public addNewVariable(variableName: string){

			if(!this.currentScope == null){
				this.currentScope.addNewVariable(variableName);
			}

		}
		public assignVariable(variableValue: string){
			
		}
	}
}