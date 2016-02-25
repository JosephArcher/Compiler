
module JOEC {

	export class Token {

		/*
		* Token
		*/

		public kind: string;
		public lineNumber: number;
		public value: string;

		public constructor(_kind: string, _lineNumber: number, _value?: string) {

			this.kind = _kind;
			this.lineNumber = _lineNumber;
			this.value = _value;
		}
		public getValue(){
			return this.value;
		}
		public getKind(){
			return this.kind;
		}
		public getLineNumber(){
			return this.lineNumber;
		}
	}
}