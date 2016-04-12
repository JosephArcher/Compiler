///<reference path="Utils.ts"/>
///<reference path="Globals.ts"/>
///<reference path="LexicalAnalyzer.ts"/>
///<reference path="Token.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Queue.ts"/>
///<reference path="Tree.ts"/>
var JOEC;
(function (JOEC) {
    /*
     * Variable
     */
    var Variable = (function () {
        function Variable(name, type) {
            this.name = null;
            this.type = null;
            this.value = null;
            this.name = name;
            this.type = type;
        }
        return Variable;
    })();
    JOEC.Variable = Variable;
})(JOEC || (JOEC = {}));
