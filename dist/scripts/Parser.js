///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
///<reference path="Main.ts"/>
///<reference path="queue.ts"/>
var JOEC;
(function (JOEC) {
    var Parser = (function () {
        function Parser() {
            this.hasErrors = false;
            this.tokenQueue = new JOEC.Queue();
        }
        /**
        *	Called to start the parser
        */
        Parser.prototype.startParse = function (tokenArray) {
            console.log(tokenArray);
            var len = tokenArray.length;
            for (var i = 0; i < len; i++) {
                console.log(i);
                this.tokenQueue.enqueue(tokenArray[i]);
            }
            this.parseProgram();
        };
        Parser.prototype.matchCharacter = function (theCharacter) {
            if (this.currentToken.getValue() == theCharacter) {
                console.log("A match was found for " + theCharacter);
                this.currentToken = this.tokenQueue.dequeue();
            }
            else {
                console.log("Error no match was found");
                JOEC.Main.createNewErrorMessage("Expecting " + theCharacter + " but found " + this.currentToken.getValue());
            }
        };
        /**
        *
        */
        Parser.prototype.parseProgram = function () {
            console.log(this.tokenQueue);
            // Get the first character
            this.currentToken = this.tokenQueue.dequeue();
            console.log(this.currentToken);
            // Block
            this.parseBlock();
            // Dollar Sign
            if (this.currentToken.getValue() == '$') {
                this.matchCharacter('$');
            }
        };
        Parser.prototype.parseBlock = function () {
            this.matchCharacter('{');
            this.parseStatementList();
            this.matchCharacter('}');
        };
        Parser.prototype.parseStatementList = function () {
            console.log(this.currentToken.getValue());
            if (this.currentToken.getValue() == "print" || this.currentToken.getKind() == "Identifier" || this.currentToken.getValue() == "while" || this.currentToken.getValue() == "{" || this.currentToken.getKind() == "type" || this.currentToken.getValue() == "if") {
                this.parseStatement();
                this.parseStatementList();
            }
            else {
                return;
            }
        };
        Parser.prototype.parseStatement = function () {
            console.log("statement");
            // Print Statement
            if (this.currentToken.getValue() == "print") {
                this.parsePrintStatement();
            }
            else if (this.currentToken.getKind() == "Identifier") {
                this.parseAssignmentStatement();
            }
            else if (this.currentToken.getKind() == "type") {
                this.parseVarDecl();
            }
            else if (this.currentToken.getValue() == "while") {
                this.parseWhileStatement();
            }
            else if (this.currentToken.getValue() == "if") {
                this.parseIfStatement();
            }
            else if (this.currentToken.getValue() == "{") {
                this.parseBlock();
            }
        };
        Parser.prototype.parsePrintStatement = function () {
            // Print
            this.matchCharacter("print");
            // Match (
            this.matchCharacter("(");
            // EXPR
            this.parseExpr();
            // Match )
            this.matchCharacter(")");
        };
        Parser.prototype.parseAssignmentStatement = function () {
            console.log("Parsing Assignment Statement");
            // ID
            this.parseId();
            this.matchCharacter("=");
            // Expr
            this.parseExpr();
        };
        Parser.prototype.parseVarDecl = function () {
            this.parseType();
            this.parseId();
        };
        Parser.prototype.parseWhileStatement = function () {
            this.matchCharacter("while");
            this.parseBooleanExpr();
            this.parseBlock();
        };
        Parser.prototype.parseIfStatement = function () {
            this.matchCharacter("if");
            this.parseBooleanExpr();
            this.parseBlock();
        };
        Parser.prototype.parseExpr = function () {
            // INT
            if (this.currentToken.getKind() == "digit") {
                this.parseIntExpr();
            }
            else if (this.currentToken.getValue() == "\"") {
                this.parseStringExpr();
            }
            else if (this.currentToken.getKind() == "boolVal") {
                this.parseBooleanExpr();
            }
            else if (this.currentToken.getKind() == "Identifier") {
                this.parseId();
            }
        };
        Parser.prototype.parseIntExpr = function () {
            // Parse Digit
            this.parseDigit();
            // Check to see what next
            if (this.currentToken.getValue() == "+") {
                this.parseIntOp();
                this.parseExpr();
            }
        };
        Parser.prototype.parseStringExpr = function () {
            this.matchCharacter("\"");
            this.parseCharList();
            this.matchCharacter("\"");
        };
        Parser.prototype.parseBooleanExpr = function () {
            if (this.currentToken.getValue() == "(") {
                this.matchCharacter("(");
                this.parseExpr();
                this.parseBoolOp();
                this.parseExpr();
                this.matchCharacter(")");
            }
            else {
                this.parseBoolVal();
            }
        };
        Parser.prototype.parseId = function () {
            console.log("ID");
            if (this.currentToken.getKind() == "Identifier") {
                var currentValue = this.currentToken.getValue();
                this.matchCharacter(currentValue);
            }
        };
        Parser.prototype.parseCharList = function () {
        };
        Parser.prototype.parseType = function () {
            if (this.currentToken.getValue() == "int") {
                this.matchCharacter("int");
            }
            else if (this.currentToken.getValue() == "string") {
                this.matchCharacter("string");
            }
            else if (this.currentToken.getValue() == "boolean") {
                this.matchCharacter("boolean");
            }
        };
        Parser.prototype.parseChar = function () {
        };
        Parser.prototype.parseDigit = function () {
            if (this.currentToken.getKind() == "digit") {
                var currentValue = this.currentToken.getValue();
                this.matchCharacter(currentValue);
            }
        };
        Parser.prototype.parseBoolOp = function () {
        };
        Parser.prototype.parseBoolVal = function () {
            console.log("OUTSIDE");
            if (this.currentToken.getKind() == "BoolVal") {
                console.log("inside");
                var currentValue = this.currentToken.getValue();
                this.matchCharacter(currentValue);
            }
        };
        Parser.prototype.parseIntOp = function () {
        };
        return Parser;
    })();
    JOEC.Parser = Parser;
})(JOEC || (JOEC = {}));
