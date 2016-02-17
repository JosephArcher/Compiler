///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
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
            this.createNewUpdateMessage("Starting Compilation!");
            this.createNewUpdateMessage("Starting Lexical Analysis!");
            // Create a new Lexical Analzer
            var LA = new JOEC.LexicalAnalyzer();
            // Get the Source Code
            this.createNewUpdateMessage("Getting the Source Code");
            var sourceCode = LA.getSourceCode();
            // Start to generate tokens
            this.createNewUpdateMessage("Starting Token Generation");
            LA.generateTokens(sourceCode);
            // TODO: Before moving on to the next step need to check the status of the LA to see if any errors have occured
            if (LA.hasErrors) {
                this.createNewErrorMessage("Compilation Failed :( ");
                // X Mark
                var lexremoveUI = document.getElementById("lexError");
                lexremoveUI.style.visibility = "visible";
                this.stopCompiler();
                return;
            }
            // Finish off the lexer and update the UI for the User
            this.createNewUpdateMessage("Lex Completed");
            // Check Mark
            var lexCheckUI = document.getElementById("lexCheck");
            lexCheckUI.style.visibility = "visible";
            // X Mark
            var lexremoveUI = document.getElementById("lexError");
            lexremoveUI.style.visibility = "hidden";
            // Create a new Parser
            this.createNewUpdateMessage("Creating Parser");
            //var Parser = new Parser();
            // Finish off the Parser and update the UI for the User
            this.createNewUpdateMessage("Parser Completed");
            var parseCheckUI = document.getElementById("parseCheck");
            parseCheckUI.style.visibility = "visible";
        };
        Main.stopButton = function () {
            // Update the user
            this.createNewUpdateMessage("Current Compilation was stopped by the user!");
            this.stopCompiler();
        };
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
        Main.createNewErrorMessage = function (msg) {
            var consoleHTML = document.getElementById("console");
            consoleHTML.innerHTML = consoleHTML.value + "\n ERROR:" + msg;
        };
        Main.createNewWarningMessage = function (msg) {
            var consoleHTML = document.getElementById("console");
            consoleHTML.innerHTML = consoleHTML.value + "\n Warning:" + msg;
        };
        Main.createNewUpdateMessage = function (msg) {
            var consoleHTML = document.getElementById("console");
            consoleHTML.innerHTML = consoleHTML.value + "\n Update:" + msg;
        };
        return Main;
    })();
    JOEC.Main = Main;
})(JOEC || (JOEC = {}));
