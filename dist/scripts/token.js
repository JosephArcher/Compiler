var JOEC;
(function (JOEC) {
    var Token = (function () {
        function Token(_kind, _value) {
            this.kind = _kind;
            this.value = _value;
        }
        Token.prototype.getValue = function () {
            return this.value;
        };
        Token.prototype.getKind = function () {
            return this.kind;
        };
        return Token;
    })();
    JOEC.Token = Token;
})(JOEC || (JOEC = {}));
