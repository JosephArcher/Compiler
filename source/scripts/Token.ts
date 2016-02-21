
module JOEC {

	export class Token {


		public kind: string;
		public value: string;
		public lineNumber: number;

		public constructor(_kind: string, _value?: string) {

			this.kind = _kind;
			this.value = _value;
		}
		public getValue(){
			return this.value;
		}
		public getKind(){
			return this.kind;
		}
	}
}