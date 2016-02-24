///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
var JOEC;
(function (JOEC) {
    var Main = (function () {
        function Main() {
        }
        /**
        * Start Compiler
        *
        * Used to start the compiler, called when the compile button is pressed
        */
        Main.startCompiler = function () {
            // Initalize verbose mode
            _verboseMode = document.getElementById("vCheck");
            // Init the Alphabet
            JOEC.Utils.initAlphabet();
            // Mark the compiler as running
            _isRunning = true;
            // Disable the Compile Button
            var compileButton = document.getElementById("compileButton");
            compileButton.disabled = true;
            // Enable Stop Button to allow user to stop the current compilation
            var stopButton = document.getElementById("stopButton");
            stopButton.disabled = false;
            JOEC.Utils.createNewUpdateMessage("Starting Compilation!\n");
            // Get the source code
            var sourceCode = JOEC.Utils.getSourceCode();
            // Check to see if any source code exists
            if (sourceCode.length < 1) {
                // Tell the user and stop 
                JOEC.Utils.createNewErrorMessage("No Source Code Found !");
                this.stopCompiler();
                return;
            }
            // Create a new Lexical Analzer
            var LA = new JOEC.LexicalAnalyzer(JOEC.Utils.getSourceCode());
            // Generate the tokens
            LA.generateTokens();
            // Check for any lexical errors
            if (LA.hasErrors) {
                // Tell the user
                JOEC.Utils.createNewErrorMessage("Compilation Failed :( ");
                // Mark the lex UI with a error mark
                var lexremoveUI = document.getElementById("lexError");
                lexremoveUI.style.visibility = "visible";
                // Stop the comiler
                this.stopCompiler();
                return;
            }
            // Check to see if the $(EOF) is the last token is the array and if not correct the error and emit a warning
            var lastToken = LA.tokenArray[LA.tokenArray.length - 1];
            if (lastToken.getValue() != "$") {
                JOEC.Utils.createNewWarningMessage("Missing the EOF symbol $ ... Fixing it now boss");
                LA.tokenArray.push(new JOEC.Token("EOF", 0, "$"));
            }
            // Finish off the lexer and update the UI for the User
            JOEC.Utils.createNewUpdateMessage("\n \n Lex Completed... " + LA.tokenArray.length + " token(s) were found");
            // Update the UI and mark the lexer phase as complete
            var lexCheckUI = document.getElementById("lexCheck");
            lexCheckUI.style.visibility = "visible";
            // Update the UI remove the error mark 
            var lexremoveUI = document.getElementById("lexError");
            lexremoveUI.style.visibility = "hidden";
            // Create a new Parser
            var Par = new JOEC.Parser();
            JOEC.Utils.createNewUpdateMessage("Creating Parser");
            // Start her up
            Par.startParse(LA.tokenArray);
            // Check for any parse errors
            if (Par.hasErrors) {
                // Tell the user
                JOEC.Utils.createNewErrorMessage("Compilation Failed :( ");
                // Update the parse UI with a error mark
                var parseremoveUI = document.getElementById("parseError");
                parseremoveUI.style.visibility = "visible";
                // Stop the comiler
                this.stopCompiler();
                return;
            }
            // Update the User
            JOEC.Utils.createNewUpdateMessage("Parser Completed");
            // Update the UI and mark the parser as complete
            var parseCheckUI = document.getElementById("parseCheck");
            parseCheckUI.style.visibility = "visible";
        };
        /**
        * Stop Comiler
        *
        * Used to stop the compiler
        */
        Main.stopCompiler = function () {
            // Mark the compiler as off
            _isRunning = false;
            // Enable the Compile Button to allow user to run another compilation
            var compileButton = document.getElementById("compileButton");
            compileButton.disabled = false;
            // Disable the stop button because no program is being compiled anymore
            var stopButton = document.getElementById("stopButton");
            stopButton.disabled = true;
        };
        return Main;
    })();
    JOEC.Main = Main;
})(JOEC || (JOEC = {}));
