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

	var Color    = robot.Color;
	var Image    = robot.Image;
	var Point    = robot.Point;
	var Bounds   = robot.Bounds;

	var Timer    = robot.Timer;
	var Mouse    = robot.Mouse;
	var Keyboard = robot.Keyboard;
	var Window   = robot.Window;
	var Screen   = robot.Screen;

	var fs  = require ("fs"      );
	var png = require ("node-png").PNG;



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function testInvalid()
	{
		var b1 = Bounds (            );
		var b2 = Bounds ( 1,  2, 3, 4);
		var b3 = Bounds (-1, -2, 4, 3);
		var b4 = Bounds ( 0 , 0, 2, 2);

		assert (Screen.getTotalBounds().eq (b1));
		assert (Screen.getTotalUsable().eq (b1));
		assert (Screen.getMain()            === null);
		assert (Screen.getList().length     === 0   );
		assert (Screen.getScreen (Window()) === null);
		assert (Screen.getScreen (Point ()) === null);
		assert (Screen.getScreen (  0,   0) === null);

		var s1 = Screen();
		var s2 = Screen();
		assert ( s1.getBounds  ().eq (b1));
		assert ( s1.getUsable  ().eq (b1));
		assert (!s1.isPortrait ());
		assert ( s1.isLandscape());

		s1 = Screen (b2, b1);
		s2 = Screen (b1, b2);
		assert ( s1.getBounds  ().eq (b2));
		assert ( s1.getUsable  ().eq (b1));
		assert ( s1.isPortrait ());
		assert (!s1.isLandscape());
		assert ( s2.getBounds  ().eq (b1));
		assert ( s2.getUsable  ().eq (b2));
		assert (!s2.isPortrait ());
		assert ( s2.isLandscape());

		s1 = Screen (b3, b1);
		s2 = Screen (b1, b3);
		assert ( s1.getBounds  ().eq (b3));
		assert ( s1.getUsable  ().eq (b1));
		assert (!s1.isPortrait ());
		assert ( s1.isLandscape());
		assert ( s2.getBounds  ().eq (b1));
		assert ( s2.getUsable  ().eq (b3));
		assert (!s2.isPortrait ());
		assert ( s2.isLandscape());

		s1 = Screen (b4, b1);
		s2 = Screen (b1, b4);
		assert ( s1.getBounds  ().eq (b4));
		assert ( s1.getUsable  ().eq (b1));
		assert (!s1.isPortrait ());
		assert ( s1.isLandscape());
		assert ( s2.getBounds  ().eq (b1));
		assert ( s2.getUsable  ().eq (b4));
		assert (!s2.isPortrait ());
		assert ( s2.isLandscape());

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testAero()
	{
		if (process.platform === "linux" ||
			process.platform === "darwin")
		{
			assert (Screen.isCompositing());

			Screen.setCompositing (false);
			assert (Screen.isCompositing());

			Screen.setCompositing (true );
			assert (Screen.isCompositing());
		}

		if (process.platform === "win32")
		{
			log ("Composition status: " +
				(Screen.isCompositing() ?
				 "enabled" : "disabled"));
			getline();

			Screen.setCompositing (false);

			log ("Composition status: " +
				(Screen.isCompositing() ?
				 "enabled" : "disabled"));
			getline();

			Screen.setCompositing (true );

			log ("Composition status: " +
				(Screen.isCompositing() ?
				 "enabled" : "disabled"));
			getline();

			log ("\n");
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testSync()
	{
		assert (Screen.synchronize());

		var main = Screen.getMain();
		var list = Screen.getList();
		assert (list.length > 0);
		assert (main !== null);

		assert (Screen.getTotalBounds().isValid());
		assert (Screen.getTotalUsable().isValid());
		log ("Total bounds: " + Screen.getTotalBounds() + "\n"  );
		log ("Total usable: " + Screen.getTotalUsable() + "\n\n");

		// Loop through every available screen
		for (var i = 0; i < list.length; ++i)
		{
			assert (list[i].getBounds().isValid());
			assert (list[i].getUsable().isValid());
			assert (list[i].isPortrait () ||
					list[i].isLandscape());

			if (i === 0) assert (list[i] === main);
					else assert (list[i] !== main);

			var sPort =  list[i].isPortrait () ? "true" : "false";
			var sLand =  list[i].isLandscape() ? "true" : "false";
			var sMain = (list[i] === main    ) ? "true" : "false";

			log ("Screen "  + i + "\n");
			log ("Bounds: " + list[i].getBounds() + "\n");
			log ("Usable: " + list[i].getUsable() + "\n");
			log ("  Port: " + sPort + "\n"  );
			log ("  Land: " + sLand + "\n"  );
			log ("  Main: " + sMain + "\n\n");
		}

		log ("Please verify these results\n"); getline();

		//----------------------------------------------------------------------------//

		log ("Press enter  to begin mouse tracking\n");
		log ("Press escape to continue other tests"  );
		getline();

		var last = -1; var usePoint = false;
		// Iterate until the escape key is pressed
		while (!Keyboard.getState (robot.KEY_ESCAPE))
		{
			var p = Mouse.getPos();
			var s = (usePoint = !usePoint) ?
					 Screen.getScreen (p) :
					 Screen.getScreen (p.x, p.y);

			assert (s !== null);

			var curr = -1;
			// Loop through every available screen
			for (var i = 0; i < list.length; ++i)
				if (list[i] === s) { curr = i; break; }

			assert (curr >= 0);
			if (last !== curr)
				log ((last = curr) + "\n");

			Timer.sleep (90);
		}

		log ("\n");

		//----------------------------------------------------------------------------//

		if (process.platform === "linux")
			log ("Open Leafpad");

		if (process.platform === "darwin")
			log ("Open TextEdit");

		if (process.platform === "win32")
			log ("Open Notepad");

		getline();
		var w, wx = Window.getActive();

		log ("Focus the application to begin mouse tracking\n");
		while (true)
		{
			w = Window.getActive();
			if (w.ne (wx)) break;
			Timer.sleep (250);
		}

		last = -1;
		while (Window.getActive().eq (w))
		{
			var s = Screen.getScreen (w);
			assert (s !== null);

			var curr = -1;
			// Loop through every available screen
			for (var i = 0; i < list.length; ++i)
				if (list[i] === s) { curr = i; break; }

			assert (curr >= 0);
			if (last !== curr)
				log ((last = curr) + "\n");

			Timer.sleep (90);
		}

		log ("\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testGrab()
	{
		var image1 = Image ();
		var image2 = Image ();
		var window = Window();
		assert (Screen.synchronize());

		var test = function (name, x, y, w, h)
		{
			var bounds = Bounds (x, y, w, h);
			Screen.grabScreen (image1, x,y,w,h, window); assert (image1.isValid());
			Screen.grabScreen (image2,  bounds, window); assert (image2.isValid());

			var result = new png ({
				 width: image1.getWidth (),
				height: image1.getHeight()
			});

			var data = image1.getData  ();
			var size = image1.getLength();
			var buffer = result.data;
			assert (image1.swap ("abgr"));

			for (var i = 0, j = 0; i < size; ++i, j += 4)
				buffer.writeUInt32LE (data[i], j);

			result.pack().pipe (fs.createWriteStream (name));
			return true;
		};

		//----------------------------------------------------------------------------//

		test ("0-01.png",    0,    0,    0,    0);
		test ("0-02.png",    0,    0,   50,  150);
		test ("0-03.png",  -50, -150,   -1,   -1);
		test ("0-04.png",  -50, -150,  150,  250);
		test ("0-05.png",   50,  150,   -1,   -1);
		test ("0-06.png",   50,  150,   50,  150);
		test ("0-07.png", 4000, 2000,   -1,   -1);
		test ("0-08.png", 4000, 2000,   50,  150);
		test ("0-09.png",    0,    0, 4000, 2000);
		test ("0-10.png",  -50, -150, 4000, 2000);
		test ("0-11.png",   50,  150, 4000, 2000);
		test ("0-12.png", 4000, 2000, 4000, 2000);

		log ("Please verify saved images\n"); getline();

		//----------------------------------------------------------------------------//

		if (process.platform === "linux")
			log ("Open Leafpad");

		if (process.platform === "darwin")
			log ("Open TextEdit");

		if (process.platform === "win32")
			log ("Open Notepad");

		getline();
		var w, wx = Window.getActive();

		log ("Focus the application to begin screen tests\n");
		while (true)
		{
			w = Window.getActive();
			if (w.ne (wx)) break;
			Timer.sleep (250);
		}

		window = w;
		test ("1-01.png",    0,    0,   -1,   -1);
		test ("1-02.png",    0,    0,   50,  150);
		test ("1-03.png",  -50, -150,   -1,   -1);
		test ("1-04.png",  -50, -150,  150,  250);
		test ("1-05.png",   50,  150,   -1,   -1);
		test ("1-06.png",   50,  150,   50,  150);
		test ("1-07.png", 4000, 2000,   -1,   -1);
		test ("1-08.png", 4000, 2000,   50,  150);
		test ("1-09.png",    0,    0, 4000, 2000);
		test ("1-10.png",  -50, -150, 4000, 2000);
		test ("1-11.png",   50,  150, 4000, 2000);
		test ("1-12.png", 4000, 2000, 4000, 2000);

		log ("Please verify saved images\n"); getline();
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testSpeed()
	{
		var timer = Timer ();
		var image = Image (1920, 1080);
		assert (Screen.synchronize());

		//----------------------------------------------------------------------------//

		log ("Small  image (ms): ");
		for (var i = 0; i < 5; ++i)
		{
			timer.start();
			assert (Screen.grabScreen
				(image, 0, 0, 16, 16));

			log (timer.getElapsed() + " ");
		}

		log ("\n");

		//----------------------------------------------------------------------------//

		log ("Medium image (ms): ");
		for (var i = 0; i < 5; ++i)
		{
			timer.start();
			assert (Screen.grabScreen
				(image, 0, 0, 512, 512));

			log (timer.getElapsed() + " ");
		}

		log ("\n");

		//----------------------------------------------------------------------------//

		log ("Large  image (ms): ");
		for (var i = 0; i < 5; ++i)
		{
			timer.start();
			assert (Screen.grabScreen
				(image, 0, 0, 1920, 1080));

			log (timer.getElapsed() + " ");
		}

		log ("\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testArgs()
	{
		var p  = Point ();
		var b  = Bounds();
		var s  = Screen();
		var i  = Image ();
		var w1 = Window();
		var w2 = Window.getActive();

		assert (Screen.getScreen,      Screen, [" "]);
		assert (Screen.grabScreen,     Screen, [   ]);
		assert (Screen.grabScreen,     Screen, [ 0 ]);
		assert (Screen.grabScreen,     Screen, [" "]);
		assert (Screen.setCompositing, Screen, [   ]);
		assert (Screen.setCompositing, Screen, [ 0 ]);
		assert (Screen.setCompositing, Screen, [" "]);

		assert (       s.getBounds  () instanceof Bounds);
		assert (       s.getUsable  () instanceof Bounds);
		assert (typeof s.isPortrait () === "boolean");
		assert (typeof s.isLandscape() === "boolean");

		assert (typeof Screen.synchronize    (    ) === "boolean"    );
		assert (       Screen.getMain        (    ) instanceof Screen);
		assert (       Screen.getList        (    ) instanceof Array );
		assert (       Screen.getScreen      (w1  ) === null         );
		assert (       Screen.getScreen      (w2  ) instanceof Screen);
		assert (       Screen.getScreen      (p   ) instanceof Screen);
		assert (       Screen.getScreen      (0, 0) instanceof Screen);
		assert (typeof Screen.grabScreen     (i, b, w1) === "boolean");
		assert (typeof Screen.grabScreen     (i, b, w2) === "boolean");
		assert (       Screen.getTotalBounds (    ) instanceof Bounds);
		assert (       Screen.getTotalUsable (    ) instanceof Bounds);
		assert (typeof Screen. isCompositing (    ) === "boolean"    );
		assert (typeof Screen.setCompositing (true) === "undefined"  );

		return true;
	}



	//----------------------------------------------------------------------------//
	// Main                                                                       //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	return function()
	{
		log ("BEGIN SCREEN TESTING\n------------------------------\n");

		log ("Warning: Some set of tests cannot be automated\n"  );
		log ("         Please execute the following commands\n\n");

		if (!testInvalid()) { log (">> Invalid Failed\n\n"); return false; }
		if (!testAero   ()) { log (">> Aero Failed   \n\n"); return false; }
		if (!testSync   ()) { log (">> Sync Failed   \n\n"); return false; }
		if (!testGrab   ()) { log (">> Grab Failed   \n\n"); return false; }
		if (!testSpeed  ()) { log (">> Speed Failed  \n\n"); return false; }
		if (!testArgs   ()) { log (">> Args Failed   \n\n"); return false; }
		log (">> Success\n\n"); return true;
	};
};
