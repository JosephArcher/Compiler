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

Test Program 2 (Symbol)

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

*/

function testProgram1() {
	console.log("Test Program 1 Called");
	var sourceCodeHTML = <HTMLInputElement>document.getElementById("programInput");
	sourceCodeHTML.value = "{" +
		"  int a" +
		" a = 1" +
		" print(a)" +
		" }$";
}
