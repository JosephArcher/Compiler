///<reference path="Tree.ts"/>
///<reference path="SymbolTable.ts"/>
///<reference path="TypeChecker.ts"/>
var JOEC;
(function (JOEC) {
    /*
    * Semantic Analyzer
    */
    var SemanticAnalyzer = (function () {
        function SemanticAnalyzer(CST, AST) {
            this.hasErrors = false; // Error Status
            this.CST = CST;
            this.AST = AST;
            this.SymbolTable = new JOEC.SymbolTable();
        }
        SemanticAnalyzer.prototype.scopeCheck = function () {
            this.generateSymbolTable();
        };
        SemanticAnalyzer.prototype.typeCheck = function () {
            // Create a type checker
            var typeChecker = new JOEC.TypeChecker(this.AST, this.SymbolTable);
            typeChecker.typeCheckAST();
            if (typeChecker.hasErrors) {
                this.hasErrors = true;
            }
        };
        SemanticAnalyzer.prototype.generateSymbolTable = function () {
            this.evaluateBlock(this.CST.rootNode.children[0]);
        };
        SemanticAnalyzer.prototype.checkForUnusedIdentifiers = function () {
            // Make a new stack to use while iterating over the tree
            var nodeStack = new JOEC.Stack();
            // Add the root node to the stack to start the iteration
            nodeStack.push(this.SymbolTable.rootScope);
            // Check the root node
            this.checkScope(this.SymbolTable.rootScope);
            // Mark the node as visited
            this.SymbolTable.rootScope.visted = true;
            // Loop till you iterate over every node in the tree
            while (!nodeStack.isEmpty()) {
                // Get the next node
                var nextNode = nodeStack.peek();
                var childNode = nextNode.getNextUnvistedChildNode();
                // Check to see if any children exist
                if (childNode != null) {
                    // Mark the node as visted
                    childNode.visted = true;
                    this.checkScope(childNode);
                    // Add the node to the stack
                    nodeStack.push(childNode);
                }
                else {
                    // Pop the node off the stack
                    nodeStack.pop();
                }
            }
        };
        SemanticAnalyzer.prototype.checkScope = function (node) {
            var scope = node.scopeStuff;
            var len = Object.keys(scope).length;
            for (var i = 0; i < len; i++) {
                var nextVariable = scope[Object.keys(scope)[i]];
                // Check each variable and if the value is null then report a warning to the user
                if (nextVariable.value == null) {
                    JOEC.Utils.createNewWarningMessage("Warning: " + nextVariable.name + " is unused");
                }
                console.log(nextVariable);
            }
        };
        SemanticAnalyzer.prototype.evaluateBlock = function (node) {
            // Add a new scope to the symbol table
            this.SymbolTable.addNewScope();
            // Get the list of statements that needs to be run before the block closes
            var StatmentList = node.children[1];
            this.evaluateStatementList(StatmentList);
            // End a scope
            this.SymbolTable.endScope();
        };
        SemanticAnalyzer.prototype.evaluateStatementList = function (node) {
            // Check the number of children
            if (node.children.length == 2) {
                this.evaluateStatement(node.children[0]);
                this.evaluateStatementList(node.children[1]);
            }
        };
        SemanticAnalyzer.prototype.evaluateStatement = function (theNode) {
            var node = theNode.children[0];
            // Variable Declaration
            if (node.name == "VarDecl") {
                // Declare a new variable
                this.SymbolTable.declareVariable(node.children[1].children[0].name, node.children[0].children[0].name);
            }
            else if (node.name == "Block") {
                this.evaluateBlock(node);
            }
            else if (node.name == "PrintStatement") {
                this.evaluateExpression(node.children[2]);
            }
            else if (node.name == "AssignmentStatement") {
                //First lookup the variable to see if one is in scope
                var variable = this.SymbolTable.lookupVariable(node.children[0].children[0].name);
                console.log(this.SymbolTable);
                // If a variable exists
                if (variable != null) {
                    // Evaluate the expression
                    var results = this.evaluateExpression(node.children[2]);
                    // Assign the variable
                    this.SymbolTable.assignVariable(node.children[0].children[0].name, "results");
                }
                else {
                    // Undeclared Identifier
                    JOEC.Utils.createNewErrorMessage("Undeclared identifier [ " + node.children[0].children[0].name + " ] on line " + node.children[0].children[0].lineNumber);
                    this.hasErrors = true;
                }
            }
            else if (node.name == "IfStatement") {
                this.evaluateBooleanExpression(node.children[1]);
                this.evaluateBlock(node.children[2]);
            }
            else if (node.name == "WhileStatement") {
                this.evaluateBooleanExpression(node.children[1]);
                this.evaluateBlock(node.children[2]);
            }
        };
        SemanticAnalyzer.prototype.evaluateExpression = function (node) {
            var childNode = node.children[0];
            // Integer Expression
            if (childNode.name == "IntegerExpression") {
                if (childNode.children.length == 1) {
                }
                else if (childNode.children.length == 3) {
                    this.evaluateExpression(childNode.children[2]);
                }
            }
            else if (childNode.name == "StringExpression") {
                return childNode.children[0];
            }
            else if (childNode.name == "BooleanStatement") {
                this.evaluateBooleanExpression(childNode);
            }
            else if (childNode.name == "Identifier") {
                if (this.SymbolTable.lookupVariable(childNode.children[0].name) != null) {
                    return childNode.children[0];
                }
                else {
                    // Undeclared Identifier
                    JOEC.Utils.createNewErrorMessage("Undeclared identifier [ " + childNode.children[0].name + " ] on line " + childNode.children[0].lineNumber);
                    this.hasErrors = true;
                }
            }
        };
        SemanticAnalyzer.prototype.evaluateBooleanExpression = function (node) {
            if (node.children.length == 1) {
                return node.children[0].children[0];
            }
            else if (node.children.length == 5) {
                // Find the important nodes
                var firstExpression = node.children[1];
                var boolOp = node.children[2];
                var secondExpression = node.children[3];
                var boolOpName = boolOp.children[0].name + boolOp.children[1].name;
                this.evaluateExpression(firstExpression);
                this.evaluateExpression(secondExpression);
            }
        };
        return SemanticAnalyzer;
    })();
    JOEC.SemanticAnalyzer = SemanticAnalyzer;
})(JOEC || (JOEC = {}));
