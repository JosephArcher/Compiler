/* ------------
   Stack.ts
   A simple Stack, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.
   ------------ */
var JOEC;
(function (JOEC) {
    var Stack = (function () {
        function Stack(s) {
            if (s === void 0) { s = new Array(); }
            this.s = s;
        }
        Stack.prototype.getSize = function () {
            return this.s.length;
        };
        Stack.prototype.isEmpty = function () {
            return (this.s.length == 0);
        };
        Stack.prototype.push = function (element) {
            this.s.push(element);
        };
        Stack.prototype.pop = function () {
            return this.s.pop();
        };
        Stack.prototype.peek = function () {
            return this.s[this.s.length - 1];
        };
        Stack.prototype.toString = function () {
            var retVal = "";
            for (var i in this.s) {
                retVal += "[" + this.s[i] + "] ";
            }
            return retVal;
        };
        return Stack;
    })();
    JOEC.Stack = Stack;
})(JOEC || (JOEC = {}));
