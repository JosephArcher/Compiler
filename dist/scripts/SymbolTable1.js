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
        SymbolTable.prototype.addNewScope = function () {
            // Make a new scope node
            var node = new JOEC.ScopeNode();
            // Check to see if it needs to be the root node.
            if ((this.rootScope == null) || (!this.rootScope)) {
                // We are the root node.
                this.rootScope = node;
            }
            else {
                // We are the children.
                // Make our parent the CURrent node...
                node.parent = this.currentScope;
                // ... and add ourselves (via the unfrotunately-named
                // "push" function) to the children array of the current node.
                this.currentScope.children.push(node);
            }
            // Update the current scope
            this.currentScope = node;
        };
        SymbolTable.prototype.endScope = function () {
            // ... by moving "up" to our parent node (if possible).
            if ((this.currentScope.parent !== null) && (this.currentScope.parent.scopeLevel !== undefined)) {
                this.currentScope = this.currentScope.parent;
            }
            else {
            }
        };
        SymbolTable.prototype.declareVariable = function (variableName, variableType) {
            if (!this.currentScope == null) {
                this.currentScope.addNewVariable(variableName, variableType);
            }
        };
        SymbolTable.prototype.assignVariable = function (variableValue) {
        };
        SymbolTable.prototype.lookupVariable = function (variableName) {
        };
        return SymbolTable;
    })();
    JOEC.SymbolTable = SymbolTable;
})(JOEC || (JOEC = {}));
