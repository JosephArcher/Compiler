///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="Tree.ts"/>

module JOEC {

	export class ScopeNode {

		public scopeLevel: number = 0;
		public scopeStuff = {};
		public children = [];

		public constructor(theName) { }

		public addChildNode(node: JOEC.TreeNode) {
			this.children.push(node);
		}
		public addNewVariable(variableName: string) {
			console.log("TESt");
			console.log(this.scopeStuff);
			this.scopeStuff[variableName] = {name: variableName, value: null};
			console.log(this.scopeStuff);
		}
	}
}