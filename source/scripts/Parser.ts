///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
///<reference path="Main.ts"/>
///<reference path="queue.ts"/>

module JOEC {

	export class Parser {	
	
		public currentToken: JOEC.Token;
		public hasErrors: boolean = false;
		public tokenQueue = new Queue();

		constructor() {

		}
		/**
		*	Called to start the parser
		*/
		public startParse(tokenArray){
			console.log(tokenArray);
			var len = tokenArray.length;
			for (var i = 0; i < len; i++){
				console.log(i);
				this.tokenQueue.enqueue(tokenArray[i]);
			}
			this.parseProgram();

		}
		public matchCharacter(theCharacter: string) {

			if(this.currentToken.getValue() == theCharacter){

				console.log("A match was found for " + theCharacter);
				this.currentToken = this.tokenQueue.dequeue();
			}
			else{
				console.log("Error no match was found");
				Main.createNewErrorMessage("Expecting " + theCharacter + " but found " + this.currentToken.getValue());
			}
		}
		/**
		*
		*/
		public parseProgram () {

			console.log(this.tokenQueue);
			// Get the first character
			this.currentToken= <JOEC.Token> this.tokenQueue.dequeue();

			console.log(this.currentToken);
			// Block
			this.parseBlock();

			// Dollar Sign
			if(this.currentToken.getValue() == '$'){
				this.matchCharacter('$');
			}

		}
		public parseBlock() {

				this.matchCharacter('{');
				this.parseStatementList();
				this.matchCharacter('}');
		}
		public parseStatementList(){
			console.log(this.currentToken.getValue());

			if(this.currentToken.getValue() == "print" || this.currentToken.getKind() == "Identifier" || this.currentToken.getValue() == "while" || this.currentToken.getValue() == "{" || this.currentToken.getKind() == "type" || this.currentToken.getValue() == "if" ){
				this.parseStatement();
				this.parseStatementList();
			}
			else{
				return;
			}

		}
		public parseStatement() {

			console.log("statement");
			// Print Statement
			if(this.currentToken.getValue() == "print"){
				this.parsePrintStatement();
			}
			// Assignment Statement
			else if (this.currentToken.getKind() == "Identifier"){
				this.parseAssignmentStatement();
			}
			// Var Decl
			else if(this.currentToken.getKind() == "type"){
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
		public parsePrintStatement(){

			// Print
			this.matchCharacter("print");

			// Match (
			this.matchCharacter("(");

			// EXPR
			this.parseExpr();

			// Match )
			this.matchCharacter(")");

		}
		public parseAssignmentStatement(){

			console.log("Parsing Assignment Statement");
			// ID
			this.parseId();

			this.matchCharacter("=");

			// Expr
			this.parseExpr();
		}
		public parseVarDecl() {
			this.parseType();
			this.parseId();
		}
		public parseWhileStatement(){

			this.matchCharacter("while")

			this.parseBooleanExpr();

			this.parseBlock();

		}
		public parseIfStatement(){

			this.matchCharacter("if");

			this.parseBooleanExpr();

			this.parseBlock();

		}
		public parseExpr(){

			// INT
			if(this.currentToken.getKind() == "digit"){
				this.parseIntExpr();
			}
			// STRING
			else if(this.currentToken.getValue() == "\""){
				this.parseStringExpr();
			}
			// BOOLEAN
			else if(this.currentToken.getKind() == "boolVal"){
				this.parseBooleanExpr();
			}
			// ID
			else if (this.currentToken.getKind() == "Identifier") {
				this.parseId();
			}
		}
		public parseIntExpr(){
			// Parse Digit
			this.parseDigit();

			// Check to see what next
			if(this.currentToken.getValue() == "+"){
				this.parseIntOp();
				this.parseExpr();
			}

		}
		public parseStringExpr(){

			this.matchCharacter("\"");

			this.parseCharList();

			this.matchCharacter("\"");
		}
		public parseBooleanExpr(){

			if(this.currentToken.getValue() == "("){

				this.matchCharacter("(");

				this.parseExpr();

				this.parseBoolOp();

				this.parseExpr();

				this.matchCharacter(")");
			}
			else{
				this.parseBoolVal();
			}
		}
		public parseId(){
			console.log("ID");
			if (this.currentToken.getKind() == "Identifier") {
				var currentValue = this.currentToken.getValue();
				this.matchCharacter(currentValue);
			}

		}
		public parseCharList(){

			
		}
		public parseType(){
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
		public parseChar(){

		}
		public parseDigit(){

			if (this.currentToken.getKind() == "digit") {
				var currentValue = this.currentToken.getValue();
				this.matchCharacter(currentValue);
			}
		}
		public parseBoolOp(){

		}
		public parseBoolVal(){
			console.log("OUTSIDE");
			if(this.currentToken.getKind() == "BoolVal"){
				console.log("inside");
				var currentValue = this.currentToken.getValue();
				this.matchCharacter(currentValue);
			}



		}
		public parseIntOp(){

		}
	}
}