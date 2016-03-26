///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
///<reference path="Main.ts"/>
///<reference path="queue.ts"/>
///<reference path="Tree.ts"/>
///<reference path="TreeNode.ts"/>

module JOEC {
	/*
	* Parser 
	*/
	export class Parser {	
		
		public currentToken: JOEC.Token;     // The current token 
		public hasErrors: boolean = false;   // Determines if the parser has any errors
		public tokenQueue = new Queue();     // Holds the tokens passed in from the lexer
		public numberOfPrograms: number = 0; // The number of programs that have been parsed

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
					this.currentToken = this.tokenQueue.dequeue();
				}
				else {
					if(!this.hasErrors){
						Utils.createNewErrorMessage("Expecting " + toMatch + " but found  \' " + this.currentToken.getValue() + " \' on line " + this.currentToken.getLineNumber());
						this.hasErrors = true;
					}
					
				}
		}
		/**
		* Program
		*/
		public parseProgram () {

			Utils.createNewMessage("Parsing Program " + this.numberOfPrograms);

			// Get the first character
			this.currentToken= <JOEC.Token> this.tokenQueue.dequeue();

			// Start to generate a concrete syntax tree


			// Block
			this.parseBlock();

			// Dollar Sign
			this.matchCharacter('$');

			if(!this.hasErrors) {

				Utils.createNewMessage("Program " + this.numberOfPrograms + " successfully parsed");

				// Check to see if more tokens still exist
				if (this.tokenQueue.getSize() > 0) {
				
					// If they do call the parse program another time
					this.runAnotherProgram();
				}	
			}
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

			// {
			this.matchCharacter('{');

			// Statement List
			this.parseStatementList();

			// }
			this.matchCharacter('}');
		}
		/**
		* Statement List
		*/
		public parseStatementList() {

			if(this.currentToken.getValue() == "print" || this.currentToken.getKind() == "Identifier" || this.currentToken.getValue() == "while" || this.currentToken.getValue() == "{" || this.currentToken.getKind() == "Type" || this.currentToken.getValue() == "if" ){

				// Statement
				this.parseStatement();

				// StatementList
				this.parseStatementList();
			}
			else  {

				// Do Nothing
				return;
			}
		}
		/**
		* Statement
		*/
		public parseStatement() {

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
		}
		/**
		* Print Statement
		*/
		public parsePrintStatement(){

			// Print
			this.matchCharacter("print");

			// Match (
			this.matchCharacter("(");

			// Expression
			this.parseExpression();

			// Match )
			this.matchCharacter(")");

		}
		/**
		* Assignment Statement
		*/
		public parseAssignmentStatement(){

			// Identifier
			this.parseIdentifier();

			// =
			this.matchCharacter("=");

			// Expression
			this.parseExpression();
		}
		/**
		* Variable Declaration Statement
		*/
		public parseVarDecl() {

			// Type
			this.parseType();

			// Identifier
			this.parseIdentifier();
		}
		/**
		* While Statement
		*/
		public parseWhileStatement(){

			// While
			this.matchCharacter("while")

			// Boolean Expression
			this.parseBooleanExpression();

			// Block
			this.parseBlock();

		}
		/**
		* If Statement
		*/
		public parseIfStatement(){

			// If
			this.matchCharacter("if");

			// Boolean Expression
			this.parseBooleanExpression();

			// Block
			this.parseBlock();
		}
		/**
		* Expression
		*/
		public parseExpression(){


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
		}
		/**
		* Int Expression
		*/
		public parseIntegerExpression(){

			// Parse Digit
			this.parseDigit();

			// Check to see what next
			if(this.currentToken.getValue() == "+"){
				this.parseIntegerOperator();
				this.parseExpression();
			}

		}
		/**
		* String Expression
		*/
		public parseStringExpression(){
			
			var currentToken = this.currentToken.getValue();
			this.matchCharacter(currentToken);
		}
		/**
		* Boolean Expression
		*/
		public parseBooleanExpression(){

			console.log("Boolean Express");
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
		}
		/**
		* Identifier
		*/
		public parseIdentifier() {

			if (this.currentToken.getKind() == "Identifier") {
				var currentValue = this.currentToken.getValue();
				this.matchCharacter(currentValue);
			}

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
			if(this.currentToken.getValue() == "int"){
				this.matchCharacter("int");
			}
			else if(this.currentToken.getValue() == "string"){
				this.matchCharacter("string");
			}
			else if(this.currentToken.getValue() == "boolean"){
				this.matchCharacter("boolean");
			}
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

			if (this.currentToken.getKind() == "Digit") {
				var currentValue = this.currentToken.getValue();
				this.matchCharacter(currentValue);
			}
		}
		/**
		* Boolean Operator
		*/
		public parseBooleanOperator() {

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

		}
		/**
		* Boolean Value
		*/
		public parseBooleanValue() {
			
			if(this.currentToken.getKind() == "BoolVal"){
				
				var currentValue = this.currentToken.getValue();

				this.matchCharacter(currentValue);
			}
		}
		/**
		* Integer Operator
		*/
		public parseIntegerOperator() {

			// +
			this.matchCharacter("+");
		}
	}
}