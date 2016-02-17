///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>


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

			this.createNewUpdateMessage("Starting Compilation!");
			this.createNewUpdateMessage("Starting Lexical Analysis!");

			// Create a new Lexical Analzer
			var LA = new LexicalAnalyzer();

			// Get the Source Code
			this.createNewUpdateMessage("Getting the Source Code");
			var sourceCode = LA.getSourceCode()

			// Start to generate tokens
			this.createNewUpdateMessage("Starting Token Generation");
			LA.generateTokens(sourceCode);

			// TODO: Before moving on to the next step need to check the status of the LA to see if any errors have occured
			if(LA.hasErrors){
				this.createNewErrorMessage("Compilation Failed :( ");

				// X Mark
				var lexremoveUI = <HTMLSpanElement>document.getElementById("lexError");
				lexremoveUI.style.visibility = "visible";

				this.stopCompiler();
				return;
			}

			// Finish off the lexer and update the UI for the User
			this.createNewUpdateMessage("Lex Completed");

			// Check Mark
			var lexCheckUI = <HTMLSpanElement> document.getElementById("lexCheck");
			lexCheckUI.style.visibility = "visible";

			// X Mark
			var lexremoveUI = <HTMLSpanElement>document.getElementById("lexError");
			lexremoveUI.style.visibility = "hidden";

			// Create a new Parser
			this.createNewUpdateMessage("Creating Parser");
			//var Parser = new Parser();

			// Finish off the Parser and update the UI for the User
			this.createNewUpdateMessage("Parser Completed");
			var parseCheckUI = <HTMLSpanElement>document.getElementById("parseCheck");
			parseCheckUI.style.visibility = "visible";


		}
		public static stopButton() {

			// Update the user
			this.createNewUpdateMessage("Current Compilation was stopped by the user!");
			this.stopCompiler();
		}
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
		public static createNewErrorMessage(msg) {
			var consoleHTML = <HTMLTextAreaElement>document.getElementById("console");
			consoleHTML.innerHTML = consoleHTML.value + "\n ERROR:" + msg;
		}
		public static createNewWarningMessage(msg) {
			var consoleHTML = <HTMLTextAreaElement>document.getElementById("console");
			consoleHTML.innerHTML = consoleHTML.value + "\n Warning:" + msg;
		}
		public static createNewUpdateMessage(msg) {
			var consoleHTML = <HTMLTextAreaElement>document.getElementById("console");
			consoleHTML.innerHTML = consoleHTML.value + "\n Update:" + msg;
		}
	}
}