///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="TreeNode.ts"/>
var JOEC;
(function (JOEC) {
    var Tree = (function () {
        function Tree() {
        }
        Tree.prototype.addBranchNode = function (theNode) {
            this.currentNode.addChildNode(theNode);
        };
        return Tree;
    })();
    JOEC.Tree = Tree;
})(JOEC || (JOEC = {}));
