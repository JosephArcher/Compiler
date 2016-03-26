var JOEC;
(function (JOEC) {
    var Token = (function () {
        function Token(_kind, _lineNumber, _value) {
            this.kind = _kind;
            this.lineNumber = _lineNumber;
            this.value = _value;
        }
        Token.prototype.getValue = function () {
            return this.value;
        };
        Token.prototype.getKind = function () {
            return this.kind;
        };
        Token.prototype.getLineNumber = function () {
            return this.lineNumber;
        };
        return Token;
    })();
    JOEC.Token = Token;
})(JOEC || (JOEC = {}));
