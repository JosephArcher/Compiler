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
/// <reference path="JumpTableEntry.ts" />
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
			// Initalize the program code arrray
			for (var i = 0; i < 256; i++){
				this.programCode[i] = "00";
			}
		}
		/**
		 * writeDataIntoHeap
		 * @Params Data: String - The string to write into the heap
		 *
		 */
		public writeDataIntoHeap(data: string){

			// First rip the quotes out of this bitch
			var test = data.replace(/"/g,"").trim();

			// Write the 00 to into the program code
			this.programCode[this.heapPointer] = "00";
			this.heapPointer--;

			// Get the length and sub 1 to loop
			var len = test.length;
			
			// Loop over the string backwords and write the string into heap
			for (var i = len; i > 0; i--) {
				this.programCode[this.heapPointer] = this.decimalToHex(test.charCodeAt(i - 1) + "");
				this.heapPointer--;	
			}
		}
		public newStaticVariable(name,type, scope){

			// Get length of the table
			var staticVariableNumber = Object.keys(this.staticTable).length;

			this.staticTable[staticVariableNumber] = new JOEC.StaticTableEntry(name, type, scope);

			return staticVariableNumber;
		}
		public newJumpVariable() {

			// get the length of the table
			var jumpVariableNumber = Object.keys(this.jumpTable).length;


			this.jumpTable[jumpVariableNumber] = new JOEC.JumpTableEntry(jumpVariableNumber);

			return jumpVariableNumber;
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

			this.calculateJumpArea();

			// Start to write the static area
			this.calculateStaticArea();
		}
		public calculateJumpArea() {


			//the next instruction 
			var nextInstruction;

			// Loop over the program code
			for (var i = 0; i < 256; i++){

				nextInstruction = this.programCode[i];
				// Check for any that start with a uppercase J
				if(nextInstruction.charAt(0) == "J"){

					// Rip the J out of the string
					var test = nextInstruction.replace("J", "");

					// Look it up in the jump table
					var jumpTableEntry = this.jumpTable[test];

					// Convert to hex
					var hexOutput = this.decimalToHex(jumpTableEntry.address + "");

					if(hexOutput.length == 1){
						hexOutput = "0" + hexOutput;
					}

					// backpatch the jump adress finally
					this.programCode[i] = hexOutput;
					console.log("HEX OUTPUT:" + hexOutput);
						
				}	


			}
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
				else if(nextRow.type == "String"){
					var replace = this.writeStaticBoolean(this.programCounter, nextRow.Var + nextRow.Var);
					var search = "T" + i;
					this.FindAndReplace(search, replace);
				}
			}
		}
		public FindAndReplace(search, replace){
			
			var nextLocation;
			for (var i = 0; i < this.programCode.length; i++){
				nextLocation = this.programCode[i];

				if(nextLocation == search){
					
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
		public generateConstantStringPrintCode(value1) {

			// A0
			this.addNextOpCode("A0");
			// Write the constant into the heap
			this.writeDataIntoHeap(value1);

			// Get the location of the heap point +1 to account for the off by 1 issue
			var heapPointer = this.heapPointer;
			heapPointer++;

			// Load the value into the accumulator
			this.addNextOpCode(this.decimalToHex(heapPointer + ""));

			// A2
			this.addNextOpCode("A2");

			// 02
			this.addNextOpCode("02");

			// FF
			this.addNextOpCode("FF");
		}
		public generateIdentifierPrintCode(data , type) {

			
			// Lookup the variable in the static table to get its position
			var variablePos = this.lookupStaticVariablePos(data);
			var variableType = this.lookupStaticVariable(data).type;
			console.log("The variable type is " + variableType);
		

			// AC
			this.addNextOpCode("AC");

			// T0
			this.addNextOpCode("T" + variablePos);

			// XX
			this.addNextOpCode("XX");

			// A2
			this.addNextOpCode("A2");

			// Decide what needs to be done based on the type
			if(variableType == "Int" || variableType == "BoolVal"){
				this.addNextOpCode("01");
			}
			else if(variableType == "String"){
				this.addNextOpCode("02");
			}
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

			// Load the accumulator
			//this.addNextOpCode("A9");

			// With 00
			//this.addNextOpCode("00");

			// Store the accumulator in memory
			//this.addNextOpCode("8D");

			// Create a new variable for the static table
			var staticVariableNumber = this.newStaticVariable(name , "String" , "0") + "";

			// Store it at this temporary address
			//this.addNextOpCode("T" + staticVariableNumber);
			//this.addNextOpCode("XX");
		}
		public stringAssignment(value1, value2) {

			// Lookup the variable in the static table
			var variablePos = this.lookupStaticVariablePos(value1);

			// Load the accumulator
			this.addNextOpCode("A9");

			// Write the string into the heap
			this.writeDataIntoHeap(value2);

			// Get the location of the heap point 
			var heapPointer = this.heapPointer;

			//+1 to account for the off by 1 issue
			heapPointer++;

			

			// Load the value into the accumulator
			this.addNextOpCode(this.decimalToHex(heapPointer + ""));

			// 8D
			this.addNextOpCode("8D");

			// T0
			this.addNextOpCode("T" + variablePos);

			// XX
			this.addNextOpCode("XX");
		}
		public intAssignment(value1, value2){

			var variablePos = this.lookupStaticVariablePos(value1);

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
		public lookupStaticVariablePos(name){

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
		public lookupStaticVariable(name) {

			var len = Object.keys(this.staticTable).length;
			var nextVariable;
			for (var i = 0; i < len; i++) {
				nextVariable = this.staticTable[i];

				// Check to see if they match
				if (name == nextVariable.Var) {
					return nextVariable;
				}

			}
		}
		public identifierAssignment(value1, value2){

			// AD
			this.addNextOpCode("AD");

			// Memory Location
			var variablePos1 = this.lookupStaticVariablePos(value2);
			this.addNextOpCode("T" + variablePos1);
			this.addNextOpCode("XX");

			// 8D
			this.addNextOpCode("8D");

			// Memory Location
			var variablePos2 = this.lookupStaticVariablePos(value1);
			this.addNextOpCode("T" + variablePos2);
			this.addNextOpCode("XX");

		}
		public booleanAssignment(value1, value2){

			// Look up the variable in the static table
			var variablePos = this.lookupStaticVariablePos(value1);

			// Load the accumulator
			this.addNextOpCode("A9");

			console.log("Value 2");
			console.log(value2);

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

				console.log("The right hand side eqauls");
				console.log(rightSide);
				if(rightSide.type == "Digit"){
					this.intAssignment(leftSide.name , rightSide.name);
				}
				else if(rightSide.type == "String"){
					this.stringAssignment(leftSide.name, rightSide.name);
				}
				else if(rightSide.type == "BoolVal"){
					// Check to see if its advanced BoolVal or normal BoolVal
					// if(rightSide.name == "==" || rightSide.name == "!="){

					// }
					//else {
						this.booleanAssignment(leftSide.name, rightSide.name);
					//}	
				}
				else if(rightSide.type == "Identifier"){
					this.identifierAssignment(leftSide.name, rightSide.name);
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
				console.log(evaluation);
				// If the expression is a integer constant
				if(evalType == "Digit"){
					// Generate Code for a constant integer print statement
					this.generateConstantIntPrintCode(evaluation.name);
				}
				// If the expression is a string constant
				else if(evalType == "String"){
					// Generate Code for a string constant print statement
					this.generateConstantStringPrintCode(evaluation.name);
				}
				// If the expression is a boolean constant
				else if(evalType == "BoolVal"){
					// Generate Code for a boolean constant print statement
					this.generateConstantBooleanPrintCode(evaluation.name);
				}
				// If the expression is a identifier
				else if (evalType == "Identifier") {
					
					// Generate Code for a identifier print statement
					this.generateIdentifierPrintCode(evaluation.name, evaluation.type);
				}	
			}
			// While
			else if (node.name == "While") {
				var booleanEval = this.evaluateBooleanExpression(node.children[0]);
				var blockEval = this.evaluateBlock(node.children[1]);
			}
			// If
			else if (node.name == "If") {

				// Evaluate out the boolean expression
				var booleanEval = this.evaluateBooleanExpression(node.children[0]);

				// Branch on not equal
				this.addNextOpCode("DO");

				// Create a new variable for the jump table
				var jumpVariableNumber = this.newJumpVariable();
				this.addNextOpCode("J" + jumpVariableNumber);

				// Get the program counter before the jump
				var before = this.programCounter;

				// Evaluate out the block
				var blockEval = this.evaluateBlock(node.children[1]);

				// Get the program counter after the jump
				var after = this.programCounter;

				// Update the variable in jump table
				console.log("TSETING THE TEST");
				this.jumpTable[jumpVariableNumber].address = after - before + 1;
				console.log(this.jumpTable[jumpVariableNumber]);
			}	
		}
		public evaluateBooleanExpression(node: JOEC.TreeNode) {

			if (node.name != "==" && node.name != "!=") {

				return node;
			} 
			// Get both of the expression that need to be compared and evaluate them
			var expressionOne = this.evaluateExpression(node.children[0]);
			var expressionTwo = this.evaluateExpression(node.children[1]);

			// Handles Identifier comparison
			if (expressionOne.type == "Identifier" && expressionTwo.type == "Identifier"){

				this.addNextOpCode("AE");

				// Memory Location
				var variablePos1 = this.lookupStaticVariablePos(expressionOne.name);
				this.addNextOpCode("T" + variablePos1);
				this.addNextOpCode("XX");

				// Compare the next contents of the x register
				this.addNextOpCode("EC");

				// With this memory location
				var variablePos2 = this.lookupStaticVariablePos(expressionTwo.name);
				this.addNextOpCode("T" + variablePos2);
				this.addNextOpCode("XX");


			}
			else if(expressionOne.type == "BoolVal" && expressionTwo.type == "BoolVal"){


			}
			console.log("Comparing Expressions");
			console.log(expressionOne);
			console.log(expressionTwo);

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
		 public simplifyBooleanExpression(){

		 }
		 public simplifyIntegerExpression(){

		 }
	}	
}