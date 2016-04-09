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
		public parent: JOEC.ScopeNode = null;
		public children = [];

		public constructor() { }

		public addChildNode(node: JOEC.TreeNode) {
			this.children.push(node);
		}
		public addNewVariable(variableName: string) {
			
			
			this.scopeStuff[variableName] = {name: variableName, value: null};
		
		}
		public updateVariable(variableName: string, variableValue: string) {

			var theVariable = this.scopeStuff[variableName];

			if(theVariable != null){
				this.scopeStuff[variableName] = { name: variableName, value: variableValue };
			}
		}
	}
}