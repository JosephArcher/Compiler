function testProgram1() {
    console.log("Test Program 1 Called");
    var sourceCodeHTML = document.getElementById("programInput");
    sourceCodeHTML.value = "{" +
        "\n  int a" +
        "\n a = 1" +
        "\n print(a)" +
        "\n }$";
}
function testProgram2() {
    console.log("Test Program 2 Called");
    var sourceCodeHTML = document.getElementById("programInput");
    sourceCodeHTML.value = "{" +
        "\n \t int b" +
        "\n \t b = 1" +
        "\n \t print(b)";
}
function testProgram3() {
    console.log("Test Program 3 Called");
    var sourceCodeHTML = document.getElementById("programInput");
    sourceCodeHTML.value = "{" +
        "\n \t int c" +
        "\n \t c = 1" +
        "\n \t print(c)";
}
function testProgram4() {
    console.log("Test Program 4 Called");
    var sourceCodeHTML = document.getElementById("programInput");
    sourceCodeHTML.value = "{" +
        "\n \t int d" +
        "\n \t d = 1" +
        "\n \t print(d)";
}
