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
        Main.startCompiler = function () {
            // Mark the compiler as running
            _isRunning = true;
            // Init the Alphabet
            JOEC.Utils.initAlphabet();
            console.log(_alphabet);
            // Disable the Compile Button to prevent spam
            var compileButton = document.getElementById("compileButton");
            compileButton.disabled = true;
            // Enable the Stop Button to allow user to stop the current compilation
            var stopButton = document.getElementById("stopButton");
            stopButton.disabled = false;
            JOEC.Utils.createNewUpdateMessage("Starting Compilation! \n \n ");
            JOEC.Utils.createNewUpdateMessage("Starting Lexical Analysis!");
            // Create a new Lexical Analzer
            var LA = new JOEC.LexicalAnalyzer(JOEC.Utils.getSourceCode());
            // Start to generate tokens
            LA.generateTokens();
            // Check for errors
            if (LA.hasErrors) {
                JOEC.Utils.createNewErrorMessage("Compilation Failed :( ");
                // X Mark
                var lexremoveUI = document.getElementById("lexError");
                lexremoveUI.style.visibility = "visible";
                this.stopCompiler();
                return;
            }
            // Check to see if the $(EOF) is the last token is the array and if not correct the error and emit a warning
            var lastToken = LA.tokenArray[LA.tokenArray.length - 1];
            if (lastToken.getValue() != "$") {
                JOEC.Utils.createNewWarningMessage("Missing the EOF symbol $ ... Fixing it now boss");
                LA.tokenArray.push(new JOEC.Token("EOF", -1, "$"));
            }
            // Finish off the lexer and update the UI for the User
            JOEC.Utils.createNewUpdateMessage("\n \n Lex Completed... " + LA.tokenArray.length + " token(s) were found");
            // Check Mark
            var lexCheckUI = document.getElementById("lexCheck");
            lexCheckUI.style.visibility = "visible";
            // X Mark
            var lexremoveUI = document.getElementById("lexError");
            lexremoveUI.style.visibility = "hidden";
            // Create a new Parser
            JOEC.Utils.createNewUpdateMessage("Creating Parser");
            var Par = new JOEC.Parser();
            // Start her up
            Par.startParse(LA.tokenArray);
            // Check for errors
            if (Par.hasErrors) {
                JOEC.Utils.createNewErrorMessage("Compilation Failed :( ");
                // X Mark
                var parseremoveUI = document.getElementById("parseError");
                parseremoveUI.style.visibility = "visible";
                this.stopCompiler();
                return;
            }
            // Finish off the Parser and update the UI for the User
            JOEC.Utils.createNewUpdateMessage("Parser Completed");
            var parseCheckUI = document.getElementById("parseCheck");
            parseCheckUI.style.visibility = "visible";
        };
        /**
        * Stops the current compilation
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
