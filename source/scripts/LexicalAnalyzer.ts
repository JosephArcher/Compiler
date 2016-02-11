

module JOEC {

	export class LexicalAnalyzer {	

		// The source code to be compiled
		public sourceCode: string = "";

		constructor() {

		}
		/**	
		* Get the Source Code
		*
		*/
		public getSourceCode(): string {

			var sourceCodeHTML = <HTMLInputElement>document.getElementById("programInput");
			console.log(sourceCodeHTML.value.replace(/\s/g, ''));
			return sourceCodeHTML.value.replace(/\s/g, '');

		}
		public generateTokens(sourceCode:string) {

			var nextChar;

			// Loop over the string and find the lexems
			for (var i = 0; i < sourceCode.length; i++){

				// Get the next character in the source code
				nextChar = sourceCode.charAt(i);

				// Using the State Matrix and nextChar decide what to do	
			}
		}
	}
}