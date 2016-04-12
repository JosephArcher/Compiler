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
            // Get the block that is the root node
            var blockNode = this.AST.rootNode;
            // Start to traverse the tree
            this.evaluateBlock(blockNode);
        };
        TypeChecker.prototype.evaluateBlock = function (node) {
            // Get the number of statements that the block has
            var len = node.children.length;
            // Evaluate them 1 by 1 in order
            for (var i = 0; i < len; i++) {
                this.SymbolTable.currentScope = this.SymbolTable.currentScope.children[i];
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
                this.SymbolTable.lookupVariable;
                var testjoe = this.evaluateType(node.children[1]);
                console.log("test joe");
                console.log(testjoe);
            }
            else if (node.name == "Print") {
                this.evaluateExpression(node.children[0]);
            }
        };
        TypeChecker.prototype.evaluateType = function (type) {
        };
        TypeChecker.prototype.evaluateExpression = function (node) {
            console.log(node);
            if (node.name == "+") {
                if (node.children[1].name == "+") {
                    this.evaluateExpression(node.children[1]);
                }
                else {
                    if (node.children[1].type != "Digit") {
                        console.log("Not a digit");
                        this.hasErrors = true;
                    }
                }
            }
        };
        return TypeChecker;
    })();
    JOEC.TypeChecker = TypeChecker;
})(JOEC || (JOEC = {}));
