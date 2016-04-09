///<reference path="ScopeNode.ts"/>
var JOEC;
(function (JOEC) {
    var SymbolTable = (function () {
        function SymbolTable() {
            /*
            * Symbol Table
            */
            this.currentScope = null;
            this.rootScope = null;
        }
        return SymbolTable;
    })();
    JOEC.SymbolTable = SymbolTable;
})(JOEC || (JOEC = {}));
