///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="d3.d.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="TypeChecker.ts" />
/// <reference path="CodeGenerator.ts" />
/// <reference path="CodeGenerator.ts" />
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
            // Clear/Reset the Interface and Sidebar
            JOEC.Utils.resetCompilerStatusBar();
            JOEC.Utils.resetUISideBar();
            JOEC.Utils.createNewMessage("Starting Up Joe's Compiler!\n");
            // Get the source code
            var sourceCode = JOEC.Utils.getSourceCode();
            // Check to see if any source code exists
            if (sourceCode.length < 1) {
                // Tell the user and stop 
                JOEC.Utils.createNewErrorMessage("No Source Code Found !");
                this.stopCompiler();
                return;
            }
            // Break Up the Source Code into Programs based on the number of dollar sign's
            // Arrays to hold the program strings
            var tempPrograms = [];
            var programs = [];
            // Program Object
            var program;
            // Split the programs into an array
            tempPrograms = sourceCode.split("$");
            // Loop over the programs adding a dollar sign to the end of each one
            for (var i = 0; i < tempPrograms.length - 1; i++) {
                // Get the next program from the array
                var nextProgram = tempPrograms[i];
                // Append a dollar sign to the end cause the split is taking them away for some reason
                nextProgram = nextProgram + "$";
                program = new JOEC.Program(i, nextProgram);
                // Compile the next 	program
                this.compileProgram(program);
            }
        };
        Main.compileProgram = function (program) {
            // Clear/Reset the Interface and Sidebar
            JOEC.Utils.resetCompilerStatusBar();
            JOEC.Utils.resetUISideBar();
            // Tell the user what program is being compiled
            JOEC.Utils.createNewMessage("\nStarting to compile program number " + program.id + "\n");
            //***************************************************\\
            //                 Lexical  Analysis                 \\
            //***************************************************\\
            // Create a new Lexical Analzer
            var LA = new JOEC.LexicalAnalyzer(program.sourceCode);
            // Generate the tokens
            LA.generateTokens();
            // Check to see if verbose mode is enabled
            if (_verboseMode.checked) {
                JOEC.Utils.createNewMessage("\nToken List \n============ ");
                var nextToken;
                // Loop over the token array and print out the tokens and line numbers
                for (var i = 0; i < LA.tokenArray.length; i++) {
                    nextToken = LA.tokenArray[i];
                    JOEC.Utils.createNewMessage("< Value: " + nextToken.getValue() + " Kind: " + nextToken.getKind() + " Line Number: " + nextToken.getLineNumber() + " >");
                    JOEC.Utils.addNewToken(nextToken);
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
            //***************************************************\\
            //                      Parser                       \\
            //***************************************************\\
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
            if (_verboseMode.checked) {
                JOEC.Utils.createNewMessage("\nConcrete Syntax Tree");
                JOEC.Utils.createNewMessage("----------------------");
                JOEC.Utils.createNewMessage(Par.CST.toString());
            }
            // Traverse the CST to create an AST
            Par.traverseCST();
            // Output the AST
            JOEC.Utils.addNewAST(Par.AST.toString());
            if (_verboseMode.checked) {
                JOEC.Utils.createNewMessage("\nAbstract Syntax Tree");
                JOEC.Utils.createNewMessage("----------------------");
                JOEC.Utils.createNewMessage(Par.AST.toString());
            }
            // Update the UI and mark the parser as complete
            var parseCheckUI = document.getElementById("parseCheck");
            parseCheckUI.style.visibility = "visible";
            //***************************************************\\
            //                 Semantic Analysis                 \\
            //***************************************************\\
            JOEC.Utils.createNewMessage("Starting Semantic Analysis");
            // Create a Semantic Analyzer
            var SemanticAnalyzer = new JOEC.SemanticAnalyzer(Par.CST, Par.AST);
            // Run a check for scope and build the symbol table then check for type
            SemanticAnalyzer.analyze();
            // If either the scope or type check fail
            if (SemanticAnalyzer.hasErrors) {
                // Tell the user
                JOEC.Utils.createNewErrorMessage("Compilation Failed :( ");
                // Update the Semantic Analysis UI with a error mark
                var SAErrorUI = document.getElementById("SAError");
                SAErrorUI.style.visibility = "visible";
                // Stop the comiler
                this.stopCompiler();
                return;
            }
            // Output the Symbol Table
            JOEC.Utils.newHeadOfSymbolTable();
            // Check the symbol table for unused Identifiers
            SemanticAnalyzer.checkForUnusedIdentifiers();
            // Update the User
            JOEC.Utils.createNewMessage("\nSemantic Analysis Completed");
            // Update the UI and mark the SA as complete
            var SACheckUI = document.getElementById("SACheck");
            SACheckUI.style.visibility = "visible";
            //***************************************************\\
            //                  Code Generation                  \\
            //***************************************************\\
            // Create the code generator
            var CodeGenerator = new JOEC.CodeGenerator();
            // Start to generate code
            CodeGenerator.generateCode(Par.AST);
            // Check to see if any errors
            if (CodeGenerator.hasErrors) {
                // Tell the user
                JOEC.Utils.createNewErrorMessage("Compilation Failed :( ");
                // Update the Semantic Analysis UI with a error mark
                var codeGenErrorUI = document.getElementById("codeGenError");
                codeGenErrorUI.style.visibility = "visible";
                // Stop the comiler
                this.stopCompiler();
                return;
            }
            console.log("Static Table");
            console.log(CodeGenerator.staticTable);
            // Update the User
            JOEC.Utils.createNewMessage("\nCode Generation Completed");
            // Add the code to UI in a nice way
            var nextRow = "";
            var code = [];
            code = CodeGenerator.programCode;
            for (var i = 0; i < 256; i = i + 8) {
                nextRow = code[i] + "  " + code[i + 1] + "  " + code[i + 2] + "  " + code[i + 3] + "  " + code[i + 4] + "  " + code[i + 5] + "  " + code[i + 6] + "  " + code[i + 7] + "\n";
                JOEC.Utils.writeNextRowOfCode(nextRow);
            }
            // Update the UI and mark the codeGenCheck as complete
            var codeGenCheckUI = document.getElementById("codeGenCheck");
            codeGenCheckUI.style.visibility = "visible";
            // End Compilation
            JOEC.Utils.createNewMessage("\n Compilation Completed Successfully :)");
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
        return Main;
    })();
    JOEC.Main = Main;
})(JOEC || (JOEC = {}));
