///<reference path="Globals.ts"/>
///<reference path="Tree.ts"/>
///<reference path="TreeNode.ts"/>
///<reference path="Stack.ts"/>

module JOEC {

	/*
	* Utitily functions that are useful but have no real place (at least I could not find one I liked...)
	*/
	export class Utils {

		/**
		* initAlphabet
		*
		* Creates a mapping on each character that can be used in the language to its position in the transition table
		*/
		public static initAlphabet() {
			_alphabet["a"] =  { pos: 0  };
			_alphabet["b"] =  { pos: 1  };
			_alphabet["c"] =  { pos: 2  };
			_alphabet["d"] =  { pos: 3  };
			_alphabet["e"] =  { pos: 4  };
			_alphabet["f"] =  { pos: 5  };
			_alphabet["g"] =  { pos: 6  };
			_alphabet["h"] =  { pos: 7  };
			_alphabet["i"] =  { pos: 8  };
			_alphabet["j"] =  { pos: 9  };
			_alphabet["k"] =  { pos: 10 };
			_alphabet["l"] =  { pos: 11 };
			_alphabet["m"] =  { pos: 12 };
			_alphabet["n"] =  { pos: 13 };
			_alphabet["o"] =  { pos: 14 };
			_alphabet["p"] =  { pos: 15 };
			_alphabet["q"] =  { pos: 16 };
			_alphabet["r"] =  { pos: 17 };
			_alphabet["s"] =  { pos: 18 };
			_alphabet["t"]  = { pos: 19 };
			_alphabet["u"] =  { pos: 20 };
			_alphabet["v"] =  { pos: 21 };
			_alphabet["w"] =  { pos: 22 };
			_alphabet["x"] =  { pos: 23 };
			_alphabet["y"] =  { pos: 24 };
			_alphabet["z"] =  { pos: 25 };
			_alphabet["0"] =  { pos: 26 };
			_alphabet["1"] =  { pos: 27 };
			_alphabet["2"] =  { pos: 28 };
			_alphabet["3"] =  { pos: 29 };
			_alphabet["4"] =  { pos: 30 };
			_alphabet["5"] =  { pos: 31 };
			_alphabet["6"] =  { pos: 32 };
			_alphabet["7"] =  { pos: 33 };
			_alphabet["8"] =  { pos: 34 };
			_alphabet["9"] =  { pos: 35 };
			_alphabet["$"] =  { pos: 36 };
			_alphabet["{"] =  { pos: 37 };
			_alphabet["}"] =  { pos: 38 };
			_alphabet["("] =  { pos: 39 };
			_alphabet[")"] =  { pos: 40 };
			_alphabet["!"] =  { pos: 41 };
			_alphabet["+"] =  { pos: 42 };
			_alphabet[" "] =  { pos: 43 };
			_alphabet["="] =  { pos: 44 };
			_alphabet["\""] = { pos: 45 }; // Quote
			_alphabet["\n"] = { pos: 46 }; // New Line
			_alphabet["\t"] = { pos: 47 }; // Tab

		}
		/*
		* getCharacterPosition
		*
		* Params 
		*    character - a character in the alphabet  
		* Returns
		*  	 the given character's position in the matrix
		*/
		public static getCharacterPosition(character: string): number {

			if(_alphabet[character]){

				var joe = _alphabet[character].pos;
				return joe;
			}
			console.log("Unknown character found");
			return null;
		}
		/**	
		* getSourceCode
		* 
		* Used to get the source code from the HTML TextArea
		*/
		public static getSourceCode(): string {

			var sourceCodeHTML = <HTMLTextAreaElement>document.getElementById("programInput");
			return sourceCodeHTML.value;
		}
		/**	
		* createNewErrorMessage
		* 
		* Displays a given message as an error in the user console
		*
		* Params
		*	msg - the message to output to the user console
		*/
		public static createNewErrorMessage(msg) {
			var consoleHTML = <HTMLTextAreaElement>document.getElementById("console");
			consoleHTML.innerHTML = consoleHTML.value + "\nERROR :  " + msg;
		}
		/**	
		* createNewWarningMessage
		* 
		* Displays a given message as a warning in the user console
		*
		* Params
		*	msg - the message to output to the user console
		*/
		public static createNewWarningMessage(msg) {
			var consoleHTML = <HTMLTextAreaElement>document.getElementById("console");
			consoleHTML.innerHTML = consoleHTML.value + "\nWarning :  " + msg;
		}
		/**	
		* createNewMessage
		* 
		* Displays a given message in the user console
		*
		* Params
		*	msg - the message to output to the user console
		*/
		public static createNewMessage(msg) {
			var consoleHTML = <HTMLTextAreaElement>document.getElementById("console");
			consoleHTML.innerHTML = consoleHTML.value + "\n" + msg;
		}
		public static addNewCST(CST: string){
			var cstArea = document.getElementById("cstArea");
			cstArea.innerHTML = CST;
		}
		public static addNewAST(AST: string) {
			var astArea = document.getElementById("astArea");
			astArea.innerHTML = AST;
		}
		public static addNewToken(Token:JOEC.Token){
			var tokenArea = <HTMLTextAreaElement> document.getElementById("tokenArea");
			tokenArea.innerHTML = tokenArea.innerHTML + "Value: " + Token.getValue() + " Kind: " + Token.getKind() + " Line Number: " + Token.getLineNumber() + "\n";
		}	
		public static newHeadOfSymbolTable(){
			var symbolTableArea = <HTMLTextAreaElement>document.getElementById("symbolTableArea");
			symbolTableArea.innerHTML = symbolTableArea.innerHTML + "Name   " + "Value   " +  "Type   " + "Depth   " + "\n";
		}
		public static newVariableInSymbolTable(variable , depth){
			var symbolTableArea = <HTMLTextAreaElement>document.getElementById("symbolTableArea");
			symbolTableArea.innerHTML = symbolTableArea.innerHTML +  variable.name + "         " + variable.value + "         " + variable.type + "         " + depth + "\n";
		}	
		/**
		 * resetCompilerStatusBar
		 *
		 * Used to hide all of the compiler ui check and x marks 
		 *
		 */
		public static resetCompilerStatusBar() {

			// Reset the Check and X Marks on the UI
			var lexremoveUI = <HTMLSpanElement>document.getElementById("lexError");
			lexremoveUI.style.visibility = "hidden";

			var lexCheckUI = <HTMLSpanElement>document.getElementById("lexCheck");
			lexCheckUI.style.visibility = "hidden";

			var parseremoveUI = <HTMLSpanElement>document.getElementById("parseError");
			parseremoveUI.style.visibility = "hidden";

			var parseCheckUI = <HTMLSpanElement>document.getElementById("parseCheck");
			parseCheckUI.style.visibility = "hidden";

			var SAremovekUI = <HTMLSpanElement>document.getElementById("SAError");
			SAremovekUI.style.visibility = "hidden";

			var SACheckUI = <HTMLSpanElement>document.getElementById("SACheck");
			SACheckUI.style.visibility = "hidden";

			var codeGenRemoveUI = <HTMLSpanElement>document.getElementById("codeGenError");
			codeGenRemoveUI.style.visibility = "hidden";

			var codeGenCheckUI = <HTMLSpanElement>document.getElementById("codeGenCheck");
			codeGenCheckUI.style.visibility = "hidden";
		}
		/**
		 * resetUISidebar
		 *
		 * Used to reset the text areas in the side bar 
		 *
		 */
		public static resetUISideBar() {

			// Token List
			var tokenArea = <HTMLTextAreaElement>document.getElementById("tokenArea");
			tokenArea.innerHTML = "";

			// CST
			var cstArea = <HTMLTextAreaElement>document.getElementById("cstArea");
			cstArea.innerHTML = "";

			// AST 
			var astArea = <HTMLTextAreaElement>document.getElementById("astArea");
			astArea.innerHTML = "";

			// Symbol Table
			var symbolTableArea = <HTMLTextAreaElement>document.getElementById("symbolTableArea");
			symbolTableArea.innerHTML = "";

		}
		public static showVis() {
			$('#main').animate({
				'marginLeft': "-=30px" //moves left
			});
		}
		public static openSidepage() {
		$('#mainpage').animate({
			left: '350px'
		}, 400, 'easeOutBack');
	}
	}
}