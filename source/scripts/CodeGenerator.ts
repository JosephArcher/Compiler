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
		public newStaticVariable(name,type, scope){

			// Get length of the table and increment by 1
			var staticVariableNumber = Object.keys(this.staticTable).length;

			console.log("adding new static variable " + name);

			this.staticTable[staticVariableNumber] = new JOEC.StaticTableEntry(name, type, scope);

			return staticVariableNumber;
		}
		public writeStaticInt(address , value){

			this.programCounter++

			var output = this.decimalToHex(address);
			// Check to see if you need to stuff a zero in front cause of dumb shit
			if(output.length == 1){
				output = "0" + output;
			}
			return output;
		}
		public writeStaticBoolean(address, value){
			this.programCounter++

			var output = this.decimalToHex(address);
			// Check to see if you need to stuff a zero in front cause of dumb shit
			if (output.length == 1) {
				output = "0" + output;
			}
			return output;
		}
		/**
		* Used to convert a decimal string into a hex string
		   @Params {String} - A decimal string
		   @Returns {String} - A hex string
		*/
        public decimalToHex(input: string): string {

			var decimalNumber: number = parseInt(input, 10);

			var hexNumber = decimalNumber.toString(16);

			return hexNumber.toUpperCase();

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

		 	// Add a break to the end of the program
			this.addNextOpCode("00");

			// Start to write the static area
			this.calculateStaticArea();
		}
		public calculateStaticArea() {

			// Get the start of the static 
			var startingAddress = this.programCounter;

			// Get the length of the static table
			var len = Object.keys(this.staticTable).length;

			// The next row in the static table
			var nextRow;
			// Loop over the static table
			for (var i = 0; i < len; i++) {
				nextRow = this.staticTable[i];

				console.log("Next Row");
				console.log(nextRow);

				if(nextRow.type == "Int"){
					var replace = this.writeStaticInt(this.programCounter, nextRow.Var + nextRow.Var);
					var search = "T" + i;
					this.FindAndReplace(search, replace);
				}
				else if(nextRow.type == "BoolVal"){
					var replace = this.writeStaticBoolean(this.programCounter, nextRow.Var + nextRow.Var);
					var search = "T" + i;
					this.FindAndReplace(search, replace);
				}
			}
		}
		public FindAndReplace(search, replace){
			console.log("Finding" + search + "and replacing with " + replace);
			var nextLocation;
			for (var i = 0; i < this.programCode.length; i++){
				nextLocation = this.programCode[i];

				if(nextLocation == search){
					console.log("FOUND");
					this.programCode[i] = replace;
					this.programCode[i + 1] = "00";
				}
			}	
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
		public generateConstantIntPrintCode(value){
			
			// Load the y register withn a constant
			this.addNextOpCode("A0");

			// Constant value
			var constantValue = "0" + value;
			this.addNextOpCode(constantValue);

			// Load the x register with a constant
			this.addNextOpCode("A2");

			// load 1 cause we want to print a integer
			this.addNextOpCode("01");

			// Make a system call to output the results
			this.addNextOpCode("FF");
		}
		public generateConstantBooleanPrintCode(value){

			// Load the y register withn a constant
			this.addNextOpCode("A0");

			// Check to see if true or false
			if (value == "true") {
				this.addNextOpCode("01");
			}
			else if (value == "false"){
				this.addNextOpCode("00");
			}

			// Load the x register with a constant
			this.addNextOpCode("A2");

			// load 1 cause we want to print a integer
			this.addNextOpCode("01");

			// Make a system call to output the results
			this.addNextOpCode("FF");
		}
		public generateIdentifierPrintCode(data , type) {

			// Lookup the variable in the static table to get its position
			var variablePos = this.lookupStaticVariable(data);

			// AC
			this.addNextOpCode("AC");

			// T0
			this.addNextOpCode("T" + variablePos);

			// XX
			this.addNextOpCode("XX");

			// Decide what needs to be done based on the type
			if(type == "Digit" || type == "BoolVal"){
				this.addNextOpCode("01");
			}
			else if(type == "String"){
				this.addNextOpCode("02");
			}

			// A2
			this.addNextOpCode("A2");


			// FF
			this.addNextOpCode("FF");
		}
		public intDeclaration(name) {

			// Load the accumulator
			this.addNextOpCode("A9");

			// With 00
			this.addNextOpCode("00");

			// Store the accumulator in memory 
			this.addNextOpCode("8D");

			// Create a new variable for the static table
			var staticVariableNumber = this.newStaticVariable(name,"Int", "0") + "";

			// Store it at this temporary address
			this.addNextOpCode("T" + staticVariableNumber);
			this.addNextOpCode("XX");
		}
		public booleanDeclaration(name) {

			// Load the accumulator
			this.addNextOpCode("A9");

			// With 00
			this.addNextOpCode("00");

			// Store the accumulator in memory 
			this.addNextOpCode("8D");

			// Create a new variable for the static table
			var staticVariableNumber = this.newStaticVariable(name, "BoolVal", "0") + "";

			// Store it at this temporary address
			this.addNextOpCode("T" + staticVariableNumber);
			this.addNextOpCode("XX");

		}
		public stringDeclaration(name) {

			// Create a new variable for the static table
			var staticVariableNumber = this.newStaticVariable(name , "String" , "0") + "";

		}
		public intAssignment(value1, value2){

			var variablePos = this.lookupStaticVariable(value1);

			// A9
			this.addNextOpCode("A9");

			// Value
			this.addNextOpCode("0" + value2);

			// 8D
			this.addNextOpCode("8D");

			// T0
			this.addNextOpCode("T" + variablePos);

			// XX
			this.addNextOpCode("XX");

		}
		public lookupStaticVariable(name){

			var len = Object.keys(this.staticTable).length;
			var nextVariable;
			for (var i = 0; i < len; i++){
				nextVariable = this.staticTable[i];

				// Check to see if they match
				if(name == nextVariable.Var){
					return i;
				}
				
			}
		}
		public booleanAssignment(value1, value2){

			// Look up the variable in the static table
			var variablePos = this.lookupStaticVariable(value1);

			// Load the accumulator
			this.addNextOpCode("A9");

			// With either
			if(value2 == "false"){
				// 0 for false
				this.addNextOpCode("00");
			}
			else if(value2 == "true"){
				// 1 for true
				this.addNextOpCode("01");
			}

			// Write the accumulator to memory
			this.addNextOpCode("8D");

			// To the temp location
			this.addNextOpCode("T" + variablePos);
			this.addNextOpCode("XX");

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
					this.booleanDeclaration(name);
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
				var leftSide = node.children[0];

				if(rightSide.type == "Digit"){
					this.intAssignment(leftSide.name , rightSide.name);
				}
				else if(rightSide.type == "String"){
					this.stringAssignment();
				}
				else if(rightSide.type == "BoolVal"){
					this.booleanAssignment(leftSide.name, rightSide.name);
				}
				else{
					console.log("This should never happen");
				}
			}
			// Print Statement
			else if (node.name == "Print") {

				// Evaluate out the expression
				var evaluation = this.evaluateExpression(node.children[0]);
				var evalType = evaluation.type;

				// If the expression is a integer constant
				if(evalType == "Digit"){
					// Generate Code for a constant integer print statement
					this.generateConstantIntPrintCode(evaluation.name);
				}
				// If the expression is a string constant
				else if(evalType == "String"){
					// Generate Code for a string constant print statement
					//this.generateConstantStringPrintCode(evaluation.name);
				}
				// If the expression is a boolean constant
				else if(evalType == "BoolVal"){
					// Generate Code for a boolean constant print statement
					this.generateConstantBooleanPrintCode(evaluation.name);
				}
				// If the expression is a identifer
				else if(evalType == "Identifer"){
					// Generate Code for a identifer print statement
					this.generateIdentifierPrintCode(evaluation.name, evaluation.type);
				}	
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