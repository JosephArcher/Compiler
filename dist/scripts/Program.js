///<reference path="Tree.ts"/>
var JOEC;
(function (JOEC) {
    var Program = (function () {
        function Program(_id, _code) {
            this.id = _id;
            this.sourceCode = _code;
        }
        return Program;
    })();
    JOEC.Program = Program;
})(JOEC || (JOEC = {}));
