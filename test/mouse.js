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

	var m = Mouse();



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function testLive()
	{
		m.autoDelay = Range (1000);
		var p, old;

		log ("Press enter to begin live test");
		getline();

		old = Mouse.getPos();
		Mouse.setPos ( 50, 200); Timer.sleep (1000); p = Mouse.getPos(); assert (p.x ===  50 && p.y === 200);
		Mouse.setPos (200,  50); Timer.sleep (1000); p = Mouse.getPos(); assert (p.x === 200 && p.y ===  50);
		Mouse.setPos (  0,   0); Timer.sleep (1000); p = Mouse.getPos(); assert (p.x ===   0 && p.y ===   0);
		Mouse.setPos (old     ); Timer.sleep (1000); p = Mouse.getPos(); assert (p.eq (old));

		log ("\nWarning: The next set of tests cannot be automated\n");
		log ("         Please review the following instructions!\n\n");

		log ("- Live testing will be performed in sets\n"  );
		log ("- Press enter to begin testing a new set\n"  );
		log ("- After beginning, focus the testing app\n"  );
		log ("- Verify results before testing next set\n\n");

		log ("Scroll");
		getline();
		Timer.sleep (2500);
		m.scrollV (1); m.scrollV (-1); m.scrollV (-1); m.scrollV (1);
		m.scrollV (3); m.scrollV (-2); m.scrollV (-2); m.scrollV (1);
		m.scrollH (2); m.scrollH (-1); m.scrollH (-2); m.scrollH (1);

		log ("Click");
		getline();
		Timer.sleep (2500);
		m.click (robot.BUTTON_LEFT );
		m.click (robot.BUTTON_MID  );
		m.click (robot.BUTTON_RIGHT);
		m.click (robot.BUTTON_X1   );
		m.click (robot.BUTTON_X2   );
		// http://unixpapa.com/js/testmouse.html

		m.autoDelay.min = 40;
		m.autoDelay.max = 90;

		log ("Fast Double Click");
		getline();
		Timer.sleep (2500);
		m.click (robot.BUTTON_LEFT);
		m.click (robot.BUTTON_LEFT);

		log ("Slow Double Click");
		getline();
		Timer.sleep (2500);
		m.click (robot.BUTTON_LEFT);
		Timer.sleep (1500);
		m.click (robot.BUTTON_LEFT);

		log ("Click and Drag L");
		getline();
		Timer.sleep (2500);
		m.press (robot.BUTTON_LEFT);
		Timer.sleep (1000);

		old = Mouse.getPos();
		Mouse.setPos (old.sub (50));
		Timer.sleep (1000);

		Mouse.setPos (old);
		m.release (robot.BUTTON_LEFT);

		log ("Click and Drag R");
		getline();
		Timer.sleep (2500);
		m.press (robot.BUTTON_RIGHT);
		Timer.sleep (1000);

		old = Mouse.getPos();
		Mouse.setPos (old.sub (50));
		Timer.sleep (1000);

		Mouse.setPos (old);
		m.release (robot.BUTTON_RIGHT);

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testGetState()
	{
		log ("\nWarning: The next set of tests cannot be automated\n");
		log ("         Please review the following instructions!\n\n");

		log ("- Press buttons and verify output\n");
		log ("- Press enter to begin testing\n"   );
		log ("- Press escape to stop testing\n"   );

		getline();

		m.press (robot.BUTTON_LEFT);
		m.press (robot.BUTTON_MID );
		assert (Mouse.getState (robot.BUTTON_LEFT) &&
				Mouse.getState (robot.BUTTON_MID ));

		m.release (robot.BUTTON_LEFT);
		// Get the state of all buttons
		var state = Mouse.getState();
		assert (!state[robot.BUTTON_LEFT] &&
				 state[robot.BUTTON_MID]);
		m.release (robot.BUTTON_MID);

		// Iterate until the escape key is pressed
		while (!Keyboard.getState (robot.KEY_ESCAPE))
		{
			// Get the state of all buttons
			var state = Mouse.getState();

			if (state[robot.BUTTON_LEFT ]) log ("Left\t" );
			if (state[robot.BUTTON_MID  ]) log ("Mid\t"  );
			if (state[robot.BUTTON_RIGHT]) log ("Right\t");
			if (state[robot.BUTTON_X1   ]) log ("X1\t"   );
			if (state[robot.BUTTON_X2   ]) log ("X2\t"   );

			log ("\n"); Timer.sleep (90);
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testArgs()
	{
		assert (m.click,   m, [   ]);
		assert (m.click,   m, ["a"]);
		assert (m.press,   m, [   ]);
		assert (m.press,   m, ["a"]);
		assert (m.release, m, [   ]);
		assert (m.release, m, ["a"]);

		assert (m.scrollH, m, [   ]);
		assert (m.scrollH, m, ["a"]);
		assert (m.scrollV, m, [   ]);
		assert (m.scrollV, m, ["a"]);

		assert (Mouse.setPos,   Mouse, [{ x: 0 }]);
		assert (Mouse.setPos,   Mouse, ["a"]);
		assert (Mouse.getState, Mouse, ["a"]);

		assert (typeof m.click   (robot.BUTTON_LEFT) === "undefined");
		assert (typeof m.press   (robot.BUTTON_LEFT) === "undefined");
		assert (typeof m.release (robot.BUTTON_LEFT) === "undefined");
		assert (typeof m.scrollH (1                ) === "undefined");
		assert (typeof m.scrollV (1                ) === "undefined");

		assert (       Mouse.getPos   () instanceof Point);
		assert (typeof Mouse.setPos   () === "undefined" );
		assert (typeof Mouse.getState () === "object"    );
		assert (typeof Mouse.getState (robot.BUTTON_LEFT) === "boolean");

		return true;
	}



	//----------------------------------------------------------------------------//
	// Main                                                                       //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	return function()
	{
		log ("BEGIN MOUSE TESTING\n------------------------------\n");
		if (!testLive    ()) { log (">> Live Test Failed\n\n"); return false; }
		if (!testGetState()) { log (">> Get State Failed\n\n"); return false; }
		if (!testArgs    ()) { log (">> Test Args Failed\n\n"); return false; }
		log (">> Success\n\n"); return true;
	};
};
