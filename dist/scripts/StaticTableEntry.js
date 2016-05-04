var JOEC;
(function (JOEC) {
    /*
     * Static Table
     */
    var StaticTableEntry = (function () {
        function StaticTableEntry(name, type, scope) {
            this.Temp = "";
            this.Var = "";
            this.type = "";
            this.Scope = "";
            this.address = "";
            this.Var = name;
            this.type = type;
            this.Scope = scope;
        }
        return StaticTableEntry;
    })();
    JOEC.StaticTableEntry = StaticTableEntry;
})(JOEC || (JOEC = {}));
