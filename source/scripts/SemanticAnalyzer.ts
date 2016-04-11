///<reference path="Tree.ts"/>
///<reference path="SymbolTable.ts"/>

module JOEC {

	export class SemanticAnalyzer {

		public hasErrors: boolean = false;
		public CST: JOEC.Tree;                // Tree
		public SymbolTable: JOEC.SymbolTable; // Symbol Table

		public constructor() {
			this.SymbolTable = new SymbolTable();
		}

		public generateSymbolTable(CST: JOEC.Tree) {

			this.CST = CST;
			this.evaluateBlock(this.CST.rootNode.children[0]);
		}
		public checkForUnusedIndentifiers() {

			// Make a new stack to use while iterating over the tree
			var nodeStack = new JOEC.Stack();

			// Add the root node to the stack to start the iteration
			nodeStack.push(this.SymbolTable.rootScope);
			
			// Check the root node
			this.checkScope(this.SymbolTable.rootScope);

			// Mark the node as visited
			this.SymbolTable.rootScope.visted = true;

			// Loop till you iterate over every node in the tree
			while (!nodeStack.isEmpty()) {
				// Get the next node
				var nextNode: JOEC.ScopeNode = nodeStack.peek();
				var childNode: JOEC.ScopeNode = nextNode.getNextUnvistedChildNode();

				// Check to see if any children exist
				if (childNode != null) {

					// Mark the node as visted
					childNode.visted = true;
					this.checkScope(childNode);
					// Add the node to the stack
					nodeStack.push(childNode);
				}
				else {
					// Pop the node off the stack
					nodeStack.pop();
				}
			}
		}
		public checkScope(node: JOEC.ScopeNode) {
				
			var scope = node.scopeStuff;
			var len = Object.keys(scope).length;

			for (var i = 0; i < len; i++){

				var nextVariable = scope[Object.keys(scope)[i]];

				// Check each variable and if the value is null then report a warning to the user
				if(nextVariable.value == null){
					Utils.createNewWarningMessage("Warning: " + nextVariable.name + " is unused");
				}
				console.log(nextVariable);
			}
		}
		public getType(value: string){

			if (value == "IntegerExpression") {
				return "int";
			}
			else if (value == "StringExpression") {
				return "string";
			}
			else if (value == "BooleanStatement")
				return "boolean";
		}
		public evaluateBlock(node: JOEC.TreeNode) {

			// Add a new scope to the symbol table
			this.SymbolTable.addNewScope();

			// Get the list of statements that needs to be run before the block closes
			var StatmentList = node.children[1];
			this.evaluateStatementList(StatmentList);
			
			// End a scope
			this.SymbolTable.endScope();
		}
		public evaluateStatementList(node: JOEC.TreeNode) {

			// Check the number of children
			if (node.children.length == 2) {
				this.evaluateStatement(node.children[0]);
				this.evaluateStatementList(node.children[1]);
			}
		}
		public evaluateStatement(theNode: JOEC.TreeNode) {

			var node = theNode.children[0];

			// Variable Declaration
			if (node.name == "VarDecl") {
				
				// Declare a new variable
				this.SymbolTable.declareVariable(node.children[1].children[0].name, node.children[0].children[0].name);
			}
			// Block
			else if (node.name == "Block") {
				this.evaluateBlock(node);
			}
			// Print Statement
			else if (node.name == "PrintStatement") {
				this.evaluateExpression(node.children[2]);
			}
			// Assignment Statement
			else if (node.name == "AssignmentStatement") {

				// First lookup the variable to see if one is in scope
				var variable = this.SymbolTable.lookupVariable(node.children[0].children[0].name);

				// Check to see if the variable exists
				if(variable != null) {

					// Get the type
					var type = this.getType(node.children[2].children[0].name);
					
					// Check to see if the types match
					if(variable.type == type){

						// Get the results of the evaluation
						var results = this.evaluateExpression(node.children[2]);

						// Assign the variable
						this.SymbolTable.assignVariable(node.children[0].children[0].name, results);
					}
					else {
						console.log(node.children[2].children[0].children[0]);
						// Type Mismatch
						Utils.createNewErrorMessage("ERROR: Type Mismatch");
						this.hasErrors = true;
					}
				}
				else {
					// Undeclared Identifier
					Utils.createNewErrorMessage("Error undeclared identifier");
					this.hasErrors = true;
				}
			}
			// If Statement
			else if (node.name == "IfStatement") {
				this.evaluateBooleanExpression(node.children[1]);
				this.evaluateBlock(node.children[2])
			}
			// While Statment
			else if (node.name == "WhileStatement") {
				this.evaluateBooleanExpression(node.children[1]);
				this.evaluateBlock(node.children[2])
			}
		}
		public evaluateExpression(node: JOEC.TreeNode) {

			var childNode: JOEC.TreeNode = node.children[0];

			// Integer Expression
			if (childNode.name == "IntegerExpression") {

				if (childNode.children.length == 1) {
					return childNode.children[0].children[0].name;
					// this.AST.addNode(childNode.children[0].children[0].name, "Leaf");
				}
				else if (childNode.children.length == 3) {
					// this.AST.addNode("+", "Branch");
					// this.AST.addNode(childNode.children[0].children[0].name, "Leaf");
					this.evaluateExpression(childNode.children[2]);
					// this.AST.endChildren();
				}
			}
			// String Expression
			else if (childNode.name == "StringExpression") {
				return childNode.children[0].name;
				// this.AST.addNode(childNode.children[0].name, "Leaf");
			}
			// Boolean Expression
			else if (childNode.name == "BooleanStatement") {
				this.evaluateBooleanExpression(childNode);
			}
			// Identifier Expression
			else if (childNode.name == "Identifier") {
				if (this.SymbolTable.lookupVariable(childNode.children[0].name) != null) {
					return childNode.children[0].name;
				}
				// this.AST.addNode(childNode.children[0].name, "Branch");
				// this.AST.endChildren();
			}
		}
		public evaluateBooleanExpression(node: JOEC.TreeNode) {

			if (node.children.length == 1) {

				return node.children[0].children[0].name;
				// this.AST.addNode(node.children[0].children[0].name, "Leaf");
			}
			else if (node.children.length == 5) {

				// Find the important nodes
				var firstExpression = node.children[1];
				var boolOp = node.children[2];
				var secondExpression = node.children[3];

				var boolOpName = boolOp.children[0].name + boolOp.children[1].name;

				// Construct the subtree
				// this.AST.addNode(boolOpName, "Branch");
				this.evaluateExpression(firstExpression);
				this.evaluateExpression(secondExpression);
				// this.AST.endChildren();
			}
		}
	}
}