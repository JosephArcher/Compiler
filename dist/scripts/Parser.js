///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
///<reference path="Main.ts"/>
///<reference path="queue.ts"/>
/**
* Parser
*/
var JOEC;
(function (JOEC) {
    var Parser = (function () {
        // Constructor
        function Parser() {
            // False if no error | True if any error
            this.hasErrors = false;
            // Holds the Tokens
            this.tokenQueue = new JOEC.Queue();
        }
        /**
        *	Called to start the parser
        */
        Parser.prototype.startParse = function (tokenArray) {
            var len = tokenArray.length;
            for (var i = 0; i < len; i++) {
                this.tokenQueue.enqueue(tokenArray[i]);
            }
            // Parse Program
            this.parseProgram();
        };
        /**
        * Used to match the current token and then get the
        */
        Parser.prototype.matchCharacter = function (toMatch) {
            if (this.currentToken.getValue() == toMatch) {
                console.log("A match was found for " + toMatch);
                this.currentToken = this.tokenQueue.dequeue();
            }
            else {
                console.log("Error no match was found");
                JOEC.Utils.createNewErrorMessage("Expecting " + toMatch + " but found  \' " + this.currentToken.getValue() + " \' on line " + this.currentToken.getLineNumber());
                this.hasErrors = true;
            }
        };
        /**
        * Program
        */
        Parser.prototype.parseProgram = function () {
            // Get the first character
            this.currentToken = this.tokenQueue.dequeue();
            // Block
            this.parseBlock();
            // Dollar Sign
            this.matchCharacter('$');
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
            console.log("Expression");
            // INT
            if (this.currentToken.getKind() == "Digit") {
                this.parseIntegerExpression();
            }
            else if (this.currentToken.getKind() == "String") {
                this.parseStringExpression();
            }
            else if (this.currentToken.getKind() == "BoolVal" || this.currentToken.getValue() == "(") {
                console.log("BOOLEAN");
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
            //this.matchCharacter("\"");
            // while (CurrentCharacter)
            //this.parseCharacterList();
            //this.matchCharacter("\"");
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
