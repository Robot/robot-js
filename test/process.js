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

	var Process = robot.Process;



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function testInvalid()
	{
		var p1 = Process ();
		var p2 = Process (); assert (!p2.open ( 0));
		var p3 = Process (); assert (!p3.open (-1));
		var p4 = Process (8888);

		assert (!p1.isValid()); assert (!p1.is64Bit()); assert (p1.hasExited());
		assert (!p2.isValid()); assert (!p2.is64Bit()); assert (p2.hasExited());
		assert (!p3.isValid()); assert (!p3.is64Bit()); assert (p3.hasExited());
		assert (!p4.isValid()); assert (!p4.is64Bit()); assert (p4.hasExited());

		assert (p1.getPID() === 0);
		assert (p2.getPID() === 0);
		assert (p3.getPID() === 0);
		assert (p4.getPID() === 0);

		assert (p1.getName().length === 0); assert (p1.getPath().length === 0);
		assert (p2.getName().length === 0); assert (p2.getPath().length === 0);
		assert (p3.getName().length === 0); assert (p3.getPath().length === 0);
		assert (p4.getName().length === 0); assert (p4.getPath().length === 0);

		assert ( p1.eq (p2)); assert ( p2.eq (p1));
		assert (!p1.ne (p2)); assert (!p2.ne (p1));
		assert ( p3.eq (p4)); assert ( p4.eq (p3));
		assert (!p3.ne (p4)); assert (!p4.ne (p3));

		assert (p1.eq (0)); assert (p1.ne (8888));
		assert (p2.eq (0)); assert (p2.ne (8888));
		assert (p3.eq (0)); assert (p3.ne (8888));
		assert (p4.eq (0)); assert (p4.ne (8888));

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testSelect()
	{
		var p1 = Process();
		var p2 = Process();
		var input1 = "";
		var input2 = "";
		log ("Warning: The next set of tests cannot be automated\n"  );
		log ("         Please execute the following instructions\n\n");

		if (process.platform === "linux")
		{
			log ("open Leafpad and input PID: "); input1 = getline();
			log ("open gedit   and input PID: "); input2 = getline();
		}

		if (process.platform === "darwin")
		{
			log ("open TextEdit and input PID: "); input1 = getline();
			log ("open Notes    and input PID: "); input2 = getline();
		}

		if (process.platform === "win32")
		{
			log ("open Notepad and input PID: "); input1 = getline();
			log ("open Wordpad and input PID: "); input2 = getline();
		}

		var pid1 = parseInt (input1); assert (pid1 > 0); assert (p1.open (pid1));
		var pid2 = parseInt (input2); assert (pid2 > 0); assert (p2.open (pid2));

		assert (p1.isValid()); assert (!p1.hasExited());
		assert (p2.isValid()); assert (!p2.hasExited());
		assert (p1.is64Bit() === p2.is64Bit());

		assert (p1.getPID() === pid1);
		assert (p2.getPID() === pid2);

		if (process.platform === "linux")
		{
			assert (p1.getName() === "leafpad");
			assert (p2.getName() === "gedit"  );

			assert (p1.getPath() === "/usr/bin/leafpad");
			assert (p2.getPath() === "/usr/bin/gedit"  );
		}

		if (process.platform === "darwin")
		{
			assert (p1.getName() === "TextEdit");
			assert (p2.getName() === "Notes"   );

			assert (p1.getPath() === "/Applications/TextEdit.app/Contents/MacOS/TextEdit");
			assert (p2.getPath() === "/Applications/Notes"+".app/Contents/MacOS/Notes"   );
		}

		if (process.platform === "win32")
		{
			assert (p1.getName() === "notepad.exe");
			assert (p2.getName() === "wordpad.exe");

			assert (p1.getPath() === "C:/Windows/System32/notepad.exe"                    );
			assert (p2.getPath() === "C:/Program Files/Windows NT/Accessories/wordpad.exe");
		}

		assert (!p1.eq (p2)); assert (!p2.eq (p1));
		assert ( p1.ne (p2)); assert ( p2.ne (p1));

		assert (p1.eq (pid1)); assert (p1.ne (8888));
		assert (p2.eq (pid2)); assert (p2.ne (8888));

		assert (!p1.ne (pid1)); assert (!p1.eq (8888));
		assert (!p2.ne (pid2)); assert (!p2.eq (8888));

		log ("Type something in both apps then press enter");
		getline();
		p1.exit();
		p2.kill();
		log ("close both applications and then press enter");
		getline();

		if (process.platform === "win32")
		{
			assert (p1.isValid());
			assert (p2.isValid());
		}

		assert (p1.hasExited());
		assert (p2.hasExited());

		log ("\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testCurrent()
	{
		log ("Warning: The next set of tests cannot be automated\n"  );
		log ("         Please execute the following instructions\n\n");

		log ("Input this application's PID: "); var input = getline();
		var pid = parseInt (input);

		assert (pid > 0);
		var p1 = Process (pid);
		var p2 = Process.getCurrent();

		assert (p1.isValid()); assert (!p1.hasExited());
		assert (p2.isValid()); assert (!p2.hasExited());

		assert (p1.getPID() === pid);
		assert (p2.getPID() === pid);

		if (process.arch === "ia32")
		{
			assert (!p1.is64Bit());
			assert (!p2.is64Bit());
		}

		if (process.arch === "x64")
		{
			assert (p1.is64Bit());
			assert (p2.is64Bit());
		}

		assert ( p1.eq (p2)); assert ( p2.eq (p1));
		assert (!p1.ne (p2)); assert (!p2.ne (p1));

		assert (p1.eq (pid)); assert (p1.ne (8888));
		assert (p2.eq (pid)); assert (p2.ne (8888));

		log ("Verify the following information\n");
		log ("Path: " + p2.getPath() + "    \n\n");

		p1.close(); assert (!p1.isValid());
		p2.close(); assert (!p2.isValid());

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testGetList()
	{
		log ("Warning: The next set of tests cannot be automated\n"  );
		log ("         Please verify the following process lists\n\n");

		if (process.platform === "linux")
			log ("open a couple Leafpads & gedits and press enter\n");

		if (process.platform === "darwin")
			log ("open a couple TextEdits & Notes and press enter\n");

		if (process.platform === "win32")
			log ("open a couple Notepads & Wordpads and press enter\n");

		getline();

		if (process.platform === "linux" ||
			process.platform === "win32")
		{
			// This result is unreliable on OSX
			assert (Process.getList ("*").length === 0);
			assert (Process.getList (")").length === 0);
		}

		var list1 = Process.getList (    );
		var list2 = Process.getList (".*");
		log ("List all - " + list1.length + "\n");

		assert (list1.length !==            0);
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			assert ( list1[i].isValid  ());
			assert ( list2[i].isValid  ());
			assert (!list1[i].hasExited());

			assert ( list1[i].eq (list2[i]));
			assert (!list1[i].ne (list2[i]));

			log (sprintf ("%6d ", list1[i].getPID()));
			log (list1[i].is64Bit() ? "x64 " : "x32 ");
			log (list1[i].getName() + "\n");
		}

		log ("\n");
		list1 = Process.getList (".*a.*");
		list2 = Process.getList (".*A.*");
		log ("List *a* - " + list1.length + "\n");
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			var name = list1[i].getName();
			assert (name.indexOf ("a") >= 0 ||
					name.indexOf ("A") >= 0);
		}

		log ("Verified\n\n");

		if (process.platform === "linux")
		{
			list1 = Process.getList (".*leafpad.*|.*gedit.*");
			list2 = Process.getList (".*gEdit.*|.*Leafpad.*");
		}

		if (process.platform === "darwin")
		{
			list1 = Process.getList (".*textedit.*|.*notes.*");
			list2 = Process.getList (".*Notes.*|.*TextEdit.*");
		}

		if (process.platform === "win32")
		{
			list1 = Process.getList (".*notepad.*|.*wordpad.*");
			list2 = Process.getList (".*WordPad.*|.*NotePad.*");
		}

		log ("List apps - " + list1.length + "\n");

		assert (list1.length !==            0);
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			assert ( list1[i].isValid  ());
			assert ( list2[i].isValid  ());
			assert (!list1[i].hasExited());

			assert ( list1[i].eq (list2[i]));
			assert (!list1[i].ne (list2[i]));

			log (sprintf ("%6d ", list1[i].getPID()));
			log (list1[i].is64Bit() ? "x64 " : "x32 ");
			log (list1[i].getName() + "\n");
		}

		log ("\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testArgs()
	{
		var p = Process();

		assert (p.open, p, [   ]);
		assert (p.open, p, ["a"]);
		assert (Process.getList, Process, [0]);

		assert (p.eq, p, [   ]);
		assert (p.ne, p, [   ]);
		assert (p.eq, p, ["a"]);
		assert (p.ne, p, ["a"]);

		assert (typeof p.open       (8888) === "boolean"  );
		assert (typeof p.close      (    ) === "undefined");
		assert (typeof p.isValid    (    ) === "boolean"  );
		assert (typeof p.is64Bit    (    ) === "boolean"  );
		assert (typeof p.isDebugged (    ) === "boolean"  );
		assert (typeof p.getPID     (    ) === "number"   );
		assert (typeof p.getName    (    ) === "string"   );
		assert (typeof p.getPath    (    ) === "string"   );
		assert (typeof p.exit       (    ) === "undefined");
		assert (typeof p.kill       (    ) === "undefined");
		assert (typeof p.hasExited  (    ) === "boolean"  );

		assert (       Process.getList   (    ) instanceof Array  );
		assert (       Process.getList   (".*") instanceof Array  );
		assert (       Process.getCurrent(    ) instanceof Process);
		assert (typeof Process.isSys64Bit(    ) === "boolean"     );

		assert (typeof p.eq (p) === "boolean");
		assert (typeof p.ne (p) === "boolean");
		assert (typeof p.eq (8) === "boolean");
		assert (typeof p.ne (8) === "boolean");

		return true;
	}



	//----------------------------------------------------------------------------//
	// Main                                                                       //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	return function()
	{
		log ("BEGIN PROCESS TESTING\n------------------------------\n");
		if (!testInvalid()) { log (">> Invalid Failed \n\n"); return false; }
		if (!testSelect ()) { log (">> Select Failed  \n\n"); return false; }
		if (!testCurrent()) { log (">> Current Failed \n\n"); return false; }
		if (!testGetList()) { log (">> getList Failed \n\n"); return false; }
		if (!testArgs   ()) { log (">> TestArgs Failed\n\n"); return false; }
		log (">> Success\n\n"); return true;
	};
};
