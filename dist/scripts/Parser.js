///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
///<reference path="Main.ts"/>
///<reference path="queue.ts"/>
///<reference path="Tree.ts"/>o
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
                this.CST.addNode(this.currentToken.getValue(), "Leaf");
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
            this.CST = new JOEC.Tree();
            // Add the RootNode
            this.CST.addNode("Program", "Branch");
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
            this.CST.addNode("Block", "Branch");
            // {
            this.matchCharacter('{');
            // Statement List
            this.parseStatementList();
            // }
            this.matchCharacter('}');
            this.CST.endChildren();
        };
        /**
        * Statement List
        */
        Parser.prototype.parseStatementList = function () {
            this.CST.addNode("StatementList", "Branch");
            if (this.currentToken.getValue() == "print" || this.currentToken.getKind() == "Identifier" || this.currentToken.getValue() == "while" || this.currentToken.getValue() == "{" || this.currentToken.getKind() == "Type" || this.currentToken.getValue() == "if") {
                // Statement
                this.parseStatement();
                // StatementList
                this.parseStatementList();
            }
            else {
                this.CST.endChildren();
                // Do Nothing
                return;
            }
            this.CST.endChildren();
        };
        /**
        * Statement
        */
        Parser.prototype.parseStatement = function () {
            this.CST.addNode("Statement", "Branch");
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
            this.CST.endChildren();
        };
        /**
        * Print Statement
        */
        Parser.prototype.parsePrintStatement = function () {
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
        };
        /**
        * Assignment Statement
        */
        Parser.prototype.parseAssignmentStatement = function () {
            this.CST.addNode("AssignmentStatement", "Branch");
            // Identifier
            this.parseIdentifier();
            // =
            this.matchCharacter("=");
            // Expression
            this.parseExpression();
            this.CST.endChildren();
        };
        /**
        * Variable Declaration Statement
        */
        Parser.prototype.parseVarDecl = function () {
            this.CST.addNode("VarDecl", "Branch");
            // Type
            this.parseType();
            // Identifier
            this.parseIdentifier();
            this.CST.endChildren();
        };
        /**
        * While Statement
        */
        Parser.prototype.parseWhileStatement = function () {
            this.CST.addNode("WhileStatement", "Branch");
            // While
            this.matchCharacter("while");
            // Boolean Expression
            this.parseBooleanExpression();
            // Block
            this.parseBlock();
            this.CST.endChildren();
        };
        /**
        * If Statement
        */
        Parser.prototype.parseIfStatement = function () {
            this.CST.addNode("IfStatement", "Branch");
            // If
            this.matchCharacter("if");
            // Boolean Expression
            this.parseBooleanExpression();
            // Block
            this.parseBlock();
            this.CST.endChildren();
        };
        /**
        * Expression
        */
        Parser.prototype.parseExpression = function () {
            this.CST.addNode("Expression", "Branch");
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
            this.CST.endChildren();
        };
        /**
        * Int Expression
        */
        Parser.prototype.parseIntegerExpression = function () {
            this.CST.addNode("IntegerExpression", "Branch");
            // Parse Digit
            this.parseDigit();
            // Check to see what next
            if (this.currentToken.getValue() == "+") {
                this.parseIntegerOperator();
                this.parseExpression();
            }
            this.CST.endChildren();
        };
        /**
        * String Expression
        */
        Parser.prototype.parseStringExpression = function () {
            this.CST.addNode("StringExpression", "Branch");
            var currentToken = this.currentToken.getValue();
            this.matchCharacter(currentToken);
            this.CST.endChildren();
        };
        /**
        * Boolean Expression
        */
        Parser.prototype.parseBooleanExpression = function () {
            this.CST.addNode("BooleanStatement", "Branch");
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
            this.CST.endChildren();
        };
        /**
        * Identifier
        */
        Parser.prototype.parseIdentifier = function () {
            this.CST.addNode("Identifier", "Branch");
            if (this.currentToken.getKind() == "Identifier") {
                var currentValue = this.currentToken.getValue();
                this.matchCharacter(currentValue);
            }
            this.CST.endChildren();
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
            this.CST.addNode("Type", "Branch");
            if (this.currentToken.getValue() == "int") {
                this.matchCharacter("int");
            }
            else if (this.currentToken.getValue() == "string") {
                this.matchCharacter("string");
            }
            else if (this.currentToken.getValue() == "boolean") {
                this.matchCharacter("boolean");
            }
            this.CST.endChildren();
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
            this.CST.addNode("Digit", "Branch");
            if (this.currentToken.getKind() == "Digit") {
                var currentValue = this.currentToken.getValue();
                this.matchCharacter(currentValue);
            }
            this.CST.endChildren();
        };
        /**
        * Boolean Operator
        */
        Parser.prototype.parseBooleanOperator = function () {
            this.CST.addNode("BooleanOperator", "Branch");
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
            this.CST.endChildren();
        };
        /**
        * Boolean Value
        */
        Parser.prototype.parseBooleanValue = function () {
            this.CST.addNode("BooleanValue", "Branch");
            if (this.currentToken.getKind() == "BoolVal") {
                var currentValue = this.currentToken.getValue();
                this.matchCharacter(currentValue);
            }
            this.CST.endChildren();
        };
        /**
        * Integer Operator
        */
        Parser.prototype.parseIntegerOperator = function () {
            this.CST.addNode("IntegerOperator", "Branch");
            // +
            this.matchCharacter("+");
            this.CST.endChildren();
        };
        Parser.prototype.traverseCST = function () {
            // // Make a new stack to use while iterating over the tree
            // var nodeStack = new JOEC.Stack();
            // // Make a new ast tree
            // this.AST = new JOEC.Tree();
            // // Add the root node to the stack to start the iteration
            // nodeStack.push(this.CST.rootNode);
            // // Mark the node as visited
            // this.CST.rootNode.visted = true;
            // // Loop till you iterate over every node in the tree
            // while (!nodeStack.isEmpty()) {
            // 	// Get the next node
            // 	var nextNode: JOEC.TreeNode = nodeStack.peek();
            // 	var childNode: JOEC.TreeNode = nextNode.getNextUnvistedChildNode();
            // 	// Check to see if any children exist
            // 	if (childNode != null) {
            // 		// Mark the node as visted
            // 		childNode.visted = true;
            // 		// Check to see if this is a trigger node
            // 		this.evaluateBlock(childNode);
            // 		// Add the node to the stack
            // 		nodeStack.push(childNode);
            // 	}
            // 	else {
            // 		// Pop the node off the stack
            // 		nodeStack.pop();
            // 	}
            // }
            //console.log("AST \n " + this.AST.toString());
            this.AST = new JOEC.Tree();
            this.evaluateBlock(this.CST.rootNode.children[0]);
        };
        Parser.prototype.evaluateBlock = function (node) {
            if (node.name == "Block") {
                this.AST.addNode("Block", "Branch");
                // Get the list of statements that needs to be run before the block closes
                var StatmentList = node.children[1];
                this.evaluateStatementList(StatmentList);
                this.AST.endChildren();
            }
        };
        Parser.prototype.evaluateStatementList = function (node) {
            console.log("Statement LIST");
            // Check the number of children
            if (node.children.length == 2) {
                this.evaluateStatement(node.children[0]);
                this.evaluateStatementList(node.children[1]);
            }
        };
        Parser.prototype.evaluateStatement = function (theNode) {
            var node = theNode.children[0];
            if (node.name == "VarDecl") {
                console.log("evaluating a statement");
                this.AST.addNode("Variable Declaration", "Branch");
                this.AST.addNode(node.children[0].children[0].name, "Leaf");
                this.AST.addNode(node.children[1].children[0].name, "Leaf");
                this.AST.endChildren();
            }
            else if (node.name == "Block") {
                this.evaluateBlock(node);
            }
            else if (node.name == "PrintStatement") {
                console.log("evaluating a statement");
                this.AST.addNode("Print", "Branch");
                this.evaluateExpression(node.children[2]);
                this.AST.endChildren();
            }
            else if (node.name == "AssignmentStatement") {
                console.log("evaluating a statement");
                this.AST.addNode("Assign", "Branch");
                this.AST.addNode(node.children[0].children[0].name, "Leaf");
                this.evaluateExpression(node.children[2]);
                this.AST.endChildren();
            }
            else if (node.name == "IfStatement") {
                console.log("evaluating a statement");
                this.AST.addNode("Variable Declaration", "Branch");
                this.AST.addNode(node.children[0].children[0].name, "Leaf");
                this.AST.addNode(node.children[1].children[0].name, "Leaf");
                this.AST.endChildren();
            }
        };
        Parser.prototype.evaluateExpression = function (node) {
            var childNode = node.children[0];
            // Integer Expression
            if (childNode.name == "IntegerExpression") {
                if (childNode.children.length == 1) {
                    this.AST.addNode(childNode.children[0].children[0].name, "Leaf");
                }
                else if (childNode.children.length == 3) {
                    this.AST.addNode("+", "Branch");
                    this.AST.addNode(childNode.children[0].children[0].name, "Leaf");
                    this.evaluateExpression(childNode.children[2]);
                    this.AST.endChildren();
                }
            }
            else if (childNode.name == "StringExpression") {
                this.AST.addNode(childNode.children[0].name, "Leaf");
            }
            else if (childNode.name == "BooleanStatement") {
                if (childNode.children.length == 1) {
                    this.AST.addNode(childNode.children[0].children[0].name, "Leaf");
                }
                else if (childNode.children.length == 5) {
                }
            }
            else if (childNode.name == "Identifier") {
                this.AST.addNode(childNode.children[0].name, "Branch");
                this.AST.endChildren();
            }
        };
        return Parser;
    })();
    JOEC.Parser = Parser;
})(JOEC || (JOEC = {}));
