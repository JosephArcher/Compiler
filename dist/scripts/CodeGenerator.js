var JOEC;
(function (JOEC) {
    /*
     * Code Generator
     */
    var CodeGenerator = (function () {
        function CodeGenerator() {
            this.programCode = [];
            this.hasErrors = false;
        }
        /*
         * Used to convert a given AST into 6502A opcodes
         * @params Tree - The AST to be converted into code
         * @returns Array - An array of 6502a op codes
         */
        CodeGenerator.prototype.generateCode = function (AST) {
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
        /*
        * Statement
        */
        CodeGenerator.prototype.evaluateStatement = function (node) {
            // Variable Declaration
            if (node.name == "Variable Declaration") {
            }
            else if (node.name == "Block") {
                this.evaluateBlock(node);
            }
            else if (node.name == "Assign") {
                this.evaluateExpression(node.children[1]);
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
