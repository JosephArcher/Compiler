///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="Tree.ts"/>
var JOEC;
(function (JOEC) {
    var TreeNode = (function () {
        function TreeNode(theName) {
            this.name = "";
            this.parent = null;
            this.children = [];
            this.name = theName;
        }
        TreeNode.prototype.addChildNode = function (node) {
            this.children.push(node);
        };
        return TreeNode;
    })();
    JOEC.TreeNode = TreeNode;
})(JOEC || (JOEC = {}));
