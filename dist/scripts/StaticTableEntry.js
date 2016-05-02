var JOEC;
(function (JOEC) {
    /*
     * Static Table
     */
    var StaticTableEntry = (function () {
        function StaticTableEntry() {
            this.Temp = "";
            this.Var = "";
            this.Scope = "";
            this.address = "";
        }
        return StaticTableEntry;
    })();
    JOEC.StaticTableEntry = StaticTableEntry;
})(JOEC || (JOEC = {}));
