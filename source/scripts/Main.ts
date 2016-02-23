///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>

module JOEC {

	export class Main {

		public static startCompiler() {

			// Mark the compiler as running
			_isRunning = true;

			// Init the Alphabet
			Utils.initAlphabet();

			console.log(_alphabet);
			
			// Disable the Compile Button to prevent spam
			var compileButton = <HTMLButtonElement>document.getElementById("compileButton");
			compileButton.disabled = true;

			// Enable the Stop Button to allow user to stop the current compilation
			var stopButton = <HTMLButtonElement>document.getElementById("stopButton");
			stopButton.disabled = false;

			Utils.createNewUpdateMessage("Starting Compilation! \n \n ");
			Utils.createNewUpdateMessage("Starting Lexical Analysis!");

			// Create a new Lexical Analzer
			var LA = new LexicalAnalyzer(Utils.getSourceCode() );

			// Start to generate tokens
			LA.generateTokens();

			// Check for errors
			if(LA.hasErrors) {

				Utils.createNewErrorMessage("Compilation Failed :( ");

				// X Mark
				var lexremoveUI = <HTMLSpanElement>document.getElementById("lexError");
				lexremoveUI.style.visibility = "visible";

				this.stopCompiler();

				return;
			}
			// Check to see if the $(EOF) is the last token is the array and if not correct the error and emit a warning
			var lastToken:JOEC.Token = LA.tokenArray[LA.tokenArray.length - 1];

			if (lastToken.getValue() != "$") {

				Utils.createNewWarningMessage("Missing the EOF symbol $ ... Fixing it now boss");
				LA.tokenArray.push(new Token("EOF", -1, "$"));
			}

			// Finish off the lexer and update the UI for the User
			Utils.createNewUpdateMessage("\n \n Lex Completed... " + LA.tokenArray.length + " token(s) were found");

			// Check Mark
			var lexCheckUI = <HTMLSpanElement> document.getElementById("lexCheck");
			lexCheckUI.style.visibility = "visible";

			// X Mark
			var lexremoveUI = <HTMLSpanElement>document.getElementById("lexError");
			lexremoveUI.style.visibility = "hidden";

			// Create a new Parser
			Utils.createNewUpdateMessage("Creating Parser");
			var Par = new Parser();

			// Start her up
			Par.startParse(LA.tokenArray);

			// Check for errors
			if(Par.hasErrors) {

				Utils.createNewErrorMessage("Compilation Failed :( ");

				// X Mark
				var parseremoveUI = <HTMLSpanElement>document.getElementById("parseError");
				parseremoveUI.style.visibility = "visible";

				this.stopCompiler();
 
				return;

			}
			// Finish off the Parser and update the UI for the User
			Utils.createNewUpdateMessage("Parser Completed");
			var parseCheckUI = <HTMLSpanElement>document.getElementById("parseCheck");
			parseCheckUI.style.visibility = "visible";
		}

		/**
		* Stops the current compilation
		*/
		public static stopCompiler() {

			// Mark the compiler as off
			_isRunning = false;

			// Enable the Compile Button to allow user to run another compilation
			var compileButton = <HTMLButtonElement>document.getElementById("compileButton");
			compileButton.disabled = false;

			// Disable the stop button because no program is being compiled anymore
			var stopButton = <HTMLButtonElement>document.getElementById("stopButton");
			stopButton.disabled = true;
		}
		
	}
}