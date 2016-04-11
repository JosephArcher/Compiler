///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="Tree.ts"/>
///<reference path="Variable.ts"/>
var JOEC;
(function (JOEC) {
    var ScopeNode = (function () {
        function ScopeNode() {
            this.scopeLevel = 0;
            this.scopeStuff = {};
            this.parent = null;
            this.children = [];
            this.visted = false;
        }
        ScopeNode.prototype.addChildNode = function (node) {
            this.children.push(node);
        };
        ScopeNode.prototype.addNewVariable = function (variableName, variableType) {
            console.log("adding new variable");
            this.scopeStuff[variableName] = new JOEC.Variable(variableName, variableType);
        };
        ScopeNode.prototype.updateVariable = function (variableName, variableValue) {
            var theVariable = this.scopeStuff[variableName];
            if (theVariable != null) {
                theVariable.value = variableValue;
            }
        };
        ScopeNode.prototype.lookupVariable = function (variableName) {
            if (this.scopeStuff[variableName]) {
                return this.scopeStuff[variableName];
            }
            else {
                return null;
            }
        };
        ScopeNode.prototype.getNextUnvistedChildNode = function () {
            var nextNode = null;
            // Iterate over the list of child nodes to find the next no visted node
            for (var i = 0; i < this.children.length; i++) {
                // Get the next node
                nextNode = this.children[i];
                // Check to see if the next node has been visited
                if (!nextNode.visted) {
                    // Return it for use
                    return nextNode;
                }
            }
            // If the list ends and no useable children exist then return null
            return null;
        };
        return ScopeNode;
    })();
    JOEC.ScopeNode = ScopeNode;
})(JOEC || (JOEC = {}));
