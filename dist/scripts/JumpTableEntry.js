var JOEC;
(function (JOEC) {
    /*
     * Jump Table Entry
     */
    var JumpTableEntry = (function () {
        function JumpTableEntry(temp) {
            this.Temp = "";
            this.address = "";
            this.Temp = temp;
        }
        return JumpTableEntry;
    })();
    JOEC.JumpTableEntry = JumpTableEntry;
})(JOEC || (JOEC = {}));
