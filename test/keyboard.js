////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                       (C) 2010-2018 Robot Developers                       //
//                       See LICENSE for licensing info                       //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

"use strict";

//----------------------------------------------------------------------------//
// Exports                                                                    //
//----------------------------------------------------------------------------//

module.exports = function (robot, log, sprintf, getline, assert)
{
	//----------------------------------------------------------------------------//
	// Locals                                                                     //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	var Range    = robot.Range;
	var Point    = robot.Point;
	var Size     = robot.Size;
	var Bounds   = robot.Bounds;

	var Timer    = robot.Timer;
	var Mouse    = robot.Mouse;
	var Keyboard = robot.Keyboard;

	var k = Keyboard();



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function testCompiler()
	{
		var list, i = 0;

		var testKeyC = function (key) {
			assert ( list[i].down && list[i].key === key); ++i;
			assert (!list[i].down && list[i].key === key); ++i;
		};

		var testKeyP = function (key) {
			assert ( list[i].down && list[i].key === key); ++i;
		};

		var testKeyR = function (key) {
			assert (!list[i].down && list[i].key === key); ++i;
		};

		list = Keyboard.compile ("{SPACE}{SPC}{ESCAPE}{ESC}");
		testKeyC (robot.KEY_SPACE);
		testKeyC (robot.KEY_SPACE);
		testKeyC (robot.KEY_ESCAPE);
		testKeyC (robot.KEY_ESCAPE);
		i = 0;

		list = Keyboard.compile ("{TAB}{ALT}{LALT}{RALT}{CONTROL}{LCONTROL}{RCONTROL}{CTRL}{LCTRL}{RCTRL}{SHIFT}{LSHIFT}{RSHIFT}{SYSTEM}{LSYSTEM}{RSYSTEM}");
		testKeyC (robot.KEY_TAB);
		testKeyC (robot.KEY_ALT);
		testKeyC (robot.KEY_LALT);
		testKeyC (robot.KEY_RALT);
		testKeyC (robot.KEY_CONTROL);
		testKeyC (robot.KEY_LCONTROL);
		testKeyC (robot.KEY_RCONTROL);
		testKeyC (robot.KEY_CONTROL);
		testKeyC (robot.KEY_LCONTROL);
		testKeyC (robot.KEY_RCONTROL);
		testKeyC (robot.KEY_SHIFT);
		testKeyC (robot.KEY_LSHIFT);
		testKeyC (robot.KEY_RSHIFT);
		testKeyC (robot.KEY_SYSTEM);
		testKeyC (robot.KEY_LSYSTEM);
		testKeyC (robot.KEY_RSYSTEM);
		i = 0;

		list = Keyboard.compile ("{F1}{F2}{F3}{F4}{F5}{F6}{F7}{F8}{F9}{F10}{F11}{F12}");
		testKeyC (robot.KEY_F1);
		testKeyC (robot.KEY_F2);
		testKeyC (robot.KEY_F3);
		testKeyC (robot.KEY_F4);
		testKeyC (robot.KEY_F5);
		testKeyC (robot.KEY_F6);
		testKeyC (robot.KEY_F7);
		testKeyC (robot.KEY_F8);
		testKeyC (robot.KEY_F9);
		testKeyC (robot.KEY_F10);
		testKeyC (robot.KEY_F11);
		testKeyC (robot.KEY_F12);
		i = 0;

		list = Keyboard.compile ("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}");
		testKeyC (robot.KEY_0);
		testKeyC (robot.KEY_1);
		testKeyC (robot.KEY_2);
		testKeyC (robot.KEY_3);
		testKeyC (robot.KEY_4);
		testKeyC (robot.KEY_5);
		testKeyC (robot.KEY_6);
		testKeyC (robot.KEY_7);
		testKeyC (robot.KEY_8);
		testKeyC (robot.KEY_9);
		i = 0;

		list = Keyboard.compile ("{A}{B}{C}{D}{E}{F}{G}{H}{I}{J}{K}{L}{M}{N}{O}{P}{Q}{R}{S}{T}{U}{V}{W}{X}{Y}{Z}");
		testKeyC (robot.KEY_A);
		testKeyC (robot.KEY_B);
		testKeyC (robot.KEY_C);
		testKeyC (robot.KEY_D);
		testKeyC (robot.KEY_E);
		testKeyC (robot.KEY_F);
		testKeyC (robot.KEY_G);
		testKeyC (robot.KEY_H);
		testKeyC (robot.KEY_I);
		testKeyC (robot.KEY_J);
		testKeyC (robot.KEY_K);
		testKeyC (robot.KEY_L);
		testKeyC (robot.KEY_M);
		testKeyC (robot.KEY_N);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_P);
		testKeyC (robot.KEY_Q);
		testKeyC (robot.KEY_R);
		testKeyC (robot.KEY_S);
		testKeyC (robot.KEY_T);
		testKeyC (robot.KEY_U);
		testKeyC (robot.KEY_V);
		testKeyC (robot.KEY_W);
		testKeyC (robot.KEY_X);
		testKeyC (robot.KEY_Y);
		testKeyC (robot.KEY_Z);
		i = 0;

		list = Keyboard.compile ("{`}{-}{=}{<}{[}{]}{\\}{;}{'}{~}{,}{.}{/}");
		testKeyC (robot.KEY_GRAVE);
		testKeyC (robot.KEY_MINUS);
		testKeyC (robot.KEY_EQUAL);
		testKeyC (robot.KEY_BACKSPACE);
		testKeyC (robot.KEY_LBRACKET);
		testKeyC (robot.KEY_RBRACKET);
		testKeyC (robot.KEY_BACKSLASH);
		testKeyC (robot.KEY_SEMICOLON);
		testKeyC (robot.KEY_QUOTE);
		testKeyC (robot.KEY_RETURN);
		testKeyC (robot.KEY_COMMA);
		testKeyC (robot.KEY_PERIOD);
		testKeyC (robot.KEY_SLASH);
		i = 0;

		list = Keyboard.compile ("{GRAVE}{MINUS}{EQUAL}{BACKSPACE}{BS}{LBRACKET}{RBRACKET}{BACKSLASH}{SEMICOLON}{QUOTE}{RETURN}{COMMA}{PERIOD}{SLASH}");
		testKeyC (robot.KEY_GRAVE);
		testKeyC (robot.KEY_MINUS);
		testKeyC (robot.KEY_EQUAL);
		testKeyC (robot.KEY_BACKSPACE);
		testKeyC (robot.KEY_BACKSPACE);
		testKeyC (robot.KEY_LBRACKET);
		testKeyC (robot.KEY_RBRACKET);
		testKeyC (robot.KEY_BACKSLASH);
		testKeyC (robot.KEY_SEMICOLON);
		testKeyC (robot.KEY_QUOTE);
		testKeyC (robot.KEY_RETURN);
		testKeyC (robot.KEY_COMMA);
		testKeyC (robot.KEY_PERIOD);
		testKeyC (robot.KEY_SLASH);
		i = 0;

		list = Keyboard.compile ("{LEFT}{UP}{RIGHT}{DOWN}");
		testKeyC (robot.KEY_LEFT);
		testKeyC (robot.KEY_UP);
		testKeyC (robot.KEY_RIGHT);
		testKeyC (robot.KEY_DOWN);
		i = 0;

		list = Keyboard.compile ("{PRINT}{PAUSE}{BREAK}{INSERT}{INS}{DELETE}{DEL}{HOME}{END}{PAGEUP}{PGUP}{PAGEDOWN}{PGDN}");
		testKeyC (robot.KEY_PRINT);
		testKeyC (robot.KEY_PAUSE);
		testKeyC (robot.KEY_PAUSE);
		testKeyC (robot.KEY_INSERT);
		testKeyC (robot.KEY_INSERT);
		testKeyC (robot.KEY_DELETE);
		testKeyC (robot.KEY_DELETE);
		testKeyC (robot.KEY_HOME);
		testKeyC (robot.KEY_END);
		testKeyC (robot.KEY_PAGE_UP);
		testKeyC (robot.KEY_PAGE_UP);
		testKeyC (robot.KEY_PAGE_DOWN);
		testKeyC (robot.KEY_PAGE_DOWN);
		i = 0;

		list = Keyboard.compile ("{NUM+}{NUM-}{NUM*}{NUM/}{NUM.}{NUM~}");
		testKeyC (robot.KEY_ADD);
		testKeyC (robot.KEY_SUBTRACT);
		testKeyC (robot.KEY_MULTIPLY);
		testKeyC (robot.KEY_DIVIDE);
		testKeyC (robot.KEY_DECIMAL);
		testKeyC (robot.KEY_ENTER);
		i = 0;

		list = Keyboard.compile ("{ADD}{SUBTRACT}{MULTIPLY}{DIVIDE}{DECIMAL}{ENTER}");
		testKeyC (robot.KEY_ADD);
		testKeyC (robot.KEY_SUBTRACT);
		testKeyC (robot.KEY_MULTIPLY);
		testKeyC (robot.KEY_DIVIDE);
		testKeyC (robot.KEY_DECIMAL);
		testKeyC (robot.KEY_ENTER);
		i = 0;

		list = Keyboard.compile ("{NUM0}{NUM1}{NUM2}{NUM3}{NUM4}{NUM5}{NUM6}{NUM7}{NUM8}{NUM9}");
		testKeyC (robot.KEY_NUM0);
		testKeyC (robot.KEY_NUM1);
		testKeyC (robot.KEY_NUM2);
		testKeyC (robot.KEY_NUM3);
		testKeyC (robot.KEY_NUM4);
		testKeyC (robot.KEY_NUM5);
		testKeyC (robot.KEY_NUM6);
		testKeyC (robot.KEY_NUM7);
		testKeyC (robot.KEY_NUM8);
		testKeyC (robot.KEY_NUM9);
		i = 0;

		list = Keyboard.compile ("{CAPSLOCK}{SCROLLLOCK}{NUMLOCK}");
		testKeyC (robot.KEY_CAPS_LOCK);
		testKeyC (robot.KEY_SCROLL_LOCK);
		testKeyC (robot.KEY_NUM_LOCK);
		i = 0;

		list = Keyboard.compile (" 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`-=[]\\;'~,./");
		testKeyC (robot.KEY_SPACE);
		testKeyC (robot.KEY_0);
		testKeyC (robot.KEY_1);
		testKeyC (robot.KEY_2);
		testKeyC (robot.KEY_3);
		testKeyC (robot.KEY_4);
		testKeyC (robot.KEY_5);
		testKeyC (robot.KEY_6);
		testKeyC (robot.KEY_7);
		testKeyC (robot.KEY_8);
		testKeyC (robot.KEY_9);
		testKeyC (robot.KEY_A);
		testKeyC (robot.KEY_B);
		testKeyC (robot.KEY_C);
		testKeyC (robot.KEY_D);
		testKeyC (robot.KEY_E);
		testKeyC (robot.KEY_F);
		testKeyC (robot.KEY_G);
		testKeyC (robot.KEY_H);
		testKeyC (robot.KEY_I);
		testKeyC (robot.KEY_J);
		testKeyC (robot.KEY_K);
		testKeyC (robot.KEY_L);
		testKeyC (robot.KEY_M);
		testKeyC (robot.KEY_N);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_P);
		testKeyC (robot.KEY_Q);
		testKeyC (robot.KEY_R);
		testKeyC (robot.KEY_S);
		testKeyC (robot.KEY_T);
		testKeyC (robot.KEY_U);
		testKeyC (robot.KEY_V);
		testKeyC (robot.KEY_W);
		testKeyC (robot.KEY_X);
		testKeyC (robot.KEY_Y);
		testKeyC (robot.KEY_Z);
		testKeyC (robot.KEY_GRAVE);
		testKeyC (robot.KEY_MINUS);
		testKeyC (robot.KEY_EQUAL);
		testKeyC (robot.KEY_LBRACKET);
		testKeyC (robot.KEY_RBRACKET);
		testKeyC (robot.KEY_BACKSLASH);
		testKeyC (robot.KEY_SEMICOLON);
		testKeyC (robot.KEY_QUOTE);
		testKeyC (robot.KEY_RETURN);
		testKeyC (robot.KEY_COMMA);
		testKeyC (robot.KEY_PERIOD);
		testKeyC (robot.KEY_SLASH);
		i = 0;

		assert (Keyboard.compile ("!o"					).length === 0);
		assert (Keyboard.compile ("{! 2}"				).length === 0);
		assert (Keyboard.compile ("{oooooooooooooooo}"	).length === 0);
		assert (Keyboard.compile ("{ooooooooooooooo}"	).length === 0);
		assert (Keyboard.compile ("{ooooooooooooooooo}"	).length === 0);
		assert (Keyboard.compile ("}"					).length === 0);
		assert (Keyboard.compile ("{o}{bs}o}"			).length === 0);
		assert (Keyboard.compile ("{bs -1}"				).length === 0);
		assert (Keyboard.compile ("{bs 100}"			).length === 0);
		assert (Keyboard.compile ("{bs 9999}"			).length === 0);
		assert (Keyboard.compile ("{bs 2 6 }"			).length === 0);
		assert (Keyboard.compile ("$$o"					).length === 0);
		assert (Keyboard.compile ("(o(o(o(o)))"			).length === 0);
		assert (Keyboard.compile ("(((((o)))))"			).length === 0);
		assert (Keyboard.compile ("+(o+(ooo))"			).length === 0);

		assert (Keyboard.compile (""					).length === 0);
		assert (Keyboard.compile ("{bs 0}"				).length === 0);
		assert (Keyboard.compile ("{bs 0xa}"			).length === 0);
		assert (Keyboard.compile ("{bs ooo}"			).length === 0);

		list = Keyboard.compile ("oO{o}Oo");
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		i = 0;

		list = Keyboard.compile ("ooo{< 3}");
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_BACKSPACE);
		testKeyC (robot.KEY_BACKSPACE);
		testKeyC (robot.KEY_BACKSPACE);
		i = 0;

		list = Keyboard.compile ("{bs 1}");
		testKeyC (robot.KEY_BACKSPACE);
		i = 0;

		list = Keyboard.compile ("{< 2 6}");
		testKeyC (robot.KEY_BACKSPACE);
		testKeyC (robot.KEY_BACKSPACE);
		i = 0;

		list = Keyboard.compile ("{bs 2 a}");
		testKeyC (robot.KEY_BACKSPACE);
		testKeyC (robot.KEY_BACKSPACE);
		i = 0;

		list = Keyboard.compile ("+(oo)+%o^()");
		testKeyP (robot.KEY_SHIFT);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_SHIFT);
		testKeyP (robot.KEY_SHIFT);
		testKeyP (robot.KEY_ALT);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_ALT);
		testKeyR (robot.KEY_SHIFT);
		testKeyP (robot.KEY_CONTROL);
		testKeyR (robot.KEY_CONTROL);
		i = 0;

		list = Keyboard.compile ("$o");
		testKeyP (robot.KEY_SYSTEM);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_SYSTEM);
		i = 0;

		list = Keyboard.compile ("o(o)o((o))");
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		i = 0;

		list = Keyboard.compile ("o(O(o(O)o)O)o");
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		i = 0;

		list = Keyboard.compile ("((((o))))");
		testKeyC (robot.KEY_O);
		i = 0;

		list = Keyboard.compile ("%^+$o");
		testKeyP (robot.KEY_ALT);
		testKeyP (robot.KEY_CONTROL);
		testKeyP (robot.KEY_SHIFT);
		testKeyP (robot.KEY_SYSTEM);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_ALT);
		testKeyR (robot.KEY_CONTROL);
		testKeyR (robot.KEY_SHIFT);
		testKeyR (robot.KEY_SYSTEM);
		i = 0;

		list = Keyboard.compile ("^$%+o");
		testKeyP (robot.KEY_CONTROL);
		testKeyP (robot.KEY_SYSTEM);
		testKeyP (robot.KEY_ALT);
		testKeyP (robot.KEY_SHIFT);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_ALT);
		testKeyR (robot.KEY_CONTROL);
		testKeyR (robot.KEY_SHIFT);
		testKeyR (robot.KEY_SYSTEM);
		i = 0;

		list = Keyboard.compile ("+(o^({o}%(o$({o}))))");
		testKeyP (robot.KEY_SHIFT);
		testKeyC (robot.KEY_O);
		testKeyP (robot.KEY_CONTROL);
		testKeyC (robot.KEY_O);
		testKeyP (robot.KEY_ALT);
		testKeyC (robot.KEY_O);
		testKeyP (robot.KEY_SYSTEM);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_SYSTEM);
		testKeyR (robot.KEY_ALT);
		testKeyR (robot.KEY_CONTROL);
		testKeyR (robot.KEY_SHIFT);
		i = 0;

		list = Keyboard.compile ("+{o}(%o(^{o}($o)))");
		testKeyP (robot.KEY_SHIFT);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_SHIFT);
		testKeyP (robot.KEY_ALT);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_ALT);
		testKeyP (robot.KEY_CONTROL);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_CONTROL);
		testKeyP (robot.KEY_SYSTEM);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_SYSTEM);
		i = 0;

		list = Keyboard.compile ("()o()o()o()o()");
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		i = 0;

		list = Keyboard.compile ("(oOo)");
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		i = 0;

		list = Keyboard.compile ("(+((%o)))");
		testKeyP (robot.KEY_SHIFT);
		testKeyP (robot.KEY_ALT);
		testKeyC (robot.KEY_O);
		testKeyR (robot.KEY_ALT);
		testKeyR (robot.KEY_SHIFT);
		i = 0;

		list = Keyboard.compile ("(o)(o)(o)(o)(o)");
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		testKeyC (robot.KEY_O);
		i = 0;

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testLive()
	{
		log ("Press enter to begin live test");
		getline();

		log ("Numbers: ");
		Timer.sleep (500);
		k.click (robot.KEY_0);
		k.click (robot.KEY_1);
		k.click (robot.KEY_2);
		k.click (robot.KEY_3);
		k.click (robot.KEY_4);
		k.click (robot.KEY_5);
		k.click (robot.KEY_6);
		k.click (robot.KEY_7);
		k.click (robot.KEY_8);
		k.click (robot.KEY_9);
		k.click (robot.KEY_RETURN);
		assert (getline() === "0123456789");

		log ("Alphabet: ");
		Timer.sleep (500);
		k.click (robot.KEY_A);
		k.click (robot.KEY_B);
		k.click (robot.KEY_C);
		k.click (robot.KEY_D);
		k.click (robot.KEY_E);
		k.click (robot.KEY_F);
		k.click (robot.KEY_G);
		k.click (robot.KEY_H);
		k.click (robot.KEY_I);
		k.click (robot.KEY_J);
		k.click (robot.KEY_K);
		k.click (robot.KEY_L);
		k.click (robot.KEY_M);
		k.click (robot.KEY_N);
		k.click (robot.KEY_O);
		k.click (robot.KEY_P);
		k.click (robot.KEY_Q);
		k.click (robot.KEY_R);
		k.click (robot.KEY_S);
		k.click (robot.KEY_T);
		k.click (robot.KEY_U);
		k.click (robot.KEY_V);
		k.click (robot.KEY_W);
		k.click (robot.KEY_X);
		k.click (robot.KEY_Y);
		k.click (robot.KEY_Z);
		k.click (robot.KEY_RETURN);
		assert (getline() === "abcdefghijklmnopqrstuvwxyz");

		log ("Alphabet: ");
		Timer.sleep (500);
		k.press (robot.KEY_SHIFT);
		k.click (robot.KEY_A);
		k.click (robot.KEY_B);
		k.click (robot.KEY_C);
		k.click (robot.KEY_D);
		k.click (robot.KEY_E);
		k.click (robot.KEY_F);
		k.click (robot.KEY_G);
		k.click (robot.KEY_H);
		k.click (robot.KEY_I);
		k.click (robot.KEY_J);
		k.click (robot.KEY_K);
		k.click (robot.KEY_L);
		k.click (robot.KEY_M);
		k.click (robot.KEY_N);
		k.click (robot.KEY_O);
		k.click (robot.KEY_P);
		k.click (robot.KEY_Q);
		k.click (robot.KEY_R);
		k.click (robot.KEY_S);
		k.click (robot.KEY_T);
		k.click (robot.KEY_U);
		k.click (robot.KEY_V);
		k.click (robot.KEY_W);
		k.click (robot.KEY_X);
		k.click (robot.KEY_Y);
		k.click (robot.KEY_Z);
		k.release (robot.KEY_SHIFT);
		k.click (robot.KEY_RETURN);
		assert (getline() === "ABCDEFGHIJKLMNOPQRSTUVWXYZ");

		log ("Keypad: ");
		Timer.sleep (500);
		k.click (robot.KEY_ADD);
		k.click (robot.KEY_SUBTRACT);
		k.click (robot.KEY_MULTIPLY);
		k.click (robot.KEY_DIVIDE);
		k.click (robot.KEY_DECIMAL);
		k.click (robot.KEY_NUM0);
		k.click (robot.KEY_NUM1);
		k.click (robot.KEY_NUM2);
		k.click (robot.KEY_NUM3);
		k.click (robot.KEY_NUM4);
		k.click (robot.KEY_NUM5);
		k.click (robot.KEY_NUM6);
		k.click (robot.KEY_NUM7);
		k.click (robot.KEY_NUM8);
		k.click (robot.KEY_NUM9);
		k.click (robot.KEY_ENTER);
		assert (getline() === "+-*/.0123456789");

		log ("Punctuation: ");
		Timer.sleep (500);
		k.click (robot.KEY_MINUS);
		k.click (robot.KEY_EQUAL);
		k.click (robot.KEY_BACKSPACE);
		k.click (robot.KEY_BACKSPACE);
		k.click (robot.KEY_GRAVE);
		k.click (robot.KEY_MINUS);
		k.click (robot.KEY_EQUAL);
		k.click (robot.KEY_LBRACKET);
		k.click (robot.KEY_SPACE);
		k.click (robot.KEY_RBRACKET);
		k.click (robot.KEY_BACKSLASH);
		k.click (robot.KEY_SEMICOLON);
		k.click (robot.KEY_QUOTE);
		k.click (robot.KEY_COMMA);
		k.click (robot.KEY_PERIOD);
		k.click (robot.KEY_SLASH);
		k.click (robot.KEY_RETURN);
		assert (getline() === "`-=[ ]\\;',./");

		log ("Punctuation: ");
		Timer.sleep (500);
		k.press (robot.KEY_SHIFT);
		k.click (robot.KEY_GRAVE);
		k.click (robot.KEY_MINUS);
		k.click (robot.KEY_EQUAL);
		k.click (robot.KEY_LBRACKET);
		k.click (robot.KEY_SPACE);
		k.click (robot.KEY_RBRACKET);
		k.click (robot.KEY_BACKSLASH);
		k.click (robot.KEY_SEMICOLON);
		k.click (robot.KEY_QUOTE);
		k.click (robot.KEY_COMMA);
		k.click (robot.KEY_PERIOD);
		k.click (robot.KEY_SLASH);
		k.release (robot.KEY_SHIFT);
		k.click (robot.KEY_RETURN);
		assert (getline() === "~_+{ }|:\"<>?");

		log ("Hello Robot: ");
		Timer.sleep (500);
		k.click ("+Hello +Robo<<<+(obot)+1~");
		assert (getline() === "Hello ROBOT!");

		log ("\nWarning: The next set of tests cannot be automated\n");
		log ("         Please review the following instructions!\n\n");

		log ("- Live testing will be performed in sets\n"  );
		log ("- Press enter to begin testing a new set\n"  );
		log ("- After beginning, focus the testing app\n"  );
		log ("- Verify results before testing next set\n\n");

		log ("Function Keys");
		getline();
		Timer.sleep (2500);
		k.click (robot.KEY_F1);
		k.click (robot.KEY_F2);
		k.click (robot.KEY_F3);
		k.click (robot.KEY_F4);
		k.click (robot.KEY_F5);
		k.click (robot.KEY_F6);
		k.click (robot.KEY_F7);
		k.click (robot.KEY_F8);
		k.click (robot.KEY_F9);
		k.click (robot.KEY_F10);
		k.click (robot.KEY_F11);
		k.click (robot.KEY_F12);

		log ("Miscellaneous");
		getline();
		Timer.sleep (2500);
		k.click (robot.KEY_PAUSE);
		k.click (robot.KEY_INSERT);
		k.click (robot.KEY_DELETE);
		k.click (robot.KEY_HOME);
		k.click (robot.KEY_END);
		k.click (robot.KEY_PAGE_UP);
		k.click (robot.KEY_PAGE_DOWN);
		k.click (robot.KEY_ESCAPE);
		k.click (robot.KEY_PRINT);

		log ("Modifiers");
		getline();
		Timer.sleep (2500);
		k.click (robot.KEY_TAB);
		k.click (robot.KEY_ALT);
		k.click (robot.KEY_LALT);
		k.click (robot.KEY_RALT);
		k.click (robot.KEY_CONTROL);
		k.click (robot.KEY_LCONTROL);
		k.click (robot.KEY_RCONTROL);
		k.click (robot.KEY_SHIFT);
		k.click (robot.KEY_LSHIFT);
		k.click (robot.KEY_RSHIFT);
		k.click (robot.KEY_SYSTEM);
		k.click (robot.KEY_SYSTEM);
		k.click (robot.KEY_LSYSTEM);
		k.click (robot.KEY_LSYSTEM);
		k.click (robot.KEY_RSYSTEM);
		k.click (robot.KEY_RSYSTEM);

		log ("Arrow Keys");
		getline();
		Timer.sleep (2500);
		k.click (robot.KEY_LEFT);
		k.click (robot.KEY_UP);
		k.click (robot.KEY_RIGHT);
		k.click (robot.KEY_DOWN);

		log ("Light Show");
		getline();
		Timer.sleep (2500);
		k.click (robot.KEY_CAPS_LOCK);
		k.click (robot.KEY_CAPS_LOCK);
		k.click (robot.KEY_SCROLL_LOCK);
		k.click (robot.KEY_SCROLL_LOCK);
		k.click (robot.KEY_NUM_LOCK);
		k.click (robot.KEY_NUM_LOCK);

		log ("\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testGetState()
	{
		log ("Warning: The next set of tests cannot be automated\n"  );
		log ("         Please review the following instructions!\n\n");

		log ("- Press keys and verify output\n");
		log ("- Press enter to begin testing\n");
		log ("- Press escape to stop testing\n");

		getline();

		// Check if the platform is Mac
		if (process.platform !== "darwin")
		{
			// OSX doesn't properly handle automated key presses
			k.press (robot.KEY_A);
			k.press (robot.KEY_B);
			k.press (robot.KEY_C);
			assert (Keyboard.getState (robot.KEY_A) &&
					Keyboard.getState (robot.KEY_B) &&
					Keyboard.getState (robot.KEY_C));

			k.release (robot.KEY_A);
			// Get the state of all keycodes
			var state = Keyboard.getState();
			assert (!state[robot.KEY_A] &&
					 state[robot.KEY_B] &&
					 state[robot.KEY_C]);
			k.release (robot.KEY_B);
			k.release (robot.KEY_C);
		}

		// Iterate until the escape key is pressed
		while (!Keyboard.getState (robot.KEY_ESCAPE))
		{
			// Get the state of all keycodes
			var state = Keyboard.getState();

			if (state[robot.KEY_SPACE		]) log ("Space\t" );

			if (state[robot.KEY_TAB			]) log ("Tab\t"   );
			if (state[robot.KEY_LALT		] ||
				state[robot.KEY_RALT		]) log ("Alt\t"   );
			if (state[robot.KEY_LCONTROL	] ||
				state[robot.KEY_RCONTROL	]) log ("Ctrl\t"  );
			if (state[robot.KEY_LSHIFT		] ||
				state[robot.KEY_RSHIFT		]) log ("Shift\t" );
			if (state[robot.KEY_LSYSTEM		] ||
				state[robot.KEY_RSYSTEM		]) log ("System\t");

			if (state[robot.KEY_F1			]) log ("F1\t" );
			if (state[robot.KEY_F2			]) log ("F2\t" );
			if (state[robot.KEY_F3			]) log ("F3\t" );
			if (state[robot.KEY_F4			]) log ("F4\t" );
			if (state[robot.KEY_F5			]) log ("F5\t" );
			if (state[robot.KEY_F6			]) log ("F6\t" );
			if (state[robot.KEY_F7			]) log ("F7\t" );
			if (state[robot.KEY_F8			]) log ("F8\t" );
			if (state[robot.KEY_F9			]) log ("F9\t" );
			if (state[robot.KEY_F10			]) log ("F10\t");
			if (state[robot.KEY_F11			]) log ("F11\t");
			if (state[robot.KEY_F12			]) log ("F12\t");

			if (state[robot.KEY_0			]) log ("0\t");
			if (state[robot.KEY_1			]) log ("1\t");
			if (state[robot.KEY_2			]) log ("2\t");
			if (state[robot.KEY_3			]) log ("3\t");
			if (state[robot.KEY_4			]) log ("4\t");
			if (state[robot.KEY_5			]) log ("5\t");
			if (state[robot.KEY_6			]) log ("6\t");
			if (state[robot.KEY_7			]) log ("7\t");
			if (state[robot.KEY_8			]) log ("8\t");
			if (state[robot.KEY_9			]) log ("9\t");

			if (state[robot.KEY_A			]) log ("A\t");
			if (state[robot.KEY_B			]) log ("B\t");
			if (state[robot.KEY_C			]) log ("C\t");
			if (state[robot.KEY_D			]) log ("D\t");
			if (state[robot.KEY_E			]) log ("E\t");
			if (state[robot.KEY_F			]) log ("F\t");
			if (state[robot.KEY_G			]) log ("G\t");
			if (state[robot.KEY_H			]) log ("H\t");
			if (state[robot.KEY_I			]) log ("I\t");
			if (state[robot.KEY_J			]) log ("J\t");
			if (state[robot.KEY_K			]) log ("K\t");
			if (state[robot.KEY_L			]) log ("L\t");
			if (state[robot.KEY_M			]) log ("M\t");
			if (state[robot.KEY_N			]) log ("N\t");
			if (state[robot.KEY_O			]) log ("O\t");
			if (state[robot.KEY_P			]) log ("P\t");
			if (state[robot.KEY_Q			]) log ("Q\t");
			if (state[robot.KEY_R			]) log ("R\t");
			if (state[robot.KEY_S			]) log ("S\t");
			if (state[robot.KEY_T			]) log ("T\t");
			if (state[robot.KEY_U			]) log ("U\t");
			if (state[robot.KEY_V			]) log ("V\t");
			if (state[robot.KEY_W			]) log ("W\t");
			if (state[robot.KEY_X			]) log ("X\t");
			if (state[robot.KEY_Y			]) log ("Y\t");
			if (state[robot.KEY_Z			]) log ("Z\t");

			if (state[robot.KEY_GRAVE		]) log ("`\t" );
			if (state[robot.KEY_MINUS		]) log ("-\t" );
			if (state[robot.KEY_EQUAL		]) log ("=\t" );
			if (state[robot.KEY_BACKSPACE	]) log ("<\t" );
			if (state[robot.KEY_LBRACKET	]) log ("[\t" );
			if (state[robot.KEY_RBRACKET	]) log ("]\t" );
			if (state[robot.KEY_BACKSLASH	]) log ("\\\t");
			if (state[robot.KEY_SEMICOLON	]) log (";\t" );
			if (state[robot.KEY_QUOTE		]) log ("'\t" );
			if (state[robot.KEY_RETURN		]) log ("~\t" );
			if (state[robot.KEY_COMMA		]) log (",\t" );
			if (state[robot.KEY_PERIOD		]) log (".\t" );
			if (state[robot.KEY_SLASH		]) log ("/\t" );

			if (state[robot.KEY_LEFT		]) log ("Left\t" );
			if (state[robot.KEY_UP			]) log ("Up\t"   );
			if (state[robot.KEY_RIGHT		]) log ("Right\t");
			if (state[robot.KEY_DOWN		]) log ("Down\t" );

			if (state[robot.KEY_PRINT		]) log ("Print\t");
			if (state[robot.KEY_PAUSE		]) log ("Pause\t");
			if (state[robot.KEY_INSERT		]) log ("Ins\t"  );
			if (state[robot.KEY_DELETE		]) log ("Del\t"  );
			if (state[robot.KEY_HOME		]) log ("Home\t" );
			if (state[robot.KEY_END			]) log ("End\t"  );
			if (state[robot.KEY_PAGE_UP		]) log ("PgUp\t" );
			if (state[robot.KEY_PAGE_DOWN	]) log ("PgDn\t" );

			if (state[robot.KEY_ADD			]) log ("N+\t");
			if (state[robot.KEY_SUBTRACT	]) log ("N-\t");
			if (state[robot.KEY_MULTIPLY	]) log ("N*\t");
			if (state[robot.KEY_DIVIDE		]) log ("N/\t");
			if (state[robot.KEY_DECIMAL		]) log ("N.\t");
			if (state[robot.KEY_ENTER		]) log ("N~\t");

			if (state[robot.KEY_NUM0		]) log ("N0\t");
			if (state[robot.KEY_NUM1		]) log ("N1\t");
			if (state[robot.KEY_NUM2		]) log ("N2\t");
			if (state[robot.KEY_NUM3		]) log ("N3\t");
			if (state[robot.KEY_NUM4		]) log ("N4\t");
			if (state[robot.KEY_NUM5		]) log ("N5\t");
			if (state[robot.KEY_NUM6		]) log ("N6\t");
			if (state[robot.KEY_NUM7		]) log ("N7\t");
			if (state[robot.KEY_NUM8		]) log ("N8\t");
			if (state[robot.KEY_NUM9		]) log ("N9\t");

			if (state[robot.KEY_CAPS_LOCK	]) log ("Caps\t"  );
			if (state[robot.KEY_SCROLL_LOCK	]) log ("Scroll\t");
			if (state[robot.KEY_NUM_LOCK	]) log ("Num\t"   );

			log ("\n"); Timer.sleep (90);
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testArgs()
	{
		assert (k.click,   k, [   ]);
		assert (k.press,   k, [   ]);
		assert (k.press,   k, ["a"]);
		assert (k.release, k, [   ]);
		assert (k.release, k, ["a"]);

		assert (Keyboard.compile,  Keyboard, [   ]);
		assert (Keyboard.getState, Keyboard, ["a"]);

		assert (typeof k.click   (robot.KEY_A) === "undefined");
		assert (typeof k.press   (robot.KEY_A) === "undefined");
		assert (typeof k.release (robot.KEY_A) === "undefined");

		assert (       Keyboard.compile  ("a") instanceof Array);
		assert (typeof Keyboard.getState (   ) === "object"    );
		assert (typeof Keyboard.getState (robot.KEY_A) === "boolean");

		return true;
	}



	//----------------------------------------------------------------------------//
	// Main                                                                       //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	return function()
	{
		log ("BEGIN KEYBOARD TESTING\n------------------------------\n");
		if (!testCompiler()) { log (">> Compiler Failed \n\n"); return false; }
		if (!testLive    ()) { log (">> Live Test Failed\n\n"); return false; }
		if (!testGetState()) { log (">> Get State Failed\n\n"); return false; }
		if (!testArgs    ()) { log (">> Test Args Failed\n\n"); return false; }
		log (">> Success\n\n"); return true;
	};
};
