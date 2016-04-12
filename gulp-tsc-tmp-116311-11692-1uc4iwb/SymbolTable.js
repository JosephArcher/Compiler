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
            console.log("Declare " + variableName);
            this.currentScope.addNewVariable(variableName, variableType);
        };
        SymbolTable.prototype.assignVariable = function (variableName, variableValue) {
            if (this.lookupVariable(variableName) != null) {
                var test = this.lookupVariable(variableName);
                test.value = variableValue;
            }
        };
        SymbolTable.prototype.lookupVariable = function (variableName) {
            //console.log(this.currentScope);
            // save the curretn scope
            var testing = this.currentScope;
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
                        this.currentScope = testing;
                        return this.currentScope.lookupVariable(variableName);
                    }
                }
                return null;
            }
            this.currentScope = testing;
        };
        SymbolTable.prototype.toString = function () {
            // Initialize the result string.
            var traversalResult = "";
            // Recursive function to handle the expansion of the nodes.
            function expand(node, depth) {
                // Space out based on the current depth so
                // this looks at least a little tree-like.
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }
                // If there are no children (i.e., leaf nodes)...
                if (!node.children || node.children.length === 0) {
                    // ... note the leaf node.
                    traversalResult += "[" + node.scopeLevel + "]";
                    traversalResult += "\n";
                }
                else {
                    // There are children, so note these interior/branch nodes and ...
                    traversalResult += "<" + node.scopeLevel + "> \n";
                    // .. recursively expand them.
                    for (var i = 0; i < node.children.length; i++) {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            // Make the initial call to expand from the root.
            expand(this.rootScope, 0);
            // Return the result.
            return traversalResult;
        };
        return SymbolTable;
    })();
    JOEC.SymbolTable = SymbolTable;
})(JOEC || (JOEC = {}));
