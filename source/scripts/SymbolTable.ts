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
		public endScope() {
			// ... by moving "up" to our parent node (if possible).
			if ((this.currentScope.parent !== null) && (this.currentScope.parent.scopeLevel !== undefined)) {
				this.currentScope = this.currentScope.parent;
			}
			else {
				// TODO: Some sort of error logging.
				// This really should not happen, but it will, of course.
			}
		}
		public declareVariable(variableName: string , variableType: string){
			this.currentScope.addNewVariable(variableName, variableType);
		}
		public assignVariable(variableName:string, variableValue: string){

			if(this.lookupVariable(variableName) != null){
				var test = this.lookupVariable(variableName);
				test.value = variableValue;
			}
		}
		public lookupVariable(variableName: string) {

			// Check the current scope
			if(this.currentScope.lookupVariable(variableName) != null){
				return this.currentScope.lookupVariable(variableName);
			}
			else {
				// Check to see if the
				while (this.currentScope.parent != null) {
					this.currentScope = this.currentScope.parent;
					// Check the current scope
					if (this.currentScope.lookupVariable(variableName) != null) {
						return this.currentScope.lookupVariable(variableName);
					}
				}
			}
			return null;
		}
	}
}