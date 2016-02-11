var JOEC;
(function (JOEC) {
    var LexicalAnalyzer = (function () {
        function LexicalAnalyzer() {
            // The source code to be compiled
            this.sourceCode = "";
        }
        /**
        * Get the Source Code
        *
        */
        LexicalAnalyzer.prototype.getSourceCode = function () {
            var sourceCodeHTML = document.getElementById("programInput");
            console.log(sourceCodeHTML.value.replace(/\s/g, ''));
            return sourceCodeHTML.value.replace(/\s/g, '');
        };
        LexicalAnalyzer.prototype.generateTokens = function (sourceCode) {
            var nextChar;
            // Loop over the string and find the lexems
            for (var i = 0; i < sourceCode.length; i++) {
                // Get the next character in the source code
                nextChar = sourceCode.charAt(i);
            }
        };
        return LexicalAnalyzer;
    })();
    JOEC.LexicalAnalyzer = LexicalAnalyzer;
})(JOEC || (JOEC = {}));
