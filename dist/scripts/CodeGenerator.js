var JOEC;
(function (JOEC) {
    /*
     * Code Generator
     */
    var CodeGenerator = (function () {
        function CodeGenerator() {
            // Create a new static table 
            this.programCode = [];
            this.programCounter = 0;
            this.hasErrors = false;
            this.staticTable = {};
            this.jumpTable = {};
            // Create a new jump table
        }
        CodeGenerator.prototype.newStaticVariable = function (name, type, value) {
        };
        CodeGenerator.prototype.newJumpVariable = function (name, type, value) {
        };
        CodeGenerator.prototype.addNextOpCode = function (opCode) {
            // Add the new opcode to the next available address in memory
            this.programCode[this.programCounter] = opCode;
            // Increment the next available address
            this.programCounter++;
        };
        /*
         * Used to convert a given AST into 6502A opcodes
         * @params Tree - The AST to be converted into code
         * @returns Array - An array of 6502a op codes
         */
        CodeGenerator.prototype.generateCode = function (AST) {
            this.evaluateBlock(AST.rootNode);
        };
        /*
        * Block
        */
        CodeGenerator.prototype.evaluateBlock = function (node) {
            // Get the number of statements that the block has
            var len = node.children.length;
            // Evaluate them 1 by 1 in order
            for (var i = 0; i < len; i++) {
                this.evaluateStatement(node.children[i]);
            }
        };
        CodeGenerator.prototype.generatePrintCode = function () {
            // AC
            this.addNextOpCode("AC");
            // T0
            this.addNextOpCode("T0");
            // XX
            this.addNextOpCode("XX");
            // A2
            this.addNextOpCode("A2");
            // Depening on the type place either a 0 or 1 in this spot
            this.addNextOpCode("0");
            // FF
            this.addNextOpCode("FF");
        };
        CodeGenerator.prototype.intDeclaration = function () {
            // A9
            this.addNextOpCode("A9");
            // 00
            this.addNextOpCode("00");
            // 8D
            this.addNextOpCode("8D");
            // Create a new variable for the static table
            var staticVariableNumber = Object.keys(this.staticTable).length;
            // Temp Variable Number
            this.addNextOpCode("T0");
            // XX
            this.addNextOpCode("XX");
        };
        CodeGenerator.prototype.booleanDeclaration = function () {
        };
        CodeGenerator.prototype.stringDeclaration = function () {
        };
        /*
        * Statement
        */
        CodeGenerator.prototype.evaluateStatement = function (node) {
            // Variable Declaration
            if (node.name == "Variable Declaration") {
                // Get the type
                var type = node.children[0].name;
                // Call the right function
                if (type == "int") {
                    this.intDeclaration();
                }
                else if (type == "string") {
                    this.stringDeclaration();
                }
                else if (type == "boolean") {
                    this.booleanDeclaration();
                }
            }
            else if (node.name == "Block") {
                this.evaluateBlock(node);
            }
            else if (node.name == "Assign") {
                var rightSide = this.evaluateExpression(node.children[1]);
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
        /*
         * Boolean Expression
         */
        CodeGenerator.prototype.evaluateBooleanExpression = function (node) {
            if (node.name != "==" && node.name != "!=") {
                return node;
            }
            // Get both of the expression that need to be compared and evaluate them
            var expressionOne = this.evaluateExpression(node.children[0]);
            var expressionTwo = this.evaluateExpression(node.children[1]);
            return node;
        };
        /*
         *  Expression
         */
        CodeGenerator.prototype.evaluateExpression = function (node) {
            // Integer Expression
            if (node.name == "+") {
                return this.evaluateExpression(node.children[1]);
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
                return node;
            }
        };
        /*
         * Create new string variable
         */
        CodeGenerator.prototype.createNewStringVariable = function (variableName) {
        };
        return CodeGenerator;
    })();
    JOEC.CodeGenerator = CodeGenerator;
})(JOEC || (JOEC = {}));
