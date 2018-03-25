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

	var Point   = robot.Point;
	var Size    = robot.Size;
	var Bounds  = robot.Bounds;

	var Mouse   = robot.Mouse;
	var Timer   = robot.Timer;
	var Process = robot.Process;
	var Window  = robot.Window;



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function testInvalid()
	{
		var w1 = Window ();
		var w2 = Window (); assert ( w2.setHandle (   0));
		var w3 = Window (); assert (!w3.setHandle (8888));
		var w4 = Window (8888);

		assert (!w1.isValid()); assert ( w1.setHandle (   0));
		assert (!w2.isValid()); assert ( w2.setHandle (   0));
		assert (!w3.isValid()); assert (!w3.setHandle (8888));
		assert (!w4.isValid()); assert (!w4.setHandle (8888));

		assert (!w1.isTopMost()); assert (!w1.isBorderless());
		assert (!w2.isTopMost()); assert (!w2.isBorderless());
		assert (!w3.isTopMost()); assert (!w3.isBorderless());
		assert (!w4.isTopMost()); assert (!w4.isBorderless());

		assert (!w1.isMinimized()); assert (!w1.isMaximized());
		assert (!w2.isMinimized()); assert (!w2.isMaximized());
		assert (!w3.isMinimized()); assert (!w3.isMaximized());
		assert (!w4.isMinimized()); assert (!w4.isMaximized());

		assert (!w1.getProcess().isValid()); assert (w1.getPID() === 0);
		assert (!w2.getProcess().isValid()); assert (w2.getPID() === 0);
		assert (!w3.getProcess().isValid()); assert (w3.getPID() === 0);
		assert (!w4.getProcess().isValid()); assert (w4.getPID() === 0);

		assert (w1.getHandle() === 0);
		assert (w2.getHandle() === 0);
		assert (w3.getHandle() === 0);
		assert (w4.getHandle() === 0);

		assert (w1.getTitle().length === 0);
		assert (w2.getTitle().length === 0);
		assert (w3.getTitle().length === 0);
		assert (w4.getTitle().length === 0);

		assert (w1.getBounds().eq (0)); assert (w1.getClient().eq (0));
		assert (w2.getBounds().eq (0)); assert (w2.getClient().eq (0));
		assert (w3.getBounds().eq (0)); assert (w3.getClient().eq (0));
		assert (w4.getBounds().eq (0)); assert (w4.getClient().eq (0));

		assert (w1.mapToClient (20).eq (0)); assert (w1.mapToScreen (20).eq (0));
		assert (w2.mapToClient (20).eq (0)); assert (w2.mapToScreen (20).eq (0));
		assert (w3.mapToClient (20).eq (0)); assert (w3.mapToScreen (20).eq (0));
		assert (w4.mapToClient (20).eq (0)); assert (w4.mapToScreen (20).eq (0));

		assert ( w1.eq (w2)); assert ( w2.eq (w1));
		assert (!w1.ne (w2)); assert (!w2.ne (w1));
		assert ( w3.eq (w4)); assert ( w4.eq (w3));
		assert (!w3.ne (w4)); assert (!w4.ne (w3));

		assert (w1.eq (0)); assert (w1.ne (8888));
		assert (w2.eq (0)); assert (w2.ne (8888));
		assert (w3.eq (0)); assert (w3.ne (8888));
		assert (w4.eq (0)); assert (w4.ne (8888));

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testSelect1()
	{
		log ("Warning: The next set of tests cannot be automated\n"  );
		log ("         Please execute the following instructions\n\n");

		//----------------------------------------------------------------------------//

		if (process.platform === "linux")
			log ("Open Leafpad and gedit");

		if (process.platform === "darwin")
			log ("Open TextEdit and Notes");

		if (process.platform === "win32")
			log ("Open Notepad and Wordpad");

		getline();
		var w1, w2, wx = Window.getActive();

		log ("Focus 1st app...\n");
		while (true)
		{
			w1 = Window.getActive();
			if (w1.ne (wx)) break;
			Timer.sleep (250);
		}

		log ("Focus 2nd app...\n\n");
		while (true)
		{
			w2 = Window.getActive();
			if (w2.ne (w1) &&
				w2.ne (wx)) break;
			Timer.sleep (250);
		}

		//----------------------------------------------------------------------------//

		assert (w1.isValid());
		assert (w2.isValid());

		var w3 = Window (w1.getHandle());
		var w4 = Window ();
		assert (w4.setHandle
			(w2.getHandle()));

		assert (w3.isValid());
		assert (w4.isValid());

		if (process.platform === "linux")
		{
			assert (w1.getProcess().getName() === "leafpad");
			assert (w2.getProcess().getName() === "gedit"  );
		}

		if (process.platform === "darwin")
		{
			assert (w1.getProcess().getName() === "TextEdit");
			assert (w2.getProcess().getName() === "Notes"   );

			assert (w1.getHandle() !== 0);
			assert (w2.getHandle() !== 0);
			assert (w3.getHandle() !== 0);
			assert (w4.getHandle() !== 0);

			assert (w3.getHandle() === w1.getHandle()); assert (w3.eq (w1));
			assert (w3.getHandle() !== w2.getHandle()); assert (w3.ne (w2));
			assert (w3.eq (w1.getHandle()));
			assert (w3.ne (w2.getHandle()));

			assert (w4.getHandle() !== w1.getHandle()); assert (w4.ne (w1));
			assert (w4.getHandle() === w2.getHandle()); assert (w4.eq (w2));
			assert (w4.ne (w1.getHandle()));
			assert (w4.eq (w2.getHandle()));
		}

		if (process.platform === "win32")
		{
			assert (w1.getProcess().getName() === "notepad.exe");
			assert (w2.getProcess().getName() === "wordpad.exe");
		}

		if (process.platform === "linux" ||
			process.platform === "win32")
		{
			assert (w1.getHandle() !== 0);
			assert (w2.getHandle() !== 0);
			assert (w3.getHandle() !== 0);
			assert (w4.getHandle() !== 0);

			assert (w3.getHandle() === w1.getHandle()); assert (w3.eq (w1));
			assert (w3.getHandle() !== w2.getHandle()); assert (w3.ne (w2));
			assert (w3.eq (w1.getHandle()));
			assert (w3.ne (w2.getHandle()));

			assert (w4.getHandle() !== w1.getHandle()); assert (w4.ne (w1));
			assert (w4.getHandle() === w2.getHandle()); assert (w4.eq (w2));
			assert (w4.ne (w1.getHandle()));
			assert (w4.eq (w2.getHandle()));

			assert (!w1.isTopMost()); assert (!w1.isBorderless());
			assert (!w2.isTopMost()); assert (!w2.isBorderless());

			w1.setTopMost    (true);
			w2.setBorderless (true);
			Timer.sleep (500);

			assert ( w1.isTopMost()); assert (!w1.isBorderless());
			assert (!w2.isTopMost()); assert ( w2.isBorderless());

			log ("1st app is topmost, 2nd app is borderless");
			getline();

			w1.setTopMost    (false);
			w2.setTopMost    (true );
			w1.setBorderless (true );
			w2.setBorderless (false);
			Timer.sleep (500);

			assert (!w1.isTopMost()); assert ( w1.isBorderless());
			assert ( w2.isTopMost()); assert (!w2.isBorderless());

			log ("2nd app is topmost, 1st app is borderless");
			getline();

			w1.setBorderless (false);
			w2.setTopMost    (false);
			Timer.sleep (500);

			assert (!w1.isTopMost()); assert (!w1.isBorderless());
			assert (!w2.isTopMost()); assert (!w2.isBorderless());

			log ("Both applications are now back to normal\n");
			getline();
		}

		//----------------------------------------------------------------------------//

		log ("Press enter to activate 1st app"); getline();
		Window.setActive (w1); Timer.sleep (500); assert (Window.getActive().eq (w1));

		log ("Press enter to activate 2nd app\n"); getline();
		Window.setActive (w2); Timer.sleep (500); assert (Window.getActive().eq (w2));

		//----------------------------------------------------------------------------//

		var t1 = w1.getTitle();
		var t2 = w2.getTitle();

		var b1 = w1.getBounds();
		var b2 = w2.getBounds();

		w1.setBounds (100, 100, 250, 300); w1.setTitle ("Hello");
		w2.setBounds (350, 400, 550, 400); w2.setTitle ("World");
		Timer.sleep (500);
		assert (w1.getBounds().eq (Bounds (100, 100, 250, 300)));
		assert (w2.getBounds().eq (Bounds (350, 400, 550, 400)));

		if (process.platform === "darwin")
		{
			log ("w1 = " + w1.getTitle() + " | ");
			log ("w2 = " + w2.getTitle() + " \n");
		}

		else
		{
			assert (w1.getTitle() === "Hello");
			assert (w2.getTitle() === "World");
		}

		log ("Verify window title & arrangement");
		getline();

		w1.setBounds (100, 400, 250, 300);
		w2.setBounds (350, 100, 550, 400);
		Timer.sleep (500);
		assert (w1.getBounds().eq (Bounds (100, 400, 250, 300)));
		assert (w2.getBounds().eq (Bounds (350, 100, 550, 400)));

		if (process.platform !== "darwin")
		{
			assert (w1.getTitle() === "Hello");
			assert (w2.getTitle() === "World");
		}

		log ("Verify window title & arrangement");
		getline();

		if (process.platform === "darwin" ||
			process.platform === "win32")
		{
			w1.setBounds (-50, 400, 250, 300);
			w2.setBounds (200, 100, 550, 600);
			Timer.sleep (500);
			assert (w1.getBounds().eq (Bounds (-50, 400, 250, 300)));
			assert (w2.getBounds().eq (Bounds (200, 100, 550, 600)));
			log ("Verify window title & arrangement");
			getline();
		}

		if (process.platform === "linux" ||
			process.platform === "win32")
		{
			w1.setClient (100, 100, 250, 300); w1.setTitle ("");
			w2.setBounds (350, 400, 550, 300); w2.setTitle ("");
			Timer.sleep (500);
			assert (w1.getClient().eq (Bounds (100, 100, 250, 300)));
			assert (w2.getBounds().eq (Bounds (350, 400, 550, 300)));
			assert (w1.getTitle().length === 0);
			assert (w2.getTitle().length === 0);
			log ("Verify window title & arrangement");
			getline();
		}

		log ("\n");
		w1.setBounds (b1); w1.setTitle (t1);
		w2.setBounds (b2); w2.setTitle (t2);
		Timer.sleep (500);
		assert (w1.getBounds().eq (b1));
		assert (w2.getBounds().eq (b2));

		if (process.platform !== "darwin")
		{
			assert (w1.getTitle() === t1);
			assert (w2.getTitle() === t2);
		}

		//----------------------------------------------------------------------------//

		w1.close();
		w2.close();
		Timer.sleep (1000);
		assert (!w1.isValid());
		assert (!w2.isValid());

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testSelect2()
	{
		log ("Warning: The next set of tests cannot be automated\n"  );
		log ("         Please execute the following instructions\n\n");

		//----------------------------------------------------------------------------//

		if (process.platform === "linux")
			log ("Open Leafpad");

		if (process.platform === "darwin")
			log ("Open TextEdit");

		if (process.platform === "win32")
			log ("Open Notepad");

		getline();
		var w, wx = Window.getActive();

		log ("Focus the application to begin mapping test...\n");
		while (true)
		{
			w = Window.getActive();
			if (w.ne (wx)) break;
			Timer.sleep (250);
		}

		if (process.platform === "linux")
			assert (w.getProcess().getName() === "leafpad");

		if (process.platform === "darwin")
			assert (w.getProcess().getName() === "TextEdit");

		if (process.platform === "win32")
			assert (w.getProcess().getName() === "notepad.exe");

		//----------------------------------------------------------------------------//

		var b = w.getBounds();
		w.setBounds (Bounds (250, 250));
		while (Window.getActive().eq (w))
		{
			var mp = Mouse.getPos();

			var p1 = w.mapToClient (mp);
			var p2 = w.mapToScreen (p1);
			assert (p2.eq (mp));

			log (sprintf ("%4d %4d\n", p1.x, p1.y));
			Timer.sleep (30);
		}

		log ("\n");
		w.setBounds (b);

		//----------------------------------------------------------------------------//

		log ("Press enter to begin min max test");
		assert (!w.isMinimized());
		assert (!w.isMaximized());

		log ("\nKeep window !min !max"); getline();
		w.setMinimized (false); Timer.sleep (500);
		log (" - !Min = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMinimized (true ); Timer.sleep (500);
		log (" -  Min = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMaximized (false); Timer.sleep (500);
		log (" - !Max = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMaximized (true ); Timer.sleep (500);
		log (" -  Max = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();

		log ("\nKeep window  min !max"); getline();
		w.setMinimized (false); Timer.sleep (500);
		log (" - !Min = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMinimized (true ); Timer.sleep (500);
		log (" -  Min = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMaximized (false); Timer.sleep (500);
		log (" - !Max = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMaximized (true ); Timer.sleep (500);
		log (" -  Max = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();

		log ("\nKeep window !min  max"); getline();
		w.setMinimized (false); Timer.sleep (500);
		log (" - !Min = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMinimized (true ); Timer.sleep (500);
		log (" -  Min = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMaximized (false); Timer.sleep (500);
		log (" - !Max = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMaximized (true ); Timer.sleep (500);
		log (" -  Max = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();

		log ("\nKeep window  min  max"); getline();
		w.setMinimized (false); Timer.sleep (500);
		log (" - !Min = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMinimized (true ); Timer.sleep (500);
		log (" -  Min = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMaximized (false); Timer.sleep (500);
		log (" - !Max = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();
		w.setMaximized (true ); Timer.sleep (500);
		log (" -  Max = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();

		log ("\nKeep window  min !max"); getline();
		Window.setActive (w); Timer.sleep (500);
		log (" - Active = ");
		log (w.isMinimized() ? " Min " : "!Min ");
		log (w.isMaximized() ? " Max " : "!Max "); getline();

		log ("\nPress enter to continue\n"); getline();
		assert (!w.isMinimized());
		assert (!w.isMaximized());

		//----------------------------------------------------------------------------//

		w.close(); Timer.sleep (750); assert (!w.isValid());

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testGetList1()
	{
		log ("Warning: The next set of tests cannot be automated\n" );
		log ("         Please verify the following window lists\n\n");

		if (process.platform === "linux")
			log ("Open a couple Leafpads & gedits and press enter\n");

		if (process.platform === "darwin")
			log ("Open a couple TextEdits & Notes and press enter\n");

		if (process.platform === "win32")
			log ("Open a couple Notepads & Wordpads and press enter\n");

		getline();

		if (process.platform === "linux" ||
			process.platform === "win32")
		{
			// This result is unreliable on OSX
			assert (Window.getList ("*").length === 0);
			assert (Window.getList (")").length === 0);
		}

		var list1 = Window.getList (    );
		var list2 = Window.getList (".*");
		log ("List all - " + list1.length + "\n");

		assert (list1.length !==            0);
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			assert (list1[i].isValid());
			assert (list2[i].isValid());

			assert ( list1[i].eq (list2[i]));
			assert (!list1[i].ne (list2[i]));

			log (sprintf ("%6d", list1[i].getPID()));
			log (": "  + list1[i].getTitle() + "\n");
		}

		log ("\n");
		list1 = Window.getList ("");
		list2 = Window.getList ("");
		log ("List \"\" - " + list1.length + "\n");
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			assert (list1[i].isValid());
			assert (list2[i].isValid());

			assert ( list1[i].eq (list2[i]));
			assert (!list1[i].ne (list2[i]));

			log (sprintf ("%6d", list1[i].getPID()));
			log (": "  + list1[i].getTitle() + "\n");
		}

		log ("\n");
		list1 = Window.getList (".*a.*");
		list2 = Window.getList (".*A.*");
		log ("List *a* - " + list1.length + "\n");
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			var title = list1[i].getTitle();
			assert (title.indexOf ("a") >= 0 ||
					title.indexOf ("A") >= 0);
		}

		log ("Verified\n\n");

		if (process.platform === "linux")
		{
			list1 = Window.getList (".*(untitled).*|.*gedit.*");
			list2 = Window.getList (".*gEdit.*|.*(Untitled).*");
		}

		if (process.platform === "darwin")
		{
			list1 = Window.getList (".*untitled.*|.*notes.*");
			list2 = Window.getList (".*Notes.*|.*Untitled.*");
		}

		if (process.platform === "win32")
		{
			list1 = Window.getList (".*notepad.*|.*wordpad.*");
			list2 = Window.getList (".*WordPad.*|.*NotePad.*");
		}

		log ("List apps - " + list1.length + "\n");

		assert (list1.length !==            0);
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			assert (list1[i].isValid());
			assert (list2[i].isValid());

			assert ( list1[i].eq (list2[i]));
			assert (!list1[i].ne (list2[i]));

			log (sprintf ("%6d", list1[i].getPID()));
			log (": "  + list1[i].getTitle() + "\n");
		}

		log ("\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testGetList2()
	{
		log ("Warning: The next set of tests cannot be automated\n" );
		log ("         Please verify the following window lists\n\n");

		log ("Open a multi-window testing application");
		getline();
		var w, wx = Window.getActive();

		log ("Focus the application to begin find test...\n");
		while (true)
		{
			w = Window.getActive();
			if (w.ne (wx)) break;
			Timer.sleep (250);
		}

		var list1 = w.getProcess().getWindows (    );
		var list2 = w.getProcess().getWindows (".*");
		log ("List all - " + list1.length + "\n");

		assert (list1.length !==            0);
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			assert (list1[i].isValid());
			assert (list2[i].isValid());

			assert ( list1[i].eq (list2[i]));
			assert (!list1[i].ne (list2[i]));

			log (sprintf ("%6d", list1[i].getPID()));
			log (": "  + list1[i].getTitle() + "\n");
		}

		log ("\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testArgs()
	{
		var w = Window ();
		var p = Process();

		assert (w.setTopMost,    w, [   ]);
		assert (w.setTopMost,    w, ["a"]);
		assert (w.setBorderless, w, [   ]);
		assert (w.setBorderless, w, ["a"]);
		assert (w.setMinimized,  w, [   ]);
		assert (w.setMinimized,  w, ["a"]);
		assert (w.setMaximized,  w, [   ]);
		assert (w.setMaximized,  w, ["a"]);
		assert (w.setHandle,     w, [   ]);
		assert (w.setHandle,     w, ["a"]);
		assert (w.setTitle,      w, [   ]);
		assert (w.setTitle,      w, [ 0 ]);
		assert (p.getWindows,    p, [ 0 ]);

		assert (w.setBounds,     w, ["a"]);
		assert (w.setClient,     w, ["a"]);
		assert (w.mapToClient,   w, ["a"]);
		assert (w.mapToScreen,   w, ["a"]);
		assert (w.setBounds,     w, [{ x: 0 }]);
		assert (w.setClient,     w, [{ x: 0 }]);
		assert (w.mapToClient,   w, [{ x: 0 }]);
		assert (w.mapToScreen,   w, [{ x: 0 }]);

		assert (Window.getList,     Window, [0]);
		assert (Window.setActive,   Window, [0]);
		assert (Window.isAxEnabled, Window, [0]);

		assert (w.eq, w, [   ]);
		assert (w.ne, w, [   ]);
		assert (w.eq, w, ["a"]);
		assert (w.ne, w, ["a"]);

		assert (typeof w.isValid       (    ) === "boolean"     );
		assert (typeof w.close         (    ) === "undefined"   );
		assert (typeof w.isTopMost     (    ) === "boolean"     );
		assert (typeof w.isBorderless  (    ) === "boolean"     );
		assert (typeof w.isMinimized   (    ) === "boolean"     );
		assert (typeof w.isMaximized   (    ) === "boolean"     );
		assert (typeof w.setTopMost    (true) === "undefined"   );
		assert (typeof w.setBorderless (true) === "undefined"   );
		assert (typeof w.setMinimized  (true) === "undefined"   );
		assert (typeof w.setMaximized  (true) === "undefined"   );
		assert (       w.getProcess    (    ) instanceof Process);
		assert (typeof w.getPID        (    ) === "number"      );
		assert (typeof w.getHandle     (    ) === "number"      );
		assert (typeof w.setHandle     (8888) === "boolean"     );
		assert (typeof w.getTitle      (    ) === "string"      );
		assert (typeof w.setTitle      ("  ") === "undefined"   );
		assert (       w.getBounds     (    ) instanceof Bounds );
		assert (typeof w.setBounds     (    ) === "undefined"   );
		assert (       w.getClient     (    ) instanceof Bounds );
		assert (typeof w.setClient     (    ) === "undefined"   );
		assert (       w.mapToClient   (    ) instanceof Point  );
		assert (       w.mapToScreen   (    ) instanceof Point  );

		assert (       p.getWindows    (    ) instanceof Array  );

		assert (       Window.getList     (     ) instanceof Array );
		assert (       Window.getList     (".*" ) instanceof Array );
		assert (       Window.getActive   (     ) instanceof Window);
		assert (typeof Window.setActive   (  w  ) === "undefined"  );
		assert (typeof Window.isAxEnabled (     ) === "boolean"    );
		assert (typeof Window.isAxEnabled (false) === "boolean"    );

		assert (typeof w.eq (w) === "boolean");
		assert (typeof w.ne (w) === "boolean");
		assert (typeof w.eq (8) === "boolean");
		assert (typeof w.ne (8) === "boolean");

		return true;
	}



	//----------------------------------------------------------------------------//
	// Main                                                                       //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	return function()
	{
		log ("BEGIN WINDOW TESTING\n------------------------------\n");
		assert (Window.isAxEnabled());
		if (!testInvalid ()) { log (">> Invalid Failed \n\n"); return false; }
		if (!testSelect1 ()) { log (">> Select1 Failed \n\n"); return false; }
		if (!testSelect2 ()) { log (">> Select2 Failed \n\n"); return false; }
		if (!testGetList1()) { log (">> GetList1 Failed\n\n"); return false; }
		if (!testGetList2()) { log (">> GetList2 Failed\n\n"); return false; }
		if (!testArgs    ()) { log (">> TestArgs Failed\n\n"); return false; }
		log (">> Success\n\n"); return true;
	};
};
