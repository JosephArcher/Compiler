/*
    TEST PROGRAMS

    Lex Test Programs

 Test Program 1 (Keywords)

{
print
while
if
int
string
boolean
false
true
}$

Test Program 2 (Symbols)

{
{
}
(
)
$
"
=
!
+
}$


Test Program 3 (IDs)

{
abcd
efgh
ijkl
mnop
qrst
uvwx
yz
}$

Test Program 4 (Incorrect Character)
{
hello >

}$

Test Program 5 (Basic print program)

{
int a
a = 1
print(a)
}$

Test Program 6 (Digit Inside of a string)

{
string a
a = "j03 15 C001"
print(a)
}$

Test Program 7 (Uppercase Letter)

{
string A
A = "hello"
print(A)
}$

*/
function testProgram1() {
    var sourceCodeHTML = document.getElementById("programInput");
    sourceCodeHTML.value = "{\n" +
        "int a\n" +
        "a = 1\n" +
        "print(a)\n" +
        "}$";
}
function testProgram2() {
    var sourceCodeHTML = document.getElementById("programInput");
    sourceCodeHTML.value = "{\n" +
        "abcd\n" +
        "efgh\n" +
        "ijkl\n" +
        "mnop\n" +
        "qrst\n" +
        "uvwx\n" +
        "yz\n" +
        "}$";
}
