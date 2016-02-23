///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
///<reference path="Main.ts"/>
///<reference path="queue.ts"/>

/**
* Parser 
*/
module JOEC {

	export class Parser {	
		
		public currentToken: JOEC.Token;

		// False if no error | True if any error
		public hasErrors: boolean = false;

		// Holds the Tokens
		public tokenQueue = new Queue();

		// Constructor
		constructor() {}

		/**
		*	Called to start the parser
		*/
		public startParse(tokenArray) {

			var len = tokenArray.length;

			for (var i = 0; i < len; i++){
				this.tokenQueue.enqueue(tokenArray[i]);
			}

			// Parse Program
			this.parseProgram();

		}
		/**
		* Used to match the current token and then get the 
		*/
		public matchCharacter(toMatch: string) {

			if(this.currentToken.getValue() == toMatch){

				console.log("A match was found for " + toMatch);
				this.currentToken = this.tokenQueue.dequeue();
			}
			else{
				console.log("Error no match was found");
				Utils.createNewErrorMessage("Expecting " + toMatch + " but found  \' " + this.currentToken.getValue() + " \' on line " + this.currentToken.getLineNumber());
				this.hasErrors = true;
			}
		}
		/**
		* Program
		*/
		public parseProgram () {

			// Get the first character
			this.currentToken= <JOEC.Token> this.tokenQueue.dequeue();

			// Block
			this.parseBlock();

			// Dollar Sign
			this.matchCharacter('$');
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
			else {

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
			else if(this.currentToken.getKind() == "BoolVal"){
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

			//this.matchCharacter("\"");

			// while (CurrentCharacter)
			//this.parseCharacterList();

			//this.matchCharacter("\"");
		}
		/**
		* Boolean Expression
		*/
		public parseBooleanExpression(){

			if(this.currentToken.getValue() == "("){

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