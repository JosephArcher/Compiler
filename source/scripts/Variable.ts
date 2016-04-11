///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="Tree.ts"/>

module JOEC {

   /*
	* Variable
	*/

	export class Variable {

		public name = null;
		public type = null;
		public value = null;

		public constructor(name:string , type:string) {
			this.name = name;
			this.type = type;
		 }
	}
}