///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="d3.d.ts"/>
/// <reference path="jquery.d.ts" />

module JOEC {

	/*
	*  Main
	*  
	*  Contains the overall logic of the comiler and calls all of the nessesary steps in order
	*  to compile
	*/

	export class Main {

		public static testing() {
		}

		/**
		* Start Compiler
		* 
		* Used to start the compiler, called when the compile button is pressed
		*/
	
		public static startCompiler() {

			// Initalize verbose mode
			_verboseMode = <HTMLInputElement>document.getElementById("vCheck");

			// Init the Alphabet
			Utils.initAlphabet();

			// Mark the compiler as running
			_isRunning = true;

			// Reset the Check and X Marks on the UI
			var lexremoveUI = <HTMLSpanElement>document.getElementById("lexError");
			lexremoveUI.style.visibility = "hidden";

			var parseremoveUI = <HTMLSpanElement>document.getElementById("parseError");
			parseremoveUI.style.visibility = "hidden";

			var SAremovekUI = <HTMLSpanElement>document.getElementById("SAError");
			SAremovekUI.style.visibility = "hidden";

			var codeGenRemoveUI = <HTMLSpanElement>document.getElementById("codeGenError");
			codeGenRemoveUI.style.visibility = "hidden";

			Utils.createNewMessage("Starting Compilation!\n");

			// Get the source code
			var sourceCode = Utils.getSourceCode();

			// Check to see if any source code exists
			if(sourceCode.length < 1) { // If no code exists

				// Tell the user and stop 
				Utils.createNewErrorMessage("No Source Code Found !")
				this.stopCompiler();
				return;
			}
			$("#testMe").append("<li><a onclick=\"JOEC.Main.testing()\"> Test</a></li>");
			// Create a new Lexical Analzer
			var LA = new LexicalAnalyzer(Utils.getSourceCode() );

			// Generate the tokens
			LA.generateTokens();
			var tokenListUI = <HTMLInputElement>document.getElementById("tokenList");

			// Check to see if verbose mode is enabled
			if(_verboseMode.checked){
				Utils.createNewMessage("\nToken List \n============ ");
				var nextToken: JOEC.Token; 
				// Loop over the token array and print out the tokens and line numbers
				for(var i = 0; i < LA.tokenArray.length; i++){
					nextToken = LA.tokenArray[i];
					Utils.createNewMessage("< Value: " +  nextToken.getValue() + " Kind: " + nextToken.getKind() + " Line Number: " + nextToken.getLineNumber() + " >");
					$("#tokenList").append('<li class="hostLogListItem" style="height:75px;"> <p class="" >' + nextToken.getValue() + '<span class="label logCounter">' + "hostCounter" + '</span> </p> <span class="logDateTime">' + "test" + ' </span > <span class="logSource" >' + "source" + '</span> </li>');

				}
				Utils.createNewMessage("============");
			}

			// Check for any lexical errors
			if(LA.hasErrors) {

				// Tell the user
				Utils.createNewErrorMessage("Compilation Failed :( ");

				// Mark the lex UI with a error mark
				var lexremoveUI = <HTMLSpanElement>document.getElementById("lexError");
				lexremoveUI.style.visibility = "visible";

				// Stop the comiler
				this.stopCompiler();

				return;
			}

			// Check to see if the $(EOF) is the last token is the array and if not correct the error and emit a warning
			var lastToken:JOEC.Token = LA.tokenArray[LA.tokenArray.length - 1];

			if (lastToken.getValue() != "$") {

				Utils.createNewWarningMessage("Missing the EOF symbol $ ... Fixing it now boss");
				LA.tokenArray.push(new Token("EOF", 0, "$"));
			}

			// Finish off the lexer and update the UI for the User
			Utils.createNewMessage("\nLex Completed... " + LA.tokenArray.length + " token(s) were found \n");

			// Update the UI and mark the lexer phase as complete
			var lexCheckUI = <HTMLSpanElement> document.getElementById("lexCheck");
			lexCheckUI.style.visibility = "visible";

			// Update the UI remove the error mark 
			var lexremoveUI = <HTMLSpanElement>document.getElementById("lexError");
			lexremoveUI.style.visibility = "hidden";

			// Create a new Parser
			var Par = new Parser();

			Utils.createNewMessage("Starting Parse! \n");

			// Start her up
			Par.startParse(LA.tokenArray);

			// Check for any parse errors
			if(Par.hasErrors) {

				// Tell the user
				Utils.createNewErrorMessage("Compilation Failed :( ");

				// Update the parse UI with a error mark
				var parseremoveUI = <HTMLSpanElement>document.getElementById("parseError");
				parseremoveUI.style.visibility = "visible";

				// Stop the comiler
				this.stopCompiler();
				return;
			}

			// Update the User
			Utils.createNewMessage("\nParser Completed");

			// Output the CST
			Utils.addNewCST(Par.CST.toString());
			Utils.createNewMessage(Par.CST.toString());
			console.log(Par.CST);

			// Traverse the CST to create an AST
			Par.traverseCST();

			// Output the AST
			Utils.addNewAST(Par.AST.toString());
			Utils.createNewMessage(Par.AST.toString());
			console.log(Par.AST.toString());

			// Update the UI and mark the parser as complete
			var parseCheckUI = <HTMLSpanElement>document.getElementById("parseCheck");
			parseCheckUI.style.visibility = "visible";

			//***************************************************\\
			//          Semantic Analysis Starting               \\
			//***************************************************\\

			 // Create a Semantic Analyzer
			var SemanticAnalyzer = new JOEC.SemanticAnalyzer();

			SemanticAnalyzer.generateSymbolTable(Par.CST);
			
			

			// Check for any errors in semantic analysis
			if(SemanticAnalyzer.hasErrors) {

				// Tell the user
				Utils.createNewErrorMessage("Compilation Failed :( ");

				// Update the parse UI with a error mark
				var parseremoveUI = <HTMLSpanElement>document.getElementById("SAError");
				parseremoveUI.style.visibility = "visible";

				// Stop the comiler
				this.stopCompiler();
				return;
			}

			SemanticAnalyzer.checkForUnusedIndentifiers();



			// Update the User
			Utils.createNewMessage("\nSemantic Analysis Completed");

			// Update the UI and mark the SA as complete
			var SACheckUI = <HTMLSpanElement>document.getElementById("SACheck");
			SACheckUI.style.visibility = "visible";

		}

		/**
		* Stop Comiler
		*
		* Used to stop the compiler
		*/
		public static stopCompiler() {

			// Mark the compiler as off
			_isRunning = false;

			// Enable the Compile Button to allow user to run another compilation
			var compileButton = <HTMLButtonElement>document.getElementById("compileButton");
			compileButton.disabled = false;
		}
		/**
		* Stop Comiler
		*
		* Used to stop the compiler
		*/
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