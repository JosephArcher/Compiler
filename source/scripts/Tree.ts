///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="TreeNode.ts"/>

module JOEC {

	export class Tree {

		public rootNode: JOEC.TreeNode;

		public constructor(){

			this.rootNode = new TreeNode();
			

		}

	}
}