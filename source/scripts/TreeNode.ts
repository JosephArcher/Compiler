///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="Tree.ts"/>

module JOEC {

	export class TreeNode {

		public name = ""; 
		public parent: TreeNode = null;
		public children = [];

		public constructor(theName){
			this.name = theName;
		}

		public addChildNode(node:JOEC.TreeNode) {
			this.children.push(node);
		}

	}
}