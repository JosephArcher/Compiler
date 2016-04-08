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
        function ScopeNode(theName) {
            this.scopeLevel = 0;
            this.scopeStuff = {};
            this.children = [];
        }
        ScopeNode.prototype.addChildNode = function (node) {
            this.children.push(node);
        };
        ScopeNode.prototype.addNewVariable = function (variableName) {
            console.log("TESt");
            console.log(this.scopeStuff);
            this.scopeStuff[variableName] = {};
            console.log(this.scopeStuff);
        };
        return ScopeNode;
    })();
    JOEC.ScopeNode = ScopeNode;
})(JOEC || (JOEC = {}));
