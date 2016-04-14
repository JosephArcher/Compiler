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
            console.log("ADDING NEW SCOPE");
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
        SymbolTable.prototype.nextChildScope = function () {
            if (this.currentScope == null) {
                this.currentScope = this.rootScope;
            }
            else {
                var nextPossibleNode = this.currentScope.getNextUnvistedChildNode();
                if (nextPossibleNode != null) {
                    this.currentScope = nextPossibleNode;
                }
            }
        };
        SymbolTable.prototype.endScope = function () {
            console.log("Ending Scope");
            // ... by moving "up" to our parent node (if possible).
            if ((this.currentScope.parent !== null) && (this.currentScope.parent.scopeLevel !== undefined)) {
                this.currentScope = this.currentScope.parent;
            }
            else {
            }
        };
        SymbolTable.prototype.declareVariable = function (variableName, variableType) {
            console.log("Declare " + variableName + "   with a type of " + variableType);
            this.currentScope.addNewVariable(variableName, variableType);
        };
        SymbolTable.prototype.assignVariable = function (variableName, variableValue) {
            if (this.lookupVariable(variableName) != null) {
                var test = this.lookupVariable(variableName);
                test.value = variableValue;
            }
        };
        SymbolTable.prototype.lookupVariable = function (variableName) {
            // save the curretn scope
            var testing = this.currentScope;
            // Check the current scope
            if (this.currentScope.lookupVariable(variableName) != null) {
                this.currentScope = testing;
                return this.currentScope.lookupVariable(variableName);
            }
            else {
                // Check to see if the
                while (this.currentScope.parent != null) {
                    this.currentScope = this.currentScope.parent;
                    // Check the current scope
                    if (this.currentScope.lookupVariable(variableName) != null) {
                        // Save the output 
                        var answer = this.currentScope.lookupVariable(variableName);
                        // reset the scope
                        this.currentScope = testing;
                        return answer;
                    }
                }
                this.currentScope = testing;
                return null;
            }
        };
        return SymbolTable;
    })();
    JOEC.SymbolTable = SymbolTable;
})(JOEC || (JOEC = {}));
