///<reference path="Globals.ts"/>
var JOEC;
(function (JOEC) {
    var Utils = (function () {
        function Utils() {
        }
        /**
        * Creates a mapping on each character that can be used in the language to its pos in the transition table
        *
        */
        Utils.initAlphabet = function () {
            _alphabet["a"] = { pos: 0 };
            _alphabet["b"] = { pos: 1 };
            _alphabet["c"] = { pos: 2 };
            _alphabet["d"] = { pos: 3 };
            _alphabet["e"] = { pos: 4 };
            _alphabet["f"] = { pos: 5 };
            _alphabet["g"] = { pos: 6 };
            _alphabet["h"] = { pos: 7 };
            _alphabet["i"] = { pos: 8 };
            _alphabet["j"] = { pos: 9 };
            _alphabet["k"] = { pos: 10 };
            _alphabet["l"] = { pos: 11 };
            _alphabet["m"] = { pos: 12 };
            _alphabet["n"] = { pos: 13 };
            _alphabet["o"] = { pos: 14 };
            _alphabet["p"] = { pos: 15 };
            _alphabet["q"] = { pos: 16 };
            _alphabet["r"] = { pos: 17 };
            _alphabet["s"] = { pos: 18 };
            _alphabet["t"] = { pos: 19 };
            _alphabet["u"] = { pos: 20 };
            _alphabet["v"] = { pos: 21 };
            _alphabet["w"] = { pos: 22 };
            _alphabet["x"] = { pos: 23 };
            _alphabet["y"] = { pos: 24 };
            _alphabet["z"] = { pos: 25 };
            _alphabet["0"] = { pos: 26 };
            _alphabet["1"] = { pos: 27 };
            _alphabet["2"] = { pos: 28 };
            _alphabet["3"] = { pos: 29 };
            _alphabet["4"] = { pos: 30 };
            _alphabet["5"] = { pos: 31 };
            _alphabet["6"] = { pos: 32 };
            _alphabet["7"] = { pos: 33 };
            _alphabet["8"] = { pos: 34 };
            _alphabet["9"] = { pos: 35 };
            _alphabet["$"] = { pos: 36 };
            _alphabet["{"] = { pos: 37 };
            _alphabet["}"] = { pos: 38 };
            _alphabet["("] = { pos: 39 };
            _alphabet[")"] = { pos: 40 };
            _alphabet["!"] = { pos: 41 };
            _alphabet["+"] = { pos: 42 };
            _alphabet[" "] = { pos: 43 };
            _alphabet["="] = { pos: 44 };
            _alphabet["\""] = { pos: 45 };
            console.log(_alphabet[" "]);
        };
        Utils.getCharacterPosition = function (character) {
            if (_alphabet[character]) {
                var joe = _alphabet[character].pos;
                return joe;
            }
            console.log("Unknown character found");
            return null;
        };
        return Utils;
    })();
    JOEC.Utils = Utils;
})(JOEC || (JOEC = {}));
