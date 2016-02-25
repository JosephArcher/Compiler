/*
 * Global Variables
*/

var _isRunning: boolean = false;  // Determines if the compiler is running or not
var _alphabet = {}; 			  // The list of possible characters in the language
var _transitionTable;             // The matrix used to for the lexer
var _verboseMode;				  // Determines if the compiler is in verbose mode 
