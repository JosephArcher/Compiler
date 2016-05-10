///<reference path="ScopeNode.ts"/>

module JOEC {

	export class SymbolTable {

		/*
		* Symbol Table
		*/
		public currentScope: JOEC.ScopeNode = null;
		public rootScope: JOEC.ScopeNode = null;
		public scopeCounter = 0;

		public constructor () {}

		public addNewScope() { 
			
			// Make a new scope node
			var node: JOEC.ScopeNode = new JOEC.ScopeNode(this.scopeCounter);

			// Increment the counter
			this.scopeCounter++;

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
		public nextChildScope() {
			if(this.currentScope == null){
				this.currentScope = this.rootScope;
			}
			else{
				var nextPossibleNode = this.currentScope.getNextUnvistedChildNode();
				if (nextPossibleNode != null) {
					this.currentScope = nextPossibleNode;
				}
			}
		}
		public nextChildScope2() {

			if (this.currentScope == null) {
				this.currentScope = this.rootScope;
			}
			else {
				var nextPossibleNode = this.currentScope.getNextUnvistedChildNode2();
				if (nextPossibleNode != null) {
					this.currentScope = nextPossibleNode;
				}
			}
		}
		public endScope() {
			//console.log("Ending Scope");
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
			//console.log("Declare " + variableName  + "   with a type of " + variableType);
			this.currentScope.addNewVariable(variableName, variableType);
		}
		public assignVariable(variableName:string, variableValue: string) {

			if(this.lookupVariable(variableName) != null){
				var test = this.lookupVariable(variableName);
				test.value = variableValue;
			}
		}
		public lookupVariable(variableName: string) {

			// save the curretn scope
			var testing = this.currentScope;

			// Check the current scope
			if(this.currentScope.lookupVariable(variableName) != null){
				this.currentScope = testing;
				return this.currentScope.lookupVariable(variableName);
			}
			else {
					// Check to see if the
					while (this.currentScope.parent != null) {

						this.currentScope = this.currentScope.parent;
						// Check the current scope
						if (this.currentScope.lookupVariable(variableName) != null) {
							// Save the output 
							var answer = this.currentScope.lookupVariable(variableName);
							// reset the scope
							this.currentScope = testing;
							return answer;
						}
					}
					this.currentScope = testing;
					return null;
				}
		}
		public lookupVariableScopeNumber(variableName: string) {

			// save the curretn scope
			var testing = this.currentScope;

			// Check the current scope
			if (this.currentScope.lookupVariable(variableName) != null) {
				this.currentScope = testing;
				return this.currentScope.lookupScopeId(variableName);
			}
			else {
				// Check to see if the
				while (this.currentScope.parent != null) {

					this.currentScope = this.currentScope.parent;
					// Check the current scope
					if (this.currentScope.lookupVariable(variableName) != null) {
						// Save the output 
						var answer = this.currentScope.lookupScopeId(variableName);
						// reset the scope
						this.currentScope = testing;
						return answer;
					}
				}
				this.currentScope = testing;
				return null;
			}
		}
	}
}