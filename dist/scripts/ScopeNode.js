///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="Tree.ts"/>
var JOEC;
(function (JOEC) {
    var ScopeNode = (function () {
        function ScopeNode() {
            this.scopeLevel = 0;
            this.scopeStuff = {};
            this.parent = null;
            this.children = [];
        }
        ScopeNode.prototype.addChildNode = function (node) {
            this.children.push(node);
        };
        ScopeNode.prototype.addNewVariable = function (variableName) {
            this.scopeStuff[variableName] = { name: variableName, value: null };
        };
        ScopeNode.prototype.updateVariable = function (variableName, variableValue) {
            var theVariable = this.scopeStuff[variableName];
            if (theVariable != null) {
                this.scopeStuff[variableName] = { name: variableName, value: variableValue };
            }
        };
        return ScopeNode;
    })();
    JOEC.ScopeNode = ScopeNode;
})(JOEC || (JOEC = {}));
