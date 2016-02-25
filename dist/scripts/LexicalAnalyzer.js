///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
var JOEC;
(function (JOEC) {
    /*
    * Lexical Analyzer
    */
    var LexicalAnalyzer = (function () {
        function LexicalAnalyzer(_SourceCode) {
            this.sourceCode = ""; // The source code to be compiled
            this.tokenArray = []; // Holds in order all of the tokens that have been created
            this.hasErrors = false; // Determines if the lexer has any errors
            this.lineNumber = 1; // The current line number
            this.currentCharacters = ""; // The current characters that are being looked at
            // Source Code
            this.sourceCode = _SourceCode;
            // Create the transition table
            this.createTransitionTable();
        }
        LexicalAnalyzer.prototype.isSymbol = function (chara) {
            if (chara == "$" || chara == "{" || chara == "}" || chara == "(" || chara == ")" || chara == "\"" || chara == "=" || chara == "!" || chara == "+") {
                return true;
            }
            else {
                return false;
            }
        };
        LexicalAnalyzer.prototype.isDigit = function (chara) {
            if (chara == "1" || chara == "2" || chara == "3" || chara == "4" || chara == "5" || chara == "6" || chara == "7" || chara == "8" || chara == "9" || chara == "0") {
                return true;
            }
            else {
                return false;
            }
        };
        /*
         * checkForErrorState
         * Looks at a given number that represents a location in the transition
         * table matrix and determines if it is an error state
         *
         * Params
         *	State - the state to check
         */
        LexicalAnalyzer.prototype.checkForErrorState = function (state) {
            switch (state) {
                case 44:
                    JOEC.Utils.createNewErrorMessage("An invalid character was found inside of the string on line " + this.lineNumber);
                    return true;
                default:
                    return false;
            }
            return true;
        };
        /*
         * checkForAcceptState
         * Looks at a given number that represents a location in the transition
         * table matrix and determines if it is an accept state
         *
         * Params
         *	State - the state to check
         */
        LexicalAnalyzer.prototype.checkForAcceptState = function (state) {
            switch (state) {
                // EOF (Dollar Sign)
                case 1:
                    this.tokenArray.push(new JOEC.Token("EOF", this.lineNumber, "$"));
                    break;
                // {
                case 2:
                    this.tokenArray.push(new JOEC.Token("Left_Bracket", this.lineNumber, "{"));
                    break;
                case 3:
                    // }
                    this.tokenArray.push(new JOEC.Token("Right_Backet", this.lineNumber, "}"));
                    break;
                // (
                case 4:
                    this.tokenArray.push(new JOEC.Token("Left_Para", this.lineNumber, "("));
                    break;
                // )
                case 5:
                    this.tokenArray.push(new JOEC.Token("Right_Para", this.lineNumber, ")"));
                    break;
                // !
                case 6:
                    this.tokenArray.push(new JOEC.Token("Symbol", this.lineNumber, "!"));
                    break;
                // +
                case 7:
                    this.tokenArray.push(new JOEC.Token("Plus_Sign", this.lineNumber, "+"));
                    break;
                // =
                case 8:
                    this.tokenArray.push(new JOEC.Token("Equal_Sign", this.lineNumber, "="));
                    break;
                // Type
                case 11:
                    this.tokenArray.push(new JOEC.Token("Type", this.lineNumber, this.currentCharacters.trim()));
                    break;
                // Print
                case 16:
                    this.tokenArray.push(new JOEC.Token("Keyword", this.lineNumber, "print"));
                    break;
                // Digit
                case 17:
                    this.tokenArray.push(new JOEC.Token("Digit", this.lineNumber, this.currentCharacters.trim()));
                    break;
                // String
                case 31:
                    this.tokenArray.push(new JOEC.Token("String", this.lineNumber, this.currentCharacters));
                    break;
                // Identifier
                case 32:
                    this.tokenArray.push(new JOEC.Token("Identifier", this.lineNumber, this.currentCharacters.trim()));
                    break;
                // Boolean value ( true | false )
                case 36:
                    this.tokenArray.push(new JOEC.Token("BoolVal", this.lineNumber, this.currentCharacters.trim()));
                    break;
                // if
                case 41:
                    this.tokenArray.push(new JOEC.Token("Keyword", this.lineNumber, this.currentCharacters.trim()));
                    break;
                // while
                case 48:
                    this.tokenArray.push(new JOEC.Token("Keyword", this.lineNumber, this.currentCharacters.trim()));
                    break;
                // Invalid Keyword Fix
                case 42:
                    // Loop over the current characters and make an identifier out of each
                    for (var i = 0; i < this.currentCharacters.length; i++) {
                        // Check to see if this is the last time and if so write out the current string
                        if (i == this.currentCharacters.length - 1) {
                            // ALAN IF YOU EVER SEE THIS ... ThiS line of code might have saved me... also hello!
                            this.sourceCode = this.currentCharacters.charAt(this.currentCharacters.length - 1) + this.sourceCode;
                        }
                        else {
                            // Check to see if the character is a space
                            if (this.currentCharacters.charAt(i) == " ") {
                            }
                            else if (this.isSymbol(this.currentCharacters.charAt(i))) {
                                this.tokenArray.push(new JOEC.Token("Symbol", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                            }
                            else if (this.isDigit(this.currentCharacters.charAt(i))) {
                                console.log("DIGIT BROKE? 1");
                                this.tokenArray.push(new JOEC.Token("Digit", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                            }
                            else {
                                this.tokenArray.push(new JOEC.Token("Identifier", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                            }
                        }
                    }
                    break;
                default:
                    return false;
            }
            return true;
        };
        /*
        * writeOutCharacter
        *
        * Used to handle what happens if the lexer
        * still has current characters and is trying to
        * end the phase
        *
        * Params
        *	toWrite - the string of leftover charcters
        */
        LexicalAnalyzer.prototype.writeOutCharacter = function (toWrite) {
            // Loop over the current characters and make an identifier out of each and place and last character read back into the source
            for (var i = 0; i < this.currentCharacters.length; i++) {
                // Check to see if the character is a space
                if (this.currentCharacters.charAt(i) == " ") {
                }
                else if (this.isSymbol(this.currentCharacters.charAt(i))) {
                    this.tokenArray.push(new JOEC.Token("Symbol", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                }
                else if (this.isDigit(this.currentCharacters.charAt(i))) {
                    this.tokenArray.push(new JOEC.Token("Digit", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                }
                else {
                    this.tokenArray.push(new JOEC.Token("Identifier", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                }
            }
        };
        /*
         * generateTokens
         *
         * Used to generate an array of tokens from the source code
         * provided in the HTML TextArea
         */
        LexicalAnalyzer.prototype.generateTokens = function () {
            // Create variables
            var currentState = 0; // The current state
            var nextState;
            var nextCharacter;
            var insideString = 0;
            var nextTablePosition;
            var holder = "";
            JOEC.Utils.createNewMessage("Starting Lexical Analysis!");
            // Loop over the source code
            for (var i = 0; i < this.sourceCode.length; i++) {
                // Check to see if the next character is a line number and if so then increase the counter and get next character
                if (this.sourceCode.charCodeAt(i) == 10) {
                    console.log("Adding to the new line");
                    ++this.lineNumber;
                }
                else {
                    // Get the next character value
                    nextCharacter = this.sourceCode.charAt(i);
                    this.currentCharacters = this.currentCharacters + nextCharacter;
                    console.log("Next Character: " + nextCharacter);
                    // Get the table position of the character
                    nextTablePosition = JOEC.Utils.getCharacterPosition(nextCharacter);
                    // Check to see if there is an error
                    if (nextTablePosition == null) {
                        JOEC.Utils.createNewErrorMessage("Unknown character " + this.currentCharacters + " found on line " + this.lineNumber);
                        this.hasErrors = true;
                        return;
                    }
                    // Lookup in the matrix to find out where to go next
                    nextState = _transitionTable[currentState][nextTablePosition];
                    // Check the new state to see if it is an accepting state
                    if (this.checkForAcceptState(nextState)) {
                        currentState = 0;
                        this.currentCharacters = "";
                    }
                    else if (this.checkForErrorState(nextState)) {
                        this.hasErrors = true;
                        break;
                    }
                    else {
                        console.log("else if firing");
                        currentState = nextState;
                    }
                }
                // Check to see if this is the last time and if so write out the current string
                if (i == this.sourceCode.length - 1) {
                    this.writeOutCharacter(this.currentCharacters);
                }
            }
        };
        /*
         * createTransitionTable
         *
         * Used to create the matrix transition table
         */
        LexicalAnalyzer.prototype.createTransitionTable = function () {
            _transitionTable = [
                // 00 * 01 * 02 * 03 * 04 * 05 * 06 * 07 * 08 * 09 * 10 * 11 * 12 * 13 * 14 * 15 * 16 * 17 * 18 * 19 * 20 * 21 * 22 * 23 * 24 * 25 * 26 * 27 * 28 * 29 * 30 * 31 * 32 * 33 * 34 * 35 * 36 * 37 * 38 * 39 * 40 * 41 * 42 * 43 * 44 * 45	
                //  a *  b *  c *  d *  e *  f *  g *  h *  i *  j *  k *  l *  m *  n *  o *  p *  q *  r *  s *  t *  u *  v *  w *  x *  y *  z *  0 *  1 *  2 *  3 *  4 *  5 *  6 *  7 *  8 *  9 *  $ *  { *  } *  ( *  ) *  ! *  + *    *  = *  " 
                /* 00 */ [32, 18, 32, 32, 32, 37, 32, 32, 9, 32, 32, 32, 32, 32, 32, 12, 32, 32, 24, 33, 32, 32, 43, 32, 32, 32, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 1, 2, 3, 4, 5, 6, 7, 0, 8, 30],
                /* 01 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 02 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 03 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 04 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 05 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 06 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 07 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 08 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 09 */ [42, 42, 42, 42, 42, 41, 42, 42, 42, 42, 42, 42, 42, 10, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 10 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 11, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 11 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 12 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 13, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 13 */ [42, 42, 42, 42, 42, 42, 42, 42, 14, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 14 */ [42, 42, 42, 42, 42, 42, 42, 42, 14, 42, 42, 42, 42, 15, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 15 */ [42, 42, 42, 42, 42, 42, 42, 42, 14, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 16, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 16 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 17 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 18 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 19, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 19 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 20, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 20 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 21, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 21 */ [42, 42, 42, 42, 22, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 22 */ [23, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 23 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 11, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 24 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 25, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 25 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 26, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 26 */ [42, 42, 42, 42, 42, 42, 42, 42, 27, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 27 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 28, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 28 */ [42, 42, 42, 42, 42, 42, 11, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 29 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 30 */ [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 30, 44, 31],
                /* 31 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 32 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 33 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 34, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 34 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 35, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 35 */ [42, 42, 42, 42, 36, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 36 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 37 */ [38, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 38 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 39, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 39 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 40, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 40 */ [42, 42, 42, 42, 36, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 41 */ [42, 42, 42, 42, 42, 42, 42, 43, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 42 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 43 */ [42, 42, 42, 42, 42, 42, 42, 45, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 44 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 45 */ [42, 42, 42, 42, 46, 42, 42, 42, 46, 42, 42, 46, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 46 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 47, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 47 */ [42, 42, 42, 42, 48, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 48 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 49 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 50 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 51 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 52 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ];
        };
        return LexicalAnalyzer;
    })();
    JOEC.LexicalAnalyzer = LexicalAnalyzer;
})(JOEC || (JOEC = {}));
