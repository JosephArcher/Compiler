///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
///<reference path="Main.ts"/>
///<reference path="queue.ts"/>
///<reference path="Tree.ts"/>
///<reference path="TreeNode.ts"/>
///<reference path="SymbolTable.ts"/>
module JOEC {
	/*
	* Parser 
	*/
	export class Parser {	
		
		public currentToken: JOEC.Token;      // The current token 
		public hasErrors: boolean = false;    // Determines if the parser has any errors
		public tokenQueue = new Queue();      // Holds the tokens passed in from the lexer
		public numberOfPrograms: number = 0;  // The number of programs that have been parsed
		public CST: JOEC.Tree;                // Concrete Syntax Tree
		public AST: JOEC.Tree;                // Abstract Syntax Tree
		public SymbolTable: JOEC.SymbolTable; // Symbol Table

		// Constructor
		constructor() {}

		/**
		* startParse
		*
		* Called to start the parser
		*
		* Params
		* 	tokenArray - the array of tokens created in the lexer
		*/
		public startParse(tokenArray) {

			var len = tokenArray.length;

			// Loop over the array and add the tokens to queue for ease of use
			for (var i = 0; i < len; i++){
				this.tokenQueue.enqueue(tokenArray[i]);
			}

			// Parse Program
			this.parseProgram();
		}
		/**
		* matchCharacter
		*
		* Used to match what token you are expecting to get
		* with what the current token is
		*
		* Params
		* 	toMatch - the character you are expecting to encounter
		*/
		public matchCharacter(toMatch: string) {

				// Check to see if they match
				if (this.currentToken.getValue() == toMatch) {

					console.log("A match was found for " + toMatch);
					this.CST.addNode(this.currentToken.getValue(), "Leaf", this.currentToken.getKind(), this.currentToken.getLineNumber());
					this.currentToken = this.tokenQueue.dequeue();
				}
				else {
					
						Utils.createNewErrorMessage("Expecting " + toMatch + " but found  \' " + this.currentToken.getValue() + " \' on line " + this.currentToken.getLineNumber());
						this.hasErrors = true;
						
				}
		}
		/**
		* Program
		*/
		public parseProgram () {

			Utils.createNewMessage("Parsing Program ");

			// Get the first character
			this.currentToken= <JOEC.Token> this.tokenQueue.dequeue();

			// Start to generate a concrete syntax tree
			this.CST = new JOEC.Tree();
			
			// Add the RootNode
			this.CST.addNode("Program", "Branch");

			// Block
			this.parseBlock();

			// Dollar Sign
			this.matchCharacter('$');

			// if(!this.hasErrors) {

			// 	Utils.createNewMessage("Program successfully parsed");

			// 	// Check to see if more tokens still exist

			// 	if (this.tokenQueue.getSize() > 0) {
				
			// 		// If they do call the parse program another time
			// 		this.runAnotherProgram();
			// 	}	
			// }
		}
		public runAnotherProgram(){
			
			// Increment the number of Programs counter
			this.numberOfPrograms++;

			Utils.createNewMessage("\nParsing Program " + this.numberOfPrograms);

			// Block
			this.parseBlock();

			// Dollar Sign
			this.matchCharacter('$');

			Utils.createNewMessage("Program " + this.numberOfPrograms + " successfully parsed");

			// Check to see if more tokens still exist
			if (this.tokenQueue.getSize() > 0) {
		
				// If they do call the parse program another time
				this.runAnotherProgram();
			}	
		}
		/**
		* Block
		*/
		public parseBlock() {

			this.CST.addNode("Block", "Branch");
		
			// {
			this.matchCharacter('{');

			// Statement List
			this.parseStatementList();

			// }
			this.matchCharacter('}');

			this.CST.endChildren();
		}
		/**
		* Statement List
		*/
		public parseStatementList() {

			this.CST.addNode("StatementList", "Branch");

			if(this.currentToken.getValue() == "print" || this.currentToken.getKind() == "Identifier" || this.currentToken.getValue() == "while" || this.currentToken.getValue() == "{" || this.currentToken.getKind() == "Type" || this.currentToken.getValue() == "if" ){

				// Statement
				this.parseStatement();

				// StatementList
				this.parseStatementList();
			}
			else  {
				this.CST.endChildren();
				// Do Nothing
				return;
			}
			this.CST.endChildren();
		}
		/**
		* Statement
		*/
		public parseStatement() {

			this.CST.addNode("Statement" , "Branch");

			// Print Statement
			if(this.currentToken.getValue() == "print"){
				this.parsePrintStatement();
			}
			// Assignment Statement
			else if (this.currentToken.getKind() == "Identifier"){
				this.parseAssignmentStatement();
			}
			// Var Decl
			else if(this.currentToken.getKind() == "Type"){
				this.parseVarDecl();
			}
			// While Statement
			else if(this.currentToken.getValue() == "while"){
				this.parseWhileStatement();
			}
			// If Statement
			else if(this.currentToken.getValue() == "if"){
				this.parseIfStatement();
			}
			// Block Statement
			else if(this.currentToken.getValue() == "{"){
				this.parseBlock();
			}
			
			this.CST.endChildren();
		}
		/**
		* Print Statement
		*/
		public parsePrintStatement(){

			this.CST.addNode("PrintStatement", "Branch");
			
			// Print
			this.matchCharacter("print");

			// Match (
			this.matchCharacter("(");

			// Expression
			this.parseExpression();

			// Match )
			this.matchCharacter(")");

			this.CST.endChildren();
		}
		/**
		* Assignment Statement
		*/
		public parseAssignmentStatement(){

			this.CST.addNode("AssignmentStatement", "Branch");
			
			// Identifier
			this.parseIdentifier();

			// =
			this.matchCharacter("=");

			// Expression
			this.parseExpression();

			this.CST.endChildren();
		}
		/**
		* Variable Declaration Statement
		*/
		public parseVarDecl() {

			this.CST.addNode("VarDecl", "Branch");
			
			// Type
			this.parseType();

			// Identifier
			this.parseIdentifier();

			this.CST.endChildren();
		}
		/**
		* While Statement
		*/
		public parseWhileStatement(){

			this.CST.addNode("WhileStatement", "Branch");
			
			// While
			this.matchCharacter("while")

			// Boolean Expression
			this.parseBooleanExpression();

			// Block
			this.parseBlock();

			this.CST.endChildren();
		}
		/**
		* If Statement
		*/
		public parseIfStatement(){

			this.CST.addNode("IfStatement", "Branch");
			
			// If
			this.matchCharacter("if");

			// Boolean Expression
			this.parseBooleanExpression();

			// Block
			this.parseBlock();

			this.CST.endChildren();
		}
		/**
		* Expression
		*/
		public parseExpression(){

			this.CST.addNode("Expression", "Branch");

			// INT
			if(this.currentToken.getKind() == "Digit"){
				this.parseIntegerExpression();
			}
			// STRING
			else if(this.currentToken.getKind() == "String"){
				this.parseStringExpression();
			}
			// BOOLEAN
			else if(this.currentToken.getKind() == "BoolVal" || this.currentToken.getValue() == "(" ){
				this.parseBooleanExpression();
			}
			// ID
			else if (this.currentToken.getKind() == "Identifier") {
				this.parseIdentifier();
			}
			else {

				this.matchCharacter("Expression");
			}
			this.CST.endChildren();
		}
		/**
		* Int Expression
		*/
		public parseIntegerExpression(){

			this.CST.addNode("IntegerExpression", "Branch");

			// Parse Digit
			this.parseDigit();

			// Check to see what next
			if(this.currentToken.getValue() == "+"){
				this.parseIntegerOperator();
				this.parseExpression();
			}

			this.CST.endChildren();
		}
		/**
		* String Expression
		*/
		public parseStringExpression(){

			this.CST.addNode("StringExpression", "Branch");
			
			var currentToken = this.currentToken.getValue();
			
			this.matchCharacter(currentToken);

			this.CST.endChildren();
		}
		/**
		* Boolean Expression
		*/
		public parseBooleanExpression(){

			this.CST.addNode("BooleanStatement", "Branch");
		
			if(this.currentToken.getValue() == "("){
				console.log("Para found");
				this.matchCharacter("(");

				this.parseExpression();

				this.parseBooleanOperator();

				this.parseExpression();

				this.matchCharacter(")");
			}
			else{
				this.parseBooleanValue();
			}
			this.CST.endChildren();
		}
		/**
		* Identifier
		*/
		public parseIdentifier() {
			this.CST.addNode("Identifier", "Branch");

			if (this.currentToken.getKind() == "Identifier") {
				var currentValue = this.currentToken.getValue();
				
				this.matchCharacter(currentValue);
			}
			this.CST.endChildren();
		}
		/**
		* Character List
		*/
		public parseCharacterList() {

			
		}
		/**
		* Type
		*/
		public parseType() {

			this.CST.addNode("Type", "Branch");
			if(this.currentToken.getValue() == "int"){
				
				this.matchCharacter("int");
			}
			else if(this.currentToken.getValue() == "string"){
				
				this.matchCharacter("string");
			}
			else if(this.currentToken.getValue() == "boolean"){
				
				this.matchCharacter("boolean");
			}
			this.CST.endChildren();
		}
		/**
		* Character
		*/
		public parseCharacter(){

		}
		/**
		* Digit
		*/
		public parseDigit(){

			this.CST.addNode("Digit", "Branch");
			if (this.currentToken.getKind() == "Digit") {

				var currentValue = this.currentToken.getValue();
				
				this.matchCharacter(currentValue);
			}
			this.CST.endChildren();
		}
		/**
		* Boolean Operator
		*/
		public parseBooleanOperator() {

			this.CST.addNode("BooleanOperator", "Branch");

			if(this.currentToken.getValue() == "=") {

				// =
				this.matchCharacter("=");

				// =
				this.matchCharacter("=");
			}
			else { 

				// !
				this.matchCharacter("!");

				// =
				this.matchCharacter("=");
			}
			this.CST.endChildren();
		}
		/**
		* Boolean Value
		*/
		public parseBooleanValue() {

			this.CST.addNode("BooleanValue", "Branch");
			
			if(this.currentToken.getKind() == "BoolVal"){
				
				var currentValue = this.currentToken.getValue();

				this.matchCharacter(currentValue);
			}
			this.CST.endChildren();
		}
		/**
		* Integer Operator
		*/
		public parseIntegerOperator() {
			this.CST.addNode("IntegerOperator" , "Branch")
			// +
			this.matchCharacter("+");
			
			this.CST.endChildren();
		}
		public traverseCST() {

			this.AST = new JOEC.Tree();
			this.evaluateBlock(this.CST.rootNode.children[0]);
		}
		public evaluateBlock(node: JOEC.TreeNode){

			if (node.name == "Block") {

				this.AST.addNode("Block", "Branch");

				// Get the list of statements that needs to be run before the block closes
				var StatmentList = node.children[1];
				this.evaluateStatementList(StatmentList);

				this.AST.endChildren();
			}
		}
		public evaluateStatementList(node:JOEC.TreeNode){
			
			// Check the number of children
			if(node.children.length == 2){
				this.evaluateStatement(node.children[0]);
				this.evaluateStatementList(node.children[1]);
			}
		}
		public evaluateStatement(theNode: JOEC.TreeNode) {

			var node = theNode.children[0];

			if (node.name == "VarDecl") {
				this.AST.addNode("Variable Declaration", "Branch");
				this.AST.addNode(node.children[0].children[0].name, "Leaf");
				this.AST.addNode(node.children[1].children[0].name, "Leaf");
				this.AST.endChildren();
			}
			else if(node.name == "Block"){
				this.evaluateBlock(node);
			}
			else if (node.name == "PrintStatement") {
				this.AST.addNode("Print", "Branch");
				this.evaluateExpression(node.children[2]);
				this.AST.endChildren();
			}
			else if (node.name == "AssignmentStatement") {
				this.AST.addNode("Assign", "Branch");
				this.AST.addNode(node.children[0].children[0].name, "Leaf");
				this.evaluateExpression(node.children[2]);
				this.AST.endChildren();
			}
			else if (node.name == "IfStatement") {
				this.AST.addNode("If", "Branch");
				this.evaluateBooleanExpression(node.children[1]);
				this.evaluateBlock(node.children[2])
				this.AST.endChildren();
			}
			else if (node.name == "WhileStatement") {
				this.AST.addNode("While", "Branch");
				this.evaluateBooleanExpression(node.children[1]);
				this.evaluateBlock(node.children[2])
				this.AST.endChildren();
			}
		}
		public evaluateExpression(node: JOEC.TreeNode) {

			var childNode: JOEC.TreeNode = node.children[0];
			
			// Integer Expression
			if (childNode.name == "IntegerExpression"){

				if (childNode.children.length == 1) {
					this.AST.addNode(childNode.children[0].children[0].name, "Leaf", childNode.children[0].children[0].type);
				}
				else if (childNode.children.length == 3) {
					this.AST.addNode("+", "Branch");
					this.AST.addNode(childNode.children[0].children[0].name, "Leaf" , childNode.children[0].children[0].type);
					this.evaluateExpression(childNode.children[2]);
					this.AST.endChildren();
				}
			}
			// String Expression
			else if (childNode.name == "StringExpression") {
				this.AST.addNode(childNode.children[0].name, "Leaf", childNode.children[0].type , childNode.children[0].lineNumber);
			}
			// Boolean Expression
			else if (childNode.name == "BooleanStatement") {
				this.evaluateBooleanExpression(childNode);
			}
			// Identifier Expression
			else if (childNode.name == "Identifier") {
				this.AST.addNode(childNode.children[0].name, "Branch", childNode.children[0].type , childNode.children[0].lineNumber);
				this.AST.endChildren();
			}
		}
		public evaluateBooleanExpression(node: JOEC.TreeNode){

			if (node.children.length == 1) {
				this.AST.addNode(node.children[0].children[0].name, "Leaf", node.children[0].children[0].type, node.children[0].children[0].lineNumber);
			}
			else if (node.children.length == 5) {

				// Find the important nodes
				var firstExpression = node.children[1];
				var boolOp = node.children[2];
				var secondExpression = node.children[3];

				// Combine the two parts of the boolean operator
				var boolOpName = boolOp.children[0].name + boolOp.children[1].name;

				// Construct the subtree
				this.AST.addNode(boolOpName, "Branch", "BoolVal", boolOp.children[0].lineNumber);
				this.evaluateExpression(firstExpression);
				this.evaluateExpression(secondExpression);
				this.AST.endChildren();
			}
		}
	}
}