/* ------------
   Stack.ts
   A simple Stack, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.
   ------------ */

module JOEC {
    export class Stack {
        constructor(public s = new Array()) {
        }

        public getSize() {
            return this.s.length;
        }

        public isEmpty() {
            return (this.s.length == 0);
        }

        public push(element) {
            this.s.push(element);
        }
        public pop() {
            return this.s.pop();
        }
        public peek() {
			return this.s[this.s.length - 1];
        }
        public toString() {
            var retVal = "";
            for (var i in this.s) {
                retVal += "[" + this.s[i] + "] ";
            }
            return retVal;
        }
    }
}