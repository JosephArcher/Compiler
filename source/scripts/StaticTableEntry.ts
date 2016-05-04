module JOEC {
	/*
	 * Static Table
	 */
	export class StaticTableEntry {

		public Temp = "";
		public Var = "";
		public type = "";
		public Scope = "";
		public address = "";
		public constructor(name, type, scope) {
			this.Var = name;
			this.type = type;
			this.Scope = scope;
		 }

	}
}