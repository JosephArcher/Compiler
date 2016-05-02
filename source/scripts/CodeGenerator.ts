///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="d3.d.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="TypeChecker.ts" />
/// <reference path="StaticTableEntry.ts" />
module JOEC {
   /*
	* Code Generator
	*/
	export class CodeGenerator {

		public programCode = [];
		public programCounter = 0;
		public heapPointer = 255;
		public hasErrors: boolean = false;
		public staticTable = {};
		public jumpTable = {};

		public constructor() {

			// Create a new static table 

			// Create a new jump table

			// Initalize the program code arrray
			for (var i = 0; i < 256; i++){
				this.programCode[i] = "00";
			}

		}
		public writeDataIntoHeap(data: string){

			for (var i = 0; i < data.length; i++) {
				this.programCode[this.heapPointer] = data.charAt(i);
				this.heapPointer--;
			}

		}
		public newStaticVariable(name){

			// Get length of the table and increment by 1
			var staticVariableNumber = Object.keys(this.staticTable).length;

			console.log("adding new static variable " + name);

			this.staticTable[staticVariableNumber] = new JOEC.StaticTableEntry();

			return staticVariableNumber;
		}
		public newJumpVariable(name, type, value){



		}

		public addNextOpCode(opCode: string){
			// Add the new opcode to the next available address in memory
			this.programCode[this.programCounter] = opCode;

			// Increment the next available address
			this.programCounter++;
		}
		 /*
		  * Used to convert a given AST into 6502A opcodes
		  * @params Tree - The AST to be converted into code
		  * @returns Array - An array of 6502a op codes
		  */
		 public generateCode(AST: JOEC.Tree) {

		 	this.evaluateBlock(AST.rootNode);
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
		public generatePrintCode(data) {

			// AC
			this.addNextOpCode("AC");

			// T0
			this.addNextOpCode("T0");

			// XX
			this.addNextOpCode("XX");

			// A2
			this.addNextOpCode("A2");

			// Depening on the type place either a 0 or 1 in this spot
			this.addNextOpCode("00");

			// FF
			this.addNextOpCode("FF");
		}
		public intDeclaration(name) {

			// A9
			this.addNextOpCode("A9");

			// 00
			this.addNextOpCode("00");

			// 8D
			this.addNextOpCode("8D");

			// Create a new variable for the static table
			var staticVariableNumber = this.newStaticVariable(name) + "";

			// Temp Variable Number
			this.addNextOpCode("T" + staticVariableNumber);

			// XX
			this.addNextOpCode("XX");

		}
		public booleanDeclaration() {

			// A9
			this.addNextOpCode("A9");

			// 00
			this.addNextOpCode("00");

			// 8D
			this.addNextOpCode("8D");

			// Create a new variable for the static table
			var staticVariableNumber = Object.keys(this.staticTable).length;

			// Temp Variable Number
			this.addNextOpCode("T0");

			// XX
			this.addNextOpCode("XX");



		}
		public stringDeclaration(name) {

			// Create a new variable for the static table
			var staticVariableNumber = this.newStaticVariable(name) + "";

		}
		public intAssignment(value){

			// A9
			this.addNextOpCode("A9");

			// Value
			this.addNextOpCode("0" + value);

			// 8D
			this.addNextOpCode("8D");

			// T0
			this.addNextOpCode("T0");

			// XX
			this.addNextOpCode("XX");

		}
		public booleanAssignment(){

		}
		public stringAssignment(){

		}
		/*
		* Statement
		*/
		public evaluateStatement(node: JOEC.TreeNode) {

			// Variable Declaration
			if (node.name == "Variable Declaration") {
				console.log("Variable Declaration was found");
				// Get the type
				var type = node.children[0].name;

				// Get the name
				var name = node.children[1].name;

				// Call the appropriate function to generate the code for that section
				if(type == "int"){
					this.intDeclaration(name);
				}
				else if(type == "string"){
					this.stringDeclaration(name);
				}
				else if(type == "boolean"){
					this.booleanDeclaration();
				}
			}
			// Block
			else if (node.name == "Block") {
				this.evaluateBlock(node);
			}
			// Assignment
			else if (node.name == "Assign") {
				console.log("Assignment Statement was found");
				// Evaluate the Right Hand Side of the statement
				var rightSide = this.evaluateExpression(node.children[1]);
				console.log(rightSide);
				if(rightSide.type == "Digit"){
					this.intAssignment(rightSide.name);
				}
				else if(rightSide.type == "String"){
					this.stringAssignment();
				}
				else if(rightSide.type == "BoolVal"){
					this.booleanAssignment();
				}
				else{
					console.log("This should never happen");
				}
			}
			// Print
			else if (node.name == "Print") {
				var evaluation = this.evaluateExpression(node.children[0]);
				this.generatePrintCode(evaluation);
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
				return this.evaluateExpression(node.children[1]);
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