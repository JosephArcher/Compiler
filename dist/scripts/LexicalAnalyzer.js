///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="Token.ts"/>
var JOEC;
(function (JOEC) {
    var LexicalAnalyzer = (function () {
        function LexicalAnalyzer(_SourceCode) {
            this.sourceCode = ""; // The source code to be compiled
            this.tokenArray = []; // Holds in order all of the tokens that have been created
            this.hasErrors = false;
            this.lineNumber = 1; // The current line number
            this.currentCharacters = "";
            this.currentPos = 0; // The current pos
            this.lookAheadPos = 0;
            this.lookAheadStates = [];
            // Source Code
            this.sourceCode = _SourceCode;
            // Create the transition table
            this.createTransitionTable();
        }
        LexicalAnalyzer.prototype.isAlpha = function (chara) {
        };
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
        LexicalAnalyzer.prototype.checkForAcceptState = function (state) {
            switch (state) {
                // END OF FILE
                case 1:
                    console.log("$ Found");
                    this.tokenArray.push(new JOEC.Token("EOF", this.lineNumber, "$"));
                    JOEC.Utils.createNewUpdateMessage("$ Token Found on line " + this.lineNumber);
                    break;
                // {
                case 2:
                    console.log("{ Found");
                    this.tokenArray.push(new JOEC.Token("Left_Bracket", this.lineNumber, "{"));
                    JOEC.Utils.createNewUpdateMessage("{ Token Found on line " + this.lineNumber);
                    break;
                case 3:
                    // }
                    console.log("} Found");
                    this.tokenArray.push(new JOEC.Token("Right_Backet", this.lineNumber, "}"));
                    JOEC.Utils.createNewUpdateMessage("} Token Found on line " + this.lineNumber);
                    break;
                // (
                case 4:
                    console.log("( Found");
                    this.tokenArray.push(new JOEC.Token("Left_Para", this.lineNumber, "("));
                    JOEC.Utils.createNewUpdateMessage("( Token Found on line " + this.lineNumber);
                    break;
                // )
                case 5:
                    console.log(") Found");
                    this.tokenArray.push(new JOEC.Token("Right_Para", this.lineNumber, ")"));
                    JOEC.Utils.createNewUpdateMessage(") Token Found on line " + this.lineNumber);
                    break;
                // !
                case 6:
                    console.log("! Found");
                    this.tokenArray.push(new JOEC.Token("Symbol", this.lineNumber, "!"));
                    JOEC.Utils.createNewUpdateMessage("! Token Found on line " + this.lineNumber);
                    break;
                // +
                case 7:
                    console.log("+ Found");
                    this.tokenArray.push(new JOEC.Token("Plus_Sign", this.lineNumber, "+"));
                    JOEC.Utils.createNewUpdateMessage("+ Token Found on line " + this.lineNumber);
                    break;
                // =
                case 8:
                    console.log("= Found");
                    this.tokenArray.push(new JOEC.Token("Equal_Sign", this.lineNumber, "="));
                    JOEC.Utils.createNewUpdateMessage("= Token Found on line " + this.lineNumber);
                    break;
                // Type
                case 11:
                    console.log("Type Found");
                    this.tokenArray.push(new JOEC.Token("Type", this.lineNumber, this.currentCharacters.trim()));
                    JOEC.Utils.createNewUpdateMessage("Type Token " + this.currentCharacters.trim() + " Found on line " + this.lineNumber);
                    break;
                // Print
                case 16:
                    console.log("print keyword Found");
                    this.tokenArray.push(new JOEC.Token("Keyword", this.lineNumber, "print"));
                    JOEC.Utils.createNewUpdateMessage("print Token Found on line " + this.lineNumber);
                    break;
                // Digit
                case 17:
                    console.log("Digit Found");
                    this.tokenArray.push(new JOEC.Token("Digit", this.lineNumber, this.currentCharacters.trim()));
                    JOEC.Utils.createNewUpdateMessage("digit Token Found on line " + this.lineNumber);
                    break;
                // String
                case 31:
                    console.log("String Found");
                    this.tokenArray.push(new JOEC.Token("String", this.lineNumber, this.currentCharacters));
                    JOEC.Utils.createNewUpdateMessage("String  " + this.currentCharacters + " Token Found on line " + this.lineNumber);
                    break;
                // Identifier
                case 32:
                    console.log("ID Found");
                    this.tokenArray.push(new JOEC.Token("Identifier", this.lineNumber, this.currentCharacters.trim()));
                    JOEC.Utils.createNewUpdateMessage("ID  " + this.currentCharacters + " Token Found on line " + this.lineNumber);
                    break;
                // Boolean value
                case 36:
                    console.log("BoolVal Found");
                    this.tokenArray.push(new JOEC.Token("BoolVal", this.lineNumber, this.currentCharacters.trim()));
                    JOEC.Utils.createNewUpdateMessage("BoolVal " + this.currentCharacters + " Token Found on line " + this.lineNumber);
                    break;
                // If
                case 41:
                    console.log("If Found");
                    this.tokenArray.push(new JOEC.Token("Keyword", this.lineNumber, this.currentCharacters.trim()));
                    JOEC.Utils.createNewUpdateMessage("If " + this.currentCharacters + " Token Found on line " + this.lineNumber);
                    break;
                // Invalid Keyword Fix
                case 42:
                    console.log("Invalid Keyword Fix");
                    // Loop over the current characters and make an identifier out of each
                    for (var i = 0; i < this.currentCharacters.length; i++) {
                        // Check to see if the character is a space
                        if (this.currentCharacters.charAt(i) == " ") {
                        }
                        else if (this.isSymbol(this.currentCharacters.charAt(i))) {
                            this.tokenArray.push(new JOEC.Token("Symbol", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                            JOEC.Utils.createNewUpdateMessage("Symbol " + this.currentCharacters.charAt(i).trim() + " Token Found on line " + this.lineNumber);
                        }
                        else if (this.isDigit(this.currentCharacters.charAt(i))) {
                            this.tokenArray.push(new JOEC.Token("Digit", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                            JOEC.Utils.createNewUpdateMessage("Digit " + this.currentCharacters.charAt(i) + " Token Found on line " + this.lineNumber);
                        }
                        else {
                            this.tokenArray.push(new JOEC.Token("Identifier", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                            JOEC.Utils.createNewUpdateMessage("ID " + this.currentCharacters.charAt(i) + " Token Found on line " + this.lineNumber);
                        }
                    }
                    break;
                default:
                    return false;
            }
            return true;
        };
        LexicalAnalyzer.prototype.writeOutCharacter = function (toWrite) {
            console.log("write out leftover Fix");
            // Loop over the current characters and make an identifier out of each
            for (var i = 0; i < this.currentCharacters.length; i++) {
                // Check to see if the character is a space
                if (this.currentCharacters.charAt(i) == " ") {
                }
                else if (this.isSymbol(this.currentCharacters.charAt(i))) {
                    this.tokenArray.push(new JOEC.Token("Symbol", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                    JOEC.Utils.createNewUpdateMessage("Symbol " + this.currentCharacters.charAt(i).trim() + " Token Found on line " + this.lineNumber);
                }
                else if (this.isDigit(this.currentCharacters.charAt(i))) {
                    this.tokenArray.push(new JOEC.Token("Digit", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                    JOEC.Utils.createNewUpdateMessage("Digit " + this.currentCharacters.charAt(i) + " Token Found on line " + this.lineNumber);
                }
                else {
                    this.tokenArray.push(new JOEC.Token("Identifier", this.lineNumber, this.currentCharacters.charAt(i).trim()));
                    JOEC.Utils.createNewUpdateMessage("ID " + this.currentCharacters.charAt(i) + " Token Found on line " + this.lineNumber);
                }
            }
        };
        LexicalAnalyzer.prototype.generateTokens = function () {
            // Create variables
            var currentState = 0; // The current state
            var nextState;
            var nextCharacter;
            var insideString = 0;
            var nextTablePosition;
            var holder = "";
            // Loop over the source code
            for (var i = 0; i < this.sourceCode.length; i++) {
                //this.currentPos = this.currentPos + 1;
                // Check to see if the next character is a line number and if so then increase the counter and get next character
                if (this.sourceCode.charCodeAt(i) == 10) {
                    this.lineNumber++;
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
        LexicalAnalyzer.prototype.createTransitionTable = function () {
            _transitionTable = [
                // 00 * 01 * 02 * 03 * 04 * 05 * 06 * 07 * 08 * 09 * 10 * 11 * 12 * 13 * 14 * 15 * 16 * 17 * 18 * 19 * 20 * 21 * 22 * 23 * 24 * 25 * 26 * 27 * 28 * 29 * 30 * 31 * 32 * 33 * 34 * 35 * 36 * 37 * 38 * 39 * 40 * 41 * 42 * 43 * 44 * 45	
                //  a *  b *  c *  d *  e *  f *  g *  h *  i *  j *  k *  l *  m *  n *  o *  p *  q *  r *  s *  t *  u *  v *  w *  x *  y *  z *  0 *  1 *  2 *  3 *  4 *  5 *  6 *  7 *  8 *  9 *  $ *  { *  } *  ( *  ) *  ! *  + *    *  = *  " 
                /* 00 */ [32, 18, 32, 32, 32, 0, 32, 32, 9, 32, 32, 32, 32, 32, 32, 12, 32, 32, 24, 33, 32, 32, 0, 32, 32, 32, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 1, 2, 3, 4, 5, 6, 7, 0, 8, 30],
                /* 01 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 02 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 03 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 04 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 05 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 06 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 07 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 08 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 09 */ [0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0],
                /* 10 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 11 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 12 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 13 */ [0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 14 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 15 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 16 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 17 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 18 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 19, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 19 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 20, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 20 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 21, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                /* 21 */ [0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 22 */ [23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 23 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 24 */ [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 25, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 24, 42, 42],
                /* 25 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 26 */ [0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 27 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 28 */ [0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 29 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 30 */ [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 31],
                /* 31 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 32 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 33 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 34 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 35 */ [0, 0, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 36 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 37 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 38 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 39 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 40 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 41 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 42 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 43 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 44 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 45 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 46 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                /* 47 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
