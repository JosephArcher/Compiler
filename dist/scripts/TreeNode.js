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
        function TreeNode(theName, type, lineNumber) {
            this.name = "";
            this.value = null;
            this.type = "";
            this.lineNumber = 0;
            this.parent = null;
            this.children = [];
            this.visted = false;
            this.name = theName;
            this.type = type;
            this.lineNumber = lineNumber;
        }
        TreeNode.prototype.addChildNode = function (node) {
            this.children.push(node);
        };
        TreeNode.prototype.getNextUnvistedChildNode = function () {
            var nextNode = null;
            // Iterate over the list of child nodes to find the next no visted node
            for (var i = 0; i < this.children.length; i++) {
                // Get the next node
                nextNode = this.children[i];
                // Check to see if the next node has been visited
                if (!nextNode.visted) {
                    // Mark the node as visted
                    nextNode.visted = true;
                    // Return it for use
                    return nextNode;
                }
            }
            // If the list ends and no useable children exist then return null
            return null;
        };
        return TreeNode;
    })();
    JOEC.TreeNode = TreeNode;
})(JOEC || (JOEC = {}));
