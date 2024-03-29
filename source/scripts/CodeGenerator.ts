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
/// <reference path="SymbolTable.ts" />
module JOEC {
   /*
	* Code Generator
	*/
	export class CodeGenerator {

		public programCode = [];
		public programCounter = 0;
		public heapPointer = 255;
		public hasErrors: boolean = false;
		public collapseString = "";
		public symbolTable: JOEC.SymbolTable;
		public staticTable = {};
		public jumpTable = {};

		public constructor(_symbolTable) {

			// Get a copy of the symbol table for scope stuff
			this.symbolTable = _symbolTable;

			// Initialize the program code array
			for (var i = 0; i < 256; i++){
				this.programCode[i] = "00";
			}

			// Create static table entry to use for int math
			this.newStaticVariable("TEST", "TEST", "TEST");
			// Create static table entry to use for int math
			//this.newStaticVariable("TEST1", "TEST1", "TEST1");
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

			var testScope = this.symbolTable.lookupVariableScopeNumber(name);
			console.log("The scope of the variable is   " + testScope);

			// Get length of the table
			var staticVariableNumber = Object.keys(this.staticTable).length;

			this.staticTable[staticVariableNumber] = new JOEC.StaticTableEntry(name, type, testScope);

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

			console.log("The hex number is .. " + hexNumber);
			if(hexNumber.length == 1){
				hexNumber = "0" + hexNumber;
			}

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

		 	// Set the current node to null in order to make sure the pointer is correct
			this.symbolTable.currentScope = null;

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
				else if(nextRow.type == "TEST"){
					var replace = this.writeStaticInt(this.programCounter, nextRow.Var + nextRow.Var);
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

			// Joe fix this is because you need a different is visited thing
			this.symbolTable.nextChildScope2();

			// Get the number of statements that the block has
			var len = node.children.length;

			// Evaluate them 1 by 1 in order
			for (var i = 0; i < len; i++) {
				this.evaluateStatement(node.children[i]);
			}

			this.symbolTable.endScope();
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
		public intAssignment(value1, value2) {

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
		public advancedIntAssignment(value1, value2) {

			console.log("Advanced Int Assignemnt stuff");
			console.log("Value1: " + value1);
			console.log("Value2: " + value2);
			var variablePos = this.lookupStaticVariablePos(value1);

			this.generateIntExpressionStringCode(value2);

			// 8D
			this.addNextOpCode("8D");

			// T0
			this.addNextOpCode("T" + variablePos);

			// XX
			this.addNextOpCode("XX");

		}
		public generateIntExpressionStringCode(value:string){

			console.log("Generating Code for the Integer Expression String " + value);

			// Keep a counter for the number of plus signs
			var counter = 0;
			var nextChar = "";

			// Loop over the string once to count the number of plus signs for a later loop use
			for (var i = 0; i < value.length; i++) {
				nextChar = value.charAt(i);
				if (nextChar == "+") {
					counter++;
				}
			}

			console.log("The number of + signs is " + counter);

			// Get the first two values
			var firstValue = value.charAt(0);
			var secondValue = value.charAt(2);
			var pos = 2;

			console.log("SecondValue: " + secondValue);

			// Load the first value into the accumulator
			this.addNextOpCode("A9"); // Load
			this.addNextOpCode("0" + firstValue);  // Value

			// Store that value into the present temp variable T0
			this.addNextOpCode("8D");
			this.addNextOpCode("T0");
			this.addNextOpCode("XX");
			
			// Check to see if the second value is a int or identifier
			if(Utils.isInt(secondValue)) {
				// Load the second value into the accumulator 
				this.addNextOpCode("A9");
				this.addNextOpCode("0" + secondValue);
			}
			else{
				// Look up the value in the static table
				var variablePos = this.lookupStaticVariablePos(secondValue);
				this.addNextOpCode("AD")
				this.addNextOpCode("T" + variablePos);
				this.addNextOpCode("XX");
			}

			// Add the accumulator with the temp0 value
			this.addNextOpCode("6D");
			this.addNextOpCode("T0");
			this.addNextOpCode("XX");
			
			// Decrement the counter once
			counter--;

			// Loop until no more left m9
			while (counter > 0) {

				// Get the new value
				var newPos = pos + 2;
				var newValue = value.charAt(newPos);

				// Store the original value
				this.addNextOpCode("8D");
				this.addNextOpCode("T0");
				this.addNextOpCode("XX");

				// Check to see if the newValue is a int or identifier
				if(Utils.isInt(newValue)){
					this.addNextOpCode("A9");
					this.addNextOpCode("0" + newValue);
				}
				else{
					// Look up the value in the static table
					var variablePos = this.lookupStaticVariablePos(newValue);
					this.addNextOpCode("AD")
					this.addNextOpCode("T" + variablePos);
					this.addNextOpCode("XX");
				}
			
				// Add the accumulator with the temp0 value
				this.addNextOpCode("6D");
				this.addNextOpCode("T0");
				this.addNextOpCode("XX");

				// decrement the counter
				counter--;
			} 
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
		

		public lookupStaticVariablePos(name){

			console.log("Looking up the static variable " + name);

			var test = this.symbolTable.lookupVariableScopeNumber(name);
			console.log("The scope to match is ... " + test);

			var len = Object.keys(this.staticTable).length;
			var nextVariable;
			for (var i = 0; i < len; i++){
				nextVariable = this.staticTable[i];

				// Check to see if they match
				if(name == nextVariable.Var){
					if (test == nextVariable.Scope) {
						return i;
					}
				}
				
			}
		}
		public lookupStaticVariable(name) {

			console.log("Looking up the static variable " + name);

			var test = this.symbolTable.lookupVariableScopeNumber(name);
			console.log("The scope to match is ... " + test);
			var len = Object.keys(this.staticTable).length;
			var nextVariable;
			for (var i = 0; i < len; i++) {
				nextVariable = this.staticTable[i];

				// Check to see if they match
				if (name == nextVariable.Var) {
					if(test == nextVariable.Scope){
						return nextVariable;
					}
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

				if(rightSide.name == "+"){

					var test = this.collapseString;
					this.advancedIntAssignment(leftSide.name, test);
					this.collapseString = "";
				}
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

				// If the expression is a int expression
				if(evaluation.name == "+"){
					var test = this.collapseString;
					this.generateIntExpressionStringCode(test);
					this.collapseString = "";

					this.addNextOpCode("A2");
					this.addNextOpCode("01");

					this.addNextOpCode("8D");
					this.addNextOpCode("T0");
					this.addNextOpCode("XX");

					this.addNextOpCode("AC");
					this.addNextOpCode("T0");
					this.addNextOpCode("XX");

					this.addNextOpCode("FF");
				}
				// If the expression is a integer constant
				else if(evalType == "Digit"){
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

				// Get the starting point before anything happens
				var startingPlace = this.programCounter;

				// Evaluate out the boolean expression
				var booleanEval = this.evaluateBooleanExpression(node.children[0]);

				//Branch on not equal
				this.addNextOpCode("D0");

				// Create a new variable for the jump table
				var jumpVariableNumber = this.newJumpVariable();
				this.addNextOpCode("J" + jumpVariableNumber);

				// /Get the program counter before the block
				var before = this.programCounter;

				// Evaluate out the block
				var blockEval = this.evaluateBlock(node.children[1]);

				// Code to jump back to the top
				this.addNextOpCode("A2");
				this.addNextOpCode("01");
				this.addNextOpCode("EC");
				this.addNextOpCode("FF");
				this.addNextOpCode("00");
				this.addNextOpCode("D0");

				// Calculate how to jump backwords
				var joe = (255 - this.programCounter) + startingPlace;
			 	var test = this.decimalToHex(joe + "");

				this.addNextOpCode(test);

				// Get the program counter after the jump
				var after = this.programCounter;
				console.log("Before : " + before);
				console.log("After : " + after);
				var calc = (after - before) + "";

				console.log("The calc is " + calc);
				this.jumpTable[jumpVariableNumber].address = calc;

			}
			// If
			else if (node.name == "If") {

				// Evaluate out the boolean expression
				this.evaluateBooleanExpression(node.children[0]);

				// Branch on not equal	
				this.addNextOpCode("D0");

				// Create a new variable for the jump table
				var jumpVariableNumber = this.newJumpVariable();
				this.addNextOpCode("J" + jumpVariableNumber);

				// Get the program counter before the jump
				var before = this.programCounter;

				// Evaluate out the block
				var blockEval = this.evaluateBlock(node.children[1]);

				// Get the program counter after the jump
				var after = this.programCounter;

				console.log("Before : " + before);
				console.log("After : " + after);
				// Update the variable in jump table
				this.jumpTable[jumpVariableNumber].address = after - before;
				console.log(this.jumpTable[jumpVariableNumber]);
			}	
		}
		public evaluateBooleanExpression(node: JOEC.TreeNode) {

			// First check for the number of children
			if(node.children.length == 2) {

				var first = node.children[0];
				var second = node.children[1];
				/* first expression */
				console.log("First");
				console.log(first);
				console.log("Second");
				console.log(second);
				// Check to see if the first is an identifier
				if(first.type == "Identifier"){
					var variablePos = this.lookupStaticVariablePos(first.name);

					// Load the x register from memory
					this.addNextOpCode("AE");
					this.addNextOpCode("T" + variablePos);
					this.addNextOpCode("XX");
				}
				else if(first.type == "BoolVal"){

					// Load the x register with a constant
					this.addNextOpCode("A2");

					if(first.name == "true"){
						this.addNextOpCode("01");
					}
					else {
						this.addNextOpCode("00");
					}
				}
				else if(first.type == "Digit"){
					this.addNextOpCode("A2");
					this.addNextOpCode("0" + first.name);
				}


				/* Second Expression */
				if(second.type == "Identifier"){

					//Compare
					this.addNextOpCode("EC");

					var variablePos = this.lookupStaticVariablePos(second.name);

					this.addNextOpCode("T" + variablePos);
					this.addNextOpCode("XX");
				}
				else if (second.type == "BoolVal") {

					// Load the accum with a constant
					this.addNextOpCode("A9");

					if (second.name == "true") {
						this.addNextOpCode("01");
					}
					else {
						this.addNextOpCode("00");
					}
					// Write it to temp address
					this.addNextOpCode("8D");
					this.addNextOpCode("T0");
					this.addNextOpCode("XX");

					// Compare
					this.addNextOpCode("EC");
					this.addNextOpCode("T0");
					this.addNextOpCode("XX");
				}
				else if (second.type == "Digit") {
					this.addNextOpCode("A9");
					this.addNextOpCode("0" + second.name);
					// Write it to temp address
					this.addNextOpCode("8D");
					this.addNextOpCode("T0");
					this.addNextOpCode("XX");

					// Compare
					this.addNextOpCode("EC");
					this.addNextOpCode("T0");
					this.addNextOpCode("XX");
				}

				// Need this bit of code every time in order to make the nots work
				this.addNextOpCode('A9');
				this.addNextOpCode('00');
				this.addNextOpCode('D0');
				this.addNextOpCode('02');
				this.addNextOpCode('A9');
				this.addNextOpCode('01');

				// If you need to flip the z flag
				if (node.name == '!=') {

					console.log("not equals was found");

					// Load the x register with 0
					this.addNextOpCode('A2');
					this.addNextOpCode('00');

					// Store the accumulator in t0
					this.addNextOpCode('8D');
					this.addNextOpCode('T0');
					this.addNextOpCode('XX');

					// Compare
					this.addNextOpCode('EC');
					this.addNextOpCode('T0');
					this.addNextOpCode('XX');
				}
				else{

				}
			}
			else if(node.children.length == 0) {
				console.log("another constant");

				// Check for the most basic case first
				if (node.name == "true" || node.name == "false") {

					// Load the accumulator with a 1 or 0
					this.addNextOpCode("A9");
					if(node.name == "true"){
						this.addNextOpCode("01");
					}
					else{
						this.addNextOpCode("00");
					}
					
					// Store the 1 at the temp address
					this.addNextOpCode("8D");
					this.addNextOpCode("T0");
				 	this.addNextOpCode("XX");

				 	// Load the x register with a 1
					this.addNextOpCode("A2");	
					this.addNextOpCode("01");

					// Compare them
					this.addNextOpCode("EC");
					this.addNextOpCode("T0");
					this.addNextOpCode("XX");
				}
			}
	
			return node;
		}
		/*
		 *  Expression
		 */
		public evaluateExpression(node: JOEC.TreeNode) {

			// Integer Expression
			if (node.name == "+") {
				console.log("THE NODE IS");
				console.log(node);
				var collapsedIntExpression = this.collapseIntegerExpression(node);
				console.log(this.collapseString);
				return node;
				
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
		public collapseIntegerExpression(node: JOEC.TreeNode){

			console.log("Collapsing Int Expression");
			if(node.name == "+"){

				// Digit
				var digit = node.children[0].name;				
				var expr = node.children[1];

				// Append a digit
				this.collapseString = this.collapseString + digit;

				// Check to see if another + is coming
				if(expr.name == "+"){
					// Append a + sign
					this.collapseString = this.collapseString + expr.name;

					// recurse
					this.collapseIntegerExpression(expr);
				}
				else {

					this.collapseString = this.collapseString + "+" +  expr.name;
					return node;
				}
			}
			else {
				this.collapseString = this.collapseString + node.name;
				return node;
			}
		}
	}	
}