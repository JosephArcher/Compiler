var JOEC;
(function (JOEC) {
    /*
     * Code Generator
     */
    var CodeGenerator = (function () {
        function CodeGenerator() {
            this.hasErrors = false;
        }
        /*
         * Used to convert a given AST into 6502A opcodes
         * @params Tree - The AST to be converted into code
         * @returns Array - An array of 6502a op codes
         */
        CodeGenerator.prototype.generateCode = function (AST) {
        };
        return CodeGenerator;
    })();
    JOEC.CodeGenerator = CodeGenerator;
})(JOEC || (JOEC = {}));
