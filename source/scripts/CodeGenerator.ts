module JOEC {
   /*
	* Code Generator
	*/
	export class CodeGenerator {

		public programCode = [];
		public hasErrors: boolean = false;

		public constructor() {}

		 /*
		  * Used to convert a given AST into 6502A opcodes
		  * @params Tree - The AST to be converted into code
		  * @returns Array - An array of 6502a op codes
		  */
		 public generateCode(AST: JOEC.Tree) {


		} 
		/*
		* Block
		*/
		public evaluateBlock(node: JOEC.TreeNode) {

			// Get the number of statements that the block has
			var len = node.children.length;

			// Evaluate them 1 by 1 in order
			for (var i = 0; i < len; i++) {
				this.evaluateStatement(node.children[i]);
			}
		}
		/*
		* Statement
		*/
		public evaluateStatement(node: JOEC.TreeNode) {

			// Variable Declaration
			if (node.name == "Variable Declaration") {

			}
			// Block
			else if (node.name == "Block") {
				this.evaluateBlock(node);
			}
			// Assignment
			else if (node.name == "Assign") {
				this.evaluateExpression(node.children[1]);
			}
			// Print
			else if (node.name == "Print") {
				this.evaluateExpression(node.children[0]);
			}
			// While
			else if (node.name == "While") {
				this.evaluateBooleanExpression(node.children[0]);
				this.evaluateBlock(node.children[1]);
			}
			// If
			else if (node.name == "If") {
				this.evaluateBooleanExpression(node.children[0]);
				this.evaluateBlock(node.children[1]);
			}
		}
	    /*
		 * Boolean Expression
		 */
		public evaluateBooleanExpression(node: JOEC.TreeNode) {

			if (node.name != "==" && node.name != "!=") {

				return node;
			}

			// Get both of the expression that need to be compared and evaluate them
			var expressionOne = this.evaluateExpression(node.children[0]);
			var expressionTwo = this.evaluateExpression(node.children[1]);

			return node;
		}
		/*
		 *  Expression
		 */
		public evaluateExpression(node: JOEC.TreeNode) {

			// Integer Expression
			if (node.name == "+") {
			}
			// Boolean Expression
			else if (node.name == "==" || node.name == "!=") {
				return this.evaluateBooleanExpression(node);
			}
			// String Expression
			else if (node.type == "String") {
				return node;
			}
			//Integer Expression
			else if (node.type == "Digit") {
				return node;
			}
			// Boolean Expression
			else if (node.type == "BoolVal") {
				return node;
			}
			// Identifier
			else if (node.type == "Identifier") {
				return node;
			}
		}
		/*
		 * Create new string variable
		 */
		 public createNewStringVariable(variableName: string){
		 	
		 }
	}	
}