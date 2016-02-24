var _isRunning = false;
var _alphabet = {}; // The list of possible characters in the game, the index is the column lookup for transitiontable
var _transitionTable;
var _hasErrors = false;
var _isVerbose = document.getElementById("verboseCheckbox");
