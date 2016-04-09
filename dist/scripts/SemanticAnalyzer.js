///<reference path="Tree.ts"/>
var JOEC;
(function (JOEC) {
    var SemanticAnalyzer = (function () {
        function SemanticAnalyzer() {
            this.hasErrors = false;
        }
        SemanticAnalyzer.prototype.analyze = function (tree) {
        };
        SemanticAnalyzer.prototype.generateSymbolTable = function () {
        };
        return SemanticAnalyzer;
    })();
    JOEC.SemanticAnalyzer = SemanticAnalyzer;
})(JOEC || (JOEC = {}));
