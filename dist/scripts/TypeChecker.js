///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
///<reference path="Main.ts"/>
///<reference path="queue.ts"/>
///<reference path="Tree.ts"/>
///<reference path="TreeNode.ts"/>
///<reference path="SymbolTable.ts"/>
var JOEC;
(function (JOEC) {
    /*
    * Type Checker
    */
    var TypeChecker = (function () {
        function TypeChecker(AST, symbolTable) {
            this.hasErrors = false;
            this.AST = AST;
            this.SymbolTable = symbolTable;
        }
        TypeChecker.prototype.typeCheckAST = function () {
            console.log("Starting Type Checking");
            console.log(this.SymbolTable);
            // Get the block that is the root node
            var blockNode = this.AST.rootNode;
            this.SymbolTable.currentScope = null;
            // Start to traverse the tree
            this.evaluateBlock(blockNode);
        };
        TypeChecker.prototype.evaluateBlock = function (node) {
            // Get the number of statements that the block has
            var len = node.children.length;
            this.SymbolTable.nextChildScope();
            // Evaluate them 1 by 1 in order
            for (var i = 0; i < len; i++) {
                this.evaluateStatement(node.children[i]);
            }
            this.SymbolTable.endScope();
        };
        TypeChecker.prototype.evaluateStatement = function (node) {
            console.log(node);
            if (node.name == "Variable Declaration") {
            }
            else if (node.name == "Block") {
                this.evaluateBlock(node);
            }
            else if (node.name == "Assign") {
                // Get the ID name and lookup the type in the symbol table
                var Id = node.children[0].name;
                console.log("The ID IS " + Id);
                console.log(this.SymbolTable.lookupVariable(Id));
                var type = this.SymbolTable.lookupVariable(Id).type;
                var joe = this.evaluateExpression(node.children[1]);
                var test;
                console.log(" The type is " + joe.type);
                // Check to see if test is a Identifier
                if (joe.type == "Identifier") {
                    test = this.SymbolTable.lookupVariable(joe.name);
                }
                else {
                    test = joe;
                }
                // Check for this boolean case and flip the string to use to match
                if (test.type == "boolean") {
                    test.type = "BoolVal";
                }
                if (test.type == "int") {
                    test.type = "Digit";
                }
                // Check for this boolean case and flip the string to use to match
                if (type == "boolean") {
                    type = "BoolVal";
                }
                if (type == "int") {
                    type = "Digit";
                }
                console.log("THE TEST VALUE IS");
                console.log(test);
                console.log("Eval Type " + test.type + "   compared to " + type);
                if (type.toLowerCase() != test.type.toLowerCase()) {
                    JOEC.Utils.createNewErrorMessage("Type Mismatch on line " + test.lineNumber + " , [ " + type + " ] is not equal to [ " + test.type + " ]");
                    this.hasErrors = true;
                }
                // Assign the variable
                this.SymbolTable.assignVariable(Id, test.name);
            }
            else if (node.name == "Print") {
                this.evaluateExpression(node.children[0]);
            }
            else if (node.name == "While") {
                this.evaluateBooleanExpression(node.children[0]);
                this.evaluateBlock(node.children[1]);
            }
            else if (node.name == "If") {
                this.evaluateBooleanExpression(node.children[0]);
                this.evaluateBlock(node.children[1]);
            }
        };
        TypeChecker.prototype.evaluateBooleanExpression = function (node) {
            console.log("boolean node");
            console.log(node);
            if (node.name != "==" && node.name != "!=") {
                console.log("Idea might be working ");
                console.log(node.children[0]);
                return node;
            }
            console.log("Evaluating a boolean expression in type checking");
            console.log(node);
            // Get both of the expression that need to be compared and evaluate them
            var expressionOne = this.evaluateExpression(node.children[0]);
            var expressionTwo = this.evaluateExpression(node.children[1]);
            var type1 = expressionOne.type;
            var type2 = expressionTwo.type;
            // Get both of the types
            console.log("Expression One");
            console.log(expressionOne);
            console.log("Expression Two");
            console.log(expressionTwo);
            // Check to see if expression 1 is an identifier
            if (type1 == "Identifier") {
                var variable = this.SymbolTable.lookupVariable(expressionOne.name);
                type1 = variable.type;
            }
            // Check to see if expression 2 is an identifier
            if (type2 == "Identifier") {
                var variable = this.SymbolTable.lookupVariable(expressionTwo.name);
                type2 = variable.type;
            }
            // Do some bs switch magic cause I am stupid
            if (type1 == "boolean") {
                type1 = "BoolVal";
            }
            if (type1 == "int") {
                type1 = "Digit";
            }
            if (type2 == "boolean") {
                type2 = "BoolVal";
            }
            if (type2 == "int") {
                type2 = "Digit";
            }
            type1 = type1.toLowerCase();
            type2 = type2.toLowerCase();
            console.log("Comparing " + type1 + "  with " + type2);
            // Compare the types of both expressions
            if (type1 != type2) {
                JOEC.Utils.createNewErrorMessage("Type Mismatch on line " + node.lineNumber + " , [ " + type1 + " ] is not equal to [ " + type2 + " ]");
                this.hasErrors = true;
                return node;
            }
            else {
                return node;
            }
        };
        TypeChecker.prototype.evaluateExpression = function (node) {
            if (node.name == "+") {
                if (node.children[1].name == "+") {
                    return this.evaluateExpression(node.children[1]);
                }
                else {
                    if (node.children[1].type != "Digit") {
                        if (node.children[1].type == "Identifier") {
                            if (this.SymbolTable.lookupVariable(node.children[1].name).type != "int") {
                                this.hasErrors = true;
                                return node.children[1];
                            }
                            else {
                                return node.children[0];
                            }
                        }
                        this.hasErrors = true;
                        return node.children[1];
                    }
                    return node.children[0];
                }
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
                console.log("JOE I FOUND AN IDENTIFIER ");
                // Lookup the variable in the current scope
                var variable = this.SymbolTable.lookupVariable(node.name);
                // Mark the variable as used
                variable.used = true;
                console.log("Joe the ID Variable is .. " + variable);
                console.log(variable);
                // Check to see if the variable has a value of not
                if (variable.value == null) {
                    JOEC.Utils.createNewWarningMessage("Use of uninitialized	variable  [ " + node.name + " ] on line " + node.lineNumber);
                }
                return node;
            }
        };
        return TypeChecker;
    })();
    JOEC.TypeChecker = TypeChecker;
})(JOEC || (JOEC = {}));
