///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="d3.d.ts"/>
/// <reference path="jquery.d.ts" />
var JOEC;
(function (JOEC) {
    /*
    *  Main
    *
    *  Contains the overall logic of the comiler and calls all of the nessesary steps in order
    *  to compile
    */
    var Main = (function () {
        function Main() {
        }
        Main.testing = function () {
        };
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
            // Reset the Check and X Marks on the UI
            var lexremoveUI = document.getElementById("lexError");
            lexremoveUI.style.visibility = "hidden";
            var parseremoveUI = document.getElementById("parseError");
            parseremoveUI.style.visibility = "hidden";
            var SAremovekUI = document.getElementById("SAError");
            SAremovekUI.style.visibility = "hidden";
            var codeGenRemoveUI = document.getElementById("codeGenError");
            codeGenRemoveUI.style.visibility = "hidden";
            JOEC.Utils.createNewMessage("Starting Compilation!\n");
            // Get the source code
            var sourceCode = JOEC.Utils.getSourceCode();
            // Check to see if any source code exists
            if (sourceCode.length < 1) {
                // Tell the user and stop 
                JOEC.Utils.createNewErrorMessage("No Source Code Found !");
                this.stopCompiler();
                return;
            }
            $("#testMe").append("<li><a onclick=\"JOEC.Main.testing()\"> Test</a></li>");
            // Create a new Lexical Analzer
            var LA = new JOEC.LexicalAnalyzer(JOEC.Utils.getSourceCode());
            // Generate the tokens
            LA.generateTokens();
            var tokenListUI = document.getElementById("tokenList");
            // Check to see if verbose mode is enabled
            if (_verboseMode.checked) {
                JOEC.Utils.createNewMessage("\nToken List \n============ ");
                var nextToken;
                // Loop over the token array and print out the tokens and line numbers
                for (var i = 0; i < LA.tokenArray.length; i++) {
                    nextToken = LA.tokenArray[i];
                    JOEC.Utils.createNewMessage("< Value: " + nextToken.getValue() + " Kind: " + nextToken.getKind() + " Line Number: " + nextToken.getLineNumber() + " >");
                    $("#tokenList").append('<li class="hostLogListItem" style="height:75px;"> <p class="" >' + nextToken.getValue() + '<span class="label logCounter">' + "hostCounter" + '</span> </p> <span class="logDateTime">' + "test" + ' </span > <span class="logSource" >' + "source" + '</span> </li>');
                }
                JOEC.Utils.createNewMessage("============");
            }
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
            JOEC.Utils.createNewMessage("\nLex Completed... " + LA.tokenArray.length + " token(s) were found \n");
            // Update the UI and mark the lexer phase as complete
            var lexCheckUI = document.getElementById("lexCheck");
            lexCheckUI.style.visibility = "visible";
            // Update the UI remove the error mark 
            var lexremoveUI = document.getElementById("lexError");
            lexremoveUI.style.visibility = "hidden";
            // Create a new Parser
            var Par = new JOEC.Parser();
            JOEC.Utils.createNewMessage("Starting Parse! \n");
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
            JOEC.Utils.createNewMessage("\nParser Completed");
            // Output the CST
            JOEC.Utils.addNewCST(Par.CST.toString());
            JOEC.Utils.createNewMessage(Par.CST.toString());
            console.log(Par.CST);
            // Traverse the CST to create an AST
            Par.traverseCST();
            // Output the AST
            JOEC.Utils.addNewAST(Par.AST.toString());
            JOEC.Utils.createNewMessage(Par.AST.toString());
            console.log(Par.AST.toString());
            // Update the UI and mark the parser as complete
            var parseCheckUI = document.getElementById("parseCheck");
            parseCheckUI.style.visibility = "visible";
            //***************************************************\\
            //          Semantic Analysis Starting               \\
            //***************************************************\\
            // Create a Semantic Analyzer
            var SemanticAnalyzer = new JOEC.SemanticAnalyzer();
            SemanticAnalyzer.generateSymbolTable(Par.CST);
            // Check for any errors in semantic analysis
            if (SemanticAnalyzer.hasErrors) {
                // Tell the user
                JOEC.Utils.createNewErrorMessage("Compilation Failed :( ");
                // Update the parse UI with a error mark
                var parseremoveUI = document.getElementById("SAError");
                parseremoveUI.style.visibility = "visible";
                // Stop the comiler
                this.stopCompiler();
                return;
            }
            SemanticAnalyzer.checkForUnusedIndentifiers();
            // Update the User
            JOEC.Utils.createNewMessage("\nSemantic Analysis Completed");
            // Update the UI and mark the SA as complete
            var SACheckUI = document.getElementById("SACheck");
            SACheckUI.style.visibility = "visible";
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
        };
        /**
        * Stop Comiler
        *
        * Used to stop the compiler
        */
        Main.showVis = function () {
            $('#main').animate({
                'marginLeft': "-=30px" //moves left
            });
        };
        Main.openSidepage = function () {
            $('#mainpage').animate({
                left: '350px'
            }, 400, 'easeOutBack');
        };
        return Main;
    })();
    JOEC.Main = Main;
})(JOEC || (JOEC = {}));
