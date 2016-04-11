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
            this.currentScope.addNewVariable(variableName, variableType);
        };
        SymbolTable.prototype.assignVariable = function (variableName, variableValue) {
            if (this.lookupVariable(variableName) != null) {
                var test = this.lookupVariable(variableName);
                test.value = variableValue;
            }
        };
        SymbolTable.prototype.lookupVariable = function (variableName) {
            // Check the current scope
            if (this.currentScope.lookupVariable(variableName) != null) {
                return this.currentScope.lookupVariable(variableName);
            }
            else {
                // Check to see if the
                while (this.currentScope.parent != null) {
                    this.currentScope = this.currentScope.parent;
                    // Check the current scope
                    if (this.currentScope.lookupVariable(variableName) != null) {
                        return this.currentScope.lookupVariable(variableName);
                    }
                }
            }
            return null;
        };
        return SymbolTable;
    })();
    JOEC.SymbolTable = SymbolTable;
})(JOEC || (JOEC = {}));
