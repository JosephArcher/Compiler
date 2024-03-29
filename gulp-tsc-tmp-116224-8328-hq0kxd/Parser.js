///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
///<reference path="Main.ts"/>
///<reference path="queue.ts"/>
///<reference path="Tree.ts"/>
///<reference path="TreeNode.ts"/>
var JOEC;
(function (JOEC) {
    /*
    * Parser
    */
    var Parser = (function () {
        // Constructor
        function Parser() {
            this.hasErrors = false; // Determines if the parser has any errors
            this.tokenQueue = new JOEC.Queue(); // Holds the tokens passed in from the lexer
            this.numberOfPrograms = 0; // The number of programs that have been parsed
        }
        /**
        * startParse
        *
        * Called to start the parser
        *
        * Params
        * 	tokenArray - the array of tokens created in the lexer
        */
        Parser.prototype.startParse = function (tokenArray) {
            var len = tokenArray.length;
            // Loop over the array and add the tokens to queue for ease of use
            for (var i = 0; i < len; i++) {
                this.tokenQueue.enqueue(tokenArray[i]);
            }
            // Parse Program
            this.parseProgram();
        };
        /**
        * matchCharacter
        *
        * Used to match what token you are expecting to get
        * with what the current token is
        *
        * Params
        * 	toMatch - the character you are expecting to encounter
        */
        Parser.prototype.matchCharacter = function (toMatch) {
            // Check to see if they match
            if (this.currentToken.getValue() == toMatch) {
                console.log("A match was found for " + toMatch);
                this.currentToken = this.tokenQueue.dequeue();
            }
            else {
                if (!this.hasErrors) {
                    JOEC.Utils.createNewErrorMessage("Expecting " + toMatch + " but found  \' " + this.currentToken.getValue() + " \' on line " + this.currentToken.getLineNumber());
                    this.hasErrors = true;
                }
            }
        };
        /**
        * Program
        */
        Parser.prototype.parseProgram = function () {
            JOEC.Utils.createNewMessage("Parsing Program " + this.numberOfPrograms);
            // Get the first character
            this.currentToken = this.tokenQueue.dequeue();
            // Start to generate a concrete syntax tree
            // Block
            this.parseBlock();
            // Dollar Sign
            this.matchCharacter('$');
            if (!this.hasErrors) {
                JOEC.Utils.createNewMessage("Program " + this.numberOfPrograms + " successfully parsed");
                // Check to see if more tokens still exist
                if (this.tokenQueue.getSize() > 0) {
                    // If they do call the parse program another time
                    this.runAnotherProgram();
                }
            }
        };
        Parser.prototype.runAnotherProgram = function () {
            // Increment the number of Programs counter
            this.numberOfPrograms++;
            JOEC.Utils.createNewMessage("\nParsing Program " + this.numberOfPrograms);
            // Block
            this.parseBlock();
            // Dollar Sign
            this.matchCharacter('$');
            JOEC.Utils.createNewMessage("Program " + this.numberOfPrograms + " successfully parsed");
            // Check to see if more tokens still exist
            if (this.tokenQueue.getSize() > 0) {
                // If they do call the parse program another time
                this.runAnotherProgram();
            }
        };
        /**
        * Block
        */
        Parser.prototype.parseBlock = function () {
            // {
            this.matchCharacter('{');
            // Statement List
            this.parseStatementList();
            // }
            this.matchCharacter('}');
        };
        /**
        * Statement List
        */
        Parser.prototype.parseStatementList = function () {
            if (this.currentToken.getValue() == "print" || this.currentToken.getKind() == "Identifier" || this.currentToken.getValue() == "while" || this.currentToken.getValue() == "{" || this.currentToken.getKind() == "Type" || this.currentToken.getValue() == "if") {
                // Statement
                this.parseStatement();
                // StatementList
                this.parseStatementList();
            }
            else {
                // Do Nothing
                return;
            }
        };
        /**
        * Statement
        */
        Parser.prototype.parseStatement = function () {
            // Print Statement
            if (this.currentToken.getValue() == "print") {
                this.parsePrintStatement();
            }
            else if (this.currentToken.getKind() == "Identifier") {
                this.parseAssignmentStatement();
            }
            else if (this.currentToken.getKind() == "Type") {
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
        /**
        * Print Statement
        */
        Parser.prototype.parsePrintStatement = function () {
            // Print
            this.matchCharacter("print");
            // Match (
            this.matchCharacter("(");
            // Expression
            this.parseExpression();
            // Match )
            this.matchCharacter(")");
        };
        /**
        * Assignment Statement
        */
        Parser.prototype.parseAssignmentStatement = function () {
            // Identifier
            this.parseIdentifier();
            // =
            this.matchCharacter("=");
            // Expression
            this.parseExpression();
        };
        /**
        * Variable Declaration Statement
        */
        Parser.prototype.parseVarDecl = function () {
            // Type
            this.parseType();
            // Identifier
            this.parseIdentifier();
        };
        /**
        * While Statement
        */
        Parser.prototype.parseWhileStatement = function () {
            // While
            this.matchCharacter("while");
            // Boolean Expression
            this.parseBooleanExpression();
            // Block
            this.parseBlock();
        };
        /**
        * If Statement
        */
        Parser.prototype.parseIfStatement = function () {
            // If
            this.matchCharacter("if");
            // Boolean Expression
            this.parseBooleanExpression();
            // Block
            this.parseBlock();
        };
        /**
        * Expression
        */
        Parser.prototype.parseExpression = function () {
            // INT
            if (this.currentToken.getKind() == "Digit") {
                this.parseIntegerExpression();
            }
            else if (this.currentToken.getKind() == "String") {
                this.parseStringExpression();
            }
            else if (this.currentToken.getKind() == "BoolVal" || this.currentToken.getValue() == "(") {
                this.parseBooleanExpression();
            }
            else if (this.currentToken.getKind() == "Identifier") {
                this.parseIdentifier();
            }
        };
        /**
        * Int Expression
        */
        Parser.prototype.parseIntegerExpression = function () {
            // Parse Digit
            this.parseDigit();
            // Check to see what next
            if (this.currentToken.getValue() == "+") {
                this.parseIntegerOperator();
                this.parseExpression();
            }
        };
        /**
        * String Expression
        */
        Parser.prototype.parseStringExpression = function () {
            var currentToken = this.currentToken.getValue();
            this.matchCharacter(currentToken);
        };
        /**
        * Boolean Expression
        */
        Parser.prototype.parseBooleanExpression = function () {
            console.log("Boolean Express");
            if (this.currentToken.getValue() == "(") {
                console.log("Para found");
                this.matchCharacter("(");
                this.parseExpression();
                this.parseBooleanOperator();
                this.parseExpression();
                this.matchCharacter(")");
            }
            else {
                this.parseBooleanValue();
            }
        };
        /**
        * Identifier
        */
        Parser.prototype.parseIdentifier = function () {
            if (this.currentToken.getKind() == "Identifier") {
                var currentValue = this.currentToken.getValue();
                this.matchCharacter(currentValue);
            }
        };
        /**
        * Character List
        */
        Parser.prototype.parseCharacterList = function () {
        };
        /**
        * Type
        */
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
        /**
        * Character
        */
        Parser.prototype.parseCharacter = function () {
        };
        /**
        * Digit
        */
        Parser.prototype.parseDigit = function () {
            if (this.currentToken.getKind() == "Digit") {
                var currentValue = this.currentToken.getValue();
                this.matchCharacter(currentValue);
            }
        };
        /**
        * Boolean Operator
        */
        Parser.prototype.parseBooleanOperator = function () {
            if (this.currentToken.getValue() == "=") {
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
        };
        /**
        * Boolean Value
        */
        Parser.prototype.parseBooleanValue = function () {
            if (this.currentToken.getKind() == "BoolVal") {
                var currentValue = this.currentToken.getValue();
                this.matchCharacter(currentValue);
            }
        };
        /**
        * Integer Operator
        */
        Parser.prototype.parseIntegerOperator = function () {
            // +
            this.matchCharacter("+");
        };
        return Parser;
    })();
    JOEC.Parser = Parser;
})(JOEC || (JOEC = {}));
