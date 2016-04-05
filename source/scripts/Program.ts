///<reference path="Tree.ts"/>

module JOEC {

	export class Program {

		/*
		* Program
		*/

		public id: number;
		public sourceCode: string;
		public tokenList = [];
		public cst: JOEC.Tree;
		public ast: JOEC.Tree;
		public targetCode: string;

		public constructor(_id: number, _code: string) {

			this.id = _id;
			this.sourceCode = _code;


		}
	}
}