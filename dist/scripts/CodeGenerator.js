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
var JOEC;
(function (JOEC) {
    /*
     * Code Generator
     */
    var CodeGenerator = (function () {
        function CodeGenerator() {
            this.programCode = [];
            this.programCounter = 0;
            this.heapPointer = 255;
            this.hasErrors = false;
            this.collapseString = "";
            this.staticTable = {};
            this.jumpTable = {};
            // Initialize the program code array
            for (var i = 0; i < 256; i++) {
                this.programCode[i] = "00";
            }
            // Create static table entry to use for int math
            this.newStaticVariable("TEST", "TEST", "TEST");
        }
        /**
         * writeDataIntoHeap
         * @Params Data: String - The string to write into the heap
         *
         */
        CodeGenerator.prototype.writeDataIntoHeap = function (data) {
            // First rip the quotes out of this bitch
            var test = data.replace(/"/g, "").trim();
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
        };
        CodeGenerator.prototype.newStaticVariable = function (name, type, scope) {
            // Get length of the table
            var staticVariableNumber = Object.keys(this.staticTable).length;
            this.staticTable[staticVariableNumber] = new JOEC.StaticTableEntry(name, type, scope);
            return staticVariableNumber;
        };
        CodeGenerator.prototype.newJumpVariable = function () {
            // get the length of the table
            var jumpVariableNumber = Object.keys(this.jumpTable).length;
            this.jumpTable[jumpVariableNumber] = new JOEC.JumpTableEntry(jumpVariableNumber);
            return jumpVariableNumber;
        };
        CodeGenerator.prototype.writeStaticInt = function (address, value) {
            this.programCounter++;
            var output = this.decimalToHex(address);
            // Check to see if you need to stuff a zero in front cause of dumb shit
            if (output.length == 1) {
                output = "0" + output;
            }
            return output;
        };
        CodeGenerator.prototype.writeStaticBoolean = function (address, value) {
            this.programCounter++;
            var output = this.decimalToHex(address);
            // Check to see if you need to stuff a zero in front cause of dumb shit
            if (output.length == 1) {
                output = "0" + output;
            }
            return output;
        };
        /**
        * Used to convert a decimal string into a hex string
           @Params {String} - A decimal string
           @Returns {String} - A hex string
        */
        CodeGenerator.prototype.decimalToHex = function (input) {
            var decimalNumber = parseInt(input, 10);
            var hexNumber = decimalNumber.toString(16);
            return hexNumber.toUpperCase();
        };
        CodeGenerator.prototype.addNextOpCode = function (opCode) {
            // Add the new opcode to the next available address in memory
            this.programCode[this.programCounter] = opCode;
            // Increment the next available address
            this.programCounter++;
        };
        /*
         * Used to convert a given AST into 6502A opcodes
         * @params Tree - The AST to be converted into code
         * @returns Array - An array of 6502a op codes
         */
        CodeGenerator.prototype.generateCode = function (AST) {
            this.evaluateBlock(AST.rootNode);
            // Add a break to the end of the program
            this.addNextOpCode("00");
            this.calculateJumpArea();
            // Start to write the static area
            this.calculateStaticArea();
        };
        CodeGenerator.prototype.calculateJumpArea = function () {
            //the next instruction 
            var nextInstruction;
            // Loop over the program code
            for (var i = 0; i < 256; i++) {
                nextInstruction = this.programCode[i];
                // Check for any that start with a uppercase J
                if (nextInstruction.charAt(0) == "J") {
                    // Rip the J out of the string
                    var test = nextInstruction.replace("J", "");
                    // Look it up in the jump table
                    var jumpTableEntry = this.jumpTable[test];
                    // Convert to hex
                    var hexOutput = this.decimalToHex(jumpTableEntry.address + "");
                    if (hexOutput.length == 1) {
                        hexOutput = "0" + hexOutput;
                    }
                    // backpatch the jump adress finally
                    this.programCode[i] = hexOutput;
                    console.log("HEX OUTPUT:" + hexOutput);
                }
            }
        };
        CodeGenerator.prototype.calculateStaticArea = function () {
            // Get the start of the static 
            var startingAddress = this.programCounter;
            // Get the length of the static table
            var len = Object.keys(this.staticTable).length;
            // The next row in the static table
            var nextRow;
            // Loop over the static table
            for (var i = 0; i < len; i++) {
                nextRow = this.staticTable[i];
                if (nextRow.type == "Int") {
                    var replace = this.writeStaticInt(this.programCounter, nextRow.Var + nextRow.Var);
                    var search = "T" + i;
                    this.FindAndReplace(search, replace);
                }
                else if (nextRow.type == "BoolVal") {
                    var replace = this.writeStaticBoolean(this.programCounter, nextRow.Var + nextRow.Var);
                    var search = "T" + i;
                    this.FindAndReplace(search, replace);
                }
                else if (nextRow.type == "String") {
                    var replace = this.writeStaticBoolean(this.programCounter, nextRow.Var + nextRow.Var);
                    var search = "T" + i;
                    this.FindAndReplace(search, replace);
                }
                else if (nextRow.type == "TEST") {
                    var replace = this.writeStaticInt(this.programCounter, nextRow.Var + nextRow.Var);
                    var search = "T" + i;
                    this.FindAndReplace(search, replace);
                }
            }
        };
        CodeGenerator.prototype.FindAndReplace = function (search, replace) {
            var nextLocation;
            for (var i = 0; i < this.programCode.length; i++) {
                nextLocation = this.programCode[i];
                if (nextLocation == search) {
                    this.programCode[i] = replace;
                    this.programCode[i + 1] = "00";
                }
            }
        };
        /*
        * Block
        */
        CodeGenerator.prototype.evaluateBlock = function (node) {
            // Get the number of statements that the block has
            var len = node.children.length;
            // Evaluate them 1 by 1 in order
            for (var i = 0; i < len; i++) {
                this.evaluateStatement(node.children[i]);
            }
        };
        CodeGenerator.prototype.generateConstantIntPrintCode = function (value) {
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
        };
        CodeGenerator.prototype.intAssignment = function (value1, value2) {
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
        };
        CodeGenerator.prototype.advancedIntAssignment = function (value1, value2) {
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
        };
        CodeGenerator.prototype.generateIntExpressionStringCode = function (value) {
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
            // Load the first value into the accumulator
            this.addNextOpCode("A9"); // Load
            this.addNextOpCode("0" + firstValue); // Value
            // Store that value into the present temp variable T0
            this.addNextOpCode("8D");
            this.addNextOpCode("T0");
            this.addNextOpCode("XX");
            // Load the second value into the accumulator 
            this.addNextOpCode("A9");
            this.addNextOpCode("0" + secondValue);
            // Add the accumulator with the temp0 value
            this.addNextOpCode("6D");
            this.addNextOpCode("T0");
            this.addNextOpCode("XX");
            // Decrement the counter once
            counter--;
            // Loop until no more left m9
            while (counter > 0) {
                // Get the new value
                var newValue = pos + 2;
                // Store the original value
                this.addNextOpCode("8D");
                this.addNextOpCode("T0");
                this.addNextOpCode("XX");
                // Load the second value into the accumulator 
                this.addNextOpCode("A9");
                this.addNextOpCode("0" + value.charAt(newValue));
                // Add the accumulator with the temp0 value
                this.addNextOpCode("6D");
                this.addNextOpCode("T0");
                this.addNextOpCode("XX");
                // decrement the counter
                counter--;
            }
        };
        // public generateIntExpressionPrintCode(value:string) {
        // 	console.log("Printing advanced int expressoin with a value of " + value);
        // 	var counter = 0;
        // 	var nextChar = "";
        // 	for (var i = 0; i < value.length; i++){
        // 		nextChar = value.charAt(i);
        // 		if(nextChar == "+"){
        // 			counter++;
        // 		}
        // 	}
        // 	console.log("The number of + signs is " + counter);
        // 	// Get the first two values
        // 	var firstValue = value.charAt(0);
        // 	var secondValue = value.charAt(2);
        // 	var pos = 2;
        // 	// Load the first value into the accumulator
        // 	this.addNextOpCode("A9"); // Load
        // 	this.addNextOpCode("0" + firstValue);  // Value
        // 	// Store that value into the present temp variable T0
        // 	this.addNextOpCode("8D");
        // 	this.addNextOpCode("T0");
        // 	this.addNextOpCode("XX");
        // 	// Load the second value into the accumulator 
        // 	this.addNextOpCode("A9");
        // 	this.addNextOpCode("0" + secondValue);
        // 	// Add the accumulator with the temp0 value
        // 	this.addNextOpCode("6D");
        // 	this.addNextOpCode("T0");
        // 	this.addNextOpCode("XX");
        // 	// Decrement the counter once
        // 	counter--;
        // 	// Loop until no more left m9
        // 	while(counter > 0){
        // 		// Get the new value
        // 		var newValue = pos + 2;
        // 		console.log("INSIDE THE LOOP" + value.charAt(newValue));
        // 		// Store the original value
        // 		this.addNextOpCode("8D");
        // 		this.addNextOpCode("T0");
        // 		this.addNextOpCode("XX");
        // 		// Load the second value into the accumulator 
        // 		this.addNextOpCode("A9");
        // 		this.addNextOpCode("0" + value.charAt(newValue));
        // 		// Add the accumulator with the temp0 value
        // 		this.addNextOpCode("6D");
        // 		this.addNextOpCode("T0");
        // 		this.addNextOpCode("XX");
        // 		// decrement the counter
        // 		counter--;
        // 	} 
        // 	this.addNextOpCode("A2");
        // 	this.addNextOpCode("01");
        // 	this.addNextOpCode("8D");
        // 	this.addNextOpCode("T0");
        // 	this.addNextOpCode("XX");
        // 	this.addNextOpCode("AC");
        // 	this.addNextOpCode("T0");
        // 	this.addNextOpCode("XX");
        // 	this.addNextOpCode("FF");
        // }
        CodeGenerator.prototype.generateConstantBooleanPrintCode = function (value) {
            // Load the y register withn a constant
            this.addNextOpCode("A0");
            // Check to see if true or false
            if (value == "true") {
                this.addNextOpCode("01");
            }
            else if (value == "false") {
                this.addNextOpCode("00");
            }
            // Load the x register with a constant
            this.addNextOpCode("A2");
            // load 1 cause we want to print a integer
            this.addNextOpCode("01");
            // Make a system call to output the results
            this.addNextOpCode("FF");
        };
        CodeGenerator.prototype.generateConstantStringPrintCode = function (value1) {
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
        };
        CodeGenerator.prototype.generateIdentifierPrintCode = function (data, type) {
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
            if (variableType == "Int" || variableType == "BoolVal") {
                this.addNextOpCode("01");
            }
            else if (variableType == "String") {
                this.addNextOpCode("02");
            }
            // FF
            this.addNextOpCode("FF");
        };
        CodeGenerator.prototype.intDeclaration = function (name) {
            // Load the accumulator
            this.addNextOpCode("A9");
            // With 00
            this.addNextOpCode("00");
            // Store the accumulator in memory 
            this.addNextOpCode("8D");
            // Create a new variable for the static table
            var staticVariableNumber = this.newStaticVariable(name, "Int", "0") + "";
            // Store it at this temporary address
            this.addNextOpCode("T" + staticVariableNumber);
            this.addNextOpCode("XX");
        };
        CodeGenerator.prototype.booleanDeclaration = function (name) {
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
        };
        CodeGenerator.prototype.stringDeclaration = function (name) {
            // Load the accumulator
            //this.addNextOpCode("A9");
            // With 00
            //this.addNextOpCode("00");
            // Store the accumulator in memory
            //this.addNextOpCode("8D");
            // Create a new variable for the static table
            var staticVariableNumber = this.newStaticVariable(name, "String", "0") + "";
            // Store it at this temporary address
            //this.addNextOpCode("T" + staticVariableNumber);
            //this.addNextOpCode("XX");
        };
        CodeGenerator.prototype.stringAssignment = function (value1, value2) {
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
        };
        CodeGenerator.prototype.lookupStaticVariablePos = function (name) {
            var len = Object.keys(this.staticTable).length;
            var nextVariable;
            for (var i = 0; i < len; i++) {
                nextVariable = this.staticTable[i];
                // Check to see if they match
                if (name == nextVariable.Var) {
                    return i;
                }
            }
        };
        CodeGenerator.prototype.lookupStaticVariable = function (name) {
            var len = Object.keys(this.staticTable).length;
            var nextVariable;
            for (var i = 0; i < len; i++) {
                nextVariable = this.staticTable[i];
                // Check to see if they match
                if (name == nextVariable.Var) {
                    return nextVariable;
                }
            }
        };
        CodeGenerator.prototype.identifierAssignment = function (value1, value2) {
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
        };
        CodeGenerator.prototype.booleanAssignment = function (value1, value2) {
            // Look up the variable in the static table
            var variablePos = this.lookupStaticVariablePos(value1);
            // Load the accumulator
            this.addNextOpCode("A9");
            console.log("Value 2");
            console.log(value2);
            // With either
            if (value2 == "false") {
                // 0 for false
                this.addNextOpCode("00");
            }
            else if (value2 == "true") {
                // 1 for true
                this.addNextOpCode("01");
            }
            // Write the accumulator to memory
            this.addNextOpCode("8D");
            // To the temp location
            this.addNextOpCode("T" + variablePos);
            this.addNextOpCode("XX");
        };
        /*
        * Statement
        */
        CodeGenerator.prototype.evaluateStatement = function (node) {
            // Variable Declaration
            if (node.name == "Variable Declaration") {
                console.log("Variable Declaration was found");
                // Get the type
                var type = node.children[0].name;
                // Get the name
                var name = node.children[1].name;
                // Call the appropriate function to generate the code for that section
                if (type == "int") {
                    this.intDeclaration(name);
                }
                else if (type == "string") {
                    this.stringDeclaration(name);
                }
                else if (type == "boolean") {
                    this.booleanDeclaration(name);
                }
            }
            else if (node.name == "Block") {
                this.evaluateBlock(node);
            }
            else if (node.name == "Assign") {
                console.log("Assignment Statement was found");
                // Evaluate the Right Hand Side of the statement
                var rightSide = this.evaluateExpression(node.children[1]);
                var leftSide = node.children[0];
                if (rightSide.name == "+") {
                    var test = this.collapseString;
                    this.advancedIntAssignment(leftSide.name, test);
                    this.collapseString = "";
                }
                if (rightSide.type == "Digit") {
                    this.intAssignment(leftSide.name, rightSide.name);
                }
                else if (rightSide.type == "String") {
                    this.stringAssignment(leftSide.name, rightSide.name);
                }
                else if (rightSide.type == "BoolVal") {
                    // Check to see if its advanced BoolVal or normal BoolVal
                    // if(rightSide.name == "==" || rightSide.name == "!="){
                    // }
                    //else {
                    this.booleanAssignment(leftSide.name, rightSide.name);
                }
                else if (rightSide.type == "Identifier") {
                    this.identifierAssignment(leftSide.name, rightSide.name);
                }
                else {
                    console.log("This should never happen");
                }
            }
            else if (node.name == "Print") {
                // Evaluate out the expression
                var evaluation = this.evaluateExpression(node.children[0]);
                var evalType = evaluation.type;
                // If the expression is a int expression
                if (evaluation.name == "+") {
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
                else if (evalType == "Digit") {
                    // Generate Code for a constant integer print statement
                    this.generateConstantIntPrintCode(evaluation.name);
                }
                else if (evalType == "String") {
                    // Generate Code for a string constant print statement
                    this.generateConstantStringPrintCode(evaluation.name);
                }
                else if (evalType == "BoolVal") {
                    // Generate Code for a boolean constant print statement
                    this.generateConstantBooleanPrintCode(evaluation.name);
                }
                else if (evalType == "Identifier") {
                    // Generate Code for a identifier print statement
                    this.generateIdentifierPrintCode(evaluation.name, evaluation.type);
                }
            }
            else if (node.name == "While") {
                var booleanEval = this.evaluateBooleanExpression(node.children[0]);
                var blockEval = this.evaluateBlock(node.children[1]);
            }
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
        };
        CodeGenerator.prototype.evaluateBooleanExpression = function (node) {
            if (node.name != "==" && node.name != "!=") {
                return node;
            }
            // Get both of the expression that need to be compared and evaluate them
            var expressionOne = this.evaluateExpression(node.children[0]);
            var expressionTwo = this.evaluateExpression(node.children[1]);
            // Handles Identifier comparison
            if (expressionOne.type == "Identifier" && expressionTwo.type == "Identifier") {
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
            else if (expressionOne.type == "BoolVal" && expressionTwo.type == "BoolVal") {
            }
            console.log("Comparing Expressions");
            console.log(expressionOne);
            console.log(expressionTwo);
            return node;
        };
        /*
         *  Expression
         */
        CodeGenerator.prototype.evaluateExpression = function (node) {
            // Integer Expression
            if (node.name == "+") {
                console.log("THE NODE IS");
                console.log(node);
                var collapsedIntExpression = this.collapseIntegerExpression(node);
                console.log(this.collapseString);
                return node;
            }
            else if (node.name == "==" || node.name == "!=") {
                return this.evaluateBooleanExpression(node);
            }
            else if (node.type == "String") {
                return node;
            }
            else if (node.type == "Digit") {
                return node;
            }
            else if (node.type == "BoolVal") {
                return node;
            }
            else if (node.type == "Identifier") {
                return node;
            }
        };
        CodeGenerator.prototype.collapseIntegerExpression = function (node) {
            console.log("Collapsing Int Expression");
            if (node.name == "+") {
                // Digit
                var digit = node.children[0].name;
                var expr = node.children[1];
                // Append a digit
                this.collapseString = this.collapseString + digit;
                // Check to see if another + is coming
                if (expr.name == "+") {
                    // Append a + sign
                    this.collapseString = this.collapseString + expr.name;
                    // recurse
                    this.collapseIntegerExpression(expr);
                }
                else {
                    this.collapseString = this.collapseString + "+" + expr.name;
                    return node;
                }
            }
            else {
                this.collapseString = this.collapseString + node.name;
                return node;
            }
        };
        /*
         * Create new string variable
         */
        CodeGenerator.prototype.createNewStringVariable = function (variableName) {
        };
        CodeGenerator.prototype.simplifyBooleanExpression = function () {
        };
        CodeGenerator.prototype.simplifyIntegerExpression = function () {
        };
        return CodeGenerator;
    })();
    JOEC.CodeGenerator = CodeGenerator;
})(JOEC || (JOEC = {}));
