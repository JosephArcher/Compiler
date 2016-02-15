var JOEC;
(function (JOEC) {
    var Token = (function () {
        function Token(_kind, _value) {
            this.kind = _kind;
            this.value = _value;
        }
        return Token;
    })();
    JOEC.Token = Token;
})(JOEC || (JOEC = {}));
