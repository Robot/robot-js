////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                       (C) 2010-2015 Robot Developers                       //
//                       See LICENSE for licensing info                       //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

"use strict";

//----------------------------------------------------------------------------//
// Exports                                                                    //
//----------------------------------------------------------------------------//

module.exports = function (robot, log, sprintf, getchar, assert)
{
	//----------------------------------------------------------------------------//
	// Locals                                                                     //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	var Timer = robot.Timer;



	//----------------------------------------------------------------------------//
	// Main                                                                       //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	return function()
	{
		log ("BEGIN TIMER TESTING\n------------------------------\n");

		var t1 = Timer(); assert (!t1.hasStarted());
		var t2 = Timer(); assert (!t2.hasStarted());
		t1.reset();       assert (!t1.hasStarted());

		assert (t1.hasExpired (  0));
		assert (t1.hasExpired (500));

		assert (t1.getElapsed() ===               0);
		assert (t1.getElapsed() === t1.getElapsed());

		assert ( t1.eq (t1)); assert ( t2.eq (t2));
		assert (!t1.ne (t1)); assert (!t2.ne (t2));
		assert ( t1.eq (t2)); assert ( t2.eq (t1));
		assert (!t1.ne (t2)); assert (!t2.ne (t1));

		assert (!t1.lt (t2)); assert (!t2.gt (t1));
		assert (!t1.gt (t2)); assert (!t2.lt (t1));
		assert ( t1.le (t2)); assert ( t2.ge (t1));
		assert ( t1.ge (t2)); assert ( t2.le (t1));

		assert (t1.lt (t2) === (t1.getElapsed() <  t2.getElapsed()));
		assert (t2.gt (t1) === (t2.getElapsed() >  t1.getElapsed()));
		assert (t1.gt (t2) === (t1.getElapsed() >  t2.getElapsed()));
		assert (t2.lt (t1) === (t2.getElapsed() <  t1.getElapsed()));
		assert (t1.le (t2) === (t1.getElapsed() <= t2.getElapsed()));
		assert (t2.ge (t1) === (t2.getElapsed() >= t1.getElapsed()));
		assert (t1.ge (t2) === (t1.getElapsed() >= t2.getElapsed()));
		assert (t2.le (t1) === (t2.getElapsed() <= t1.getElapsed()));

		assert (t1.getElapsed() === t1.restart()); t1.reset();
		assert (t2.getElapsed() === t2.restart()); t2.reset();

		//----------------------------------------------------------------------------//

		log ("Warning: The next set of tests cannot be automated\n"  );
		log ("         Please verify the following results below\n\n");

		t1.start();
		assert ( t1.hasStarted());
		assert (!t2.hasStarted());

		log ("CPU Time: " + Timer.getCpuTime() + "\n");
		log (sprintf ("%03d", t1.getElapsed()) + " = "       );
		log (sprintf ("%03d", t1.getElapsed()) + " =   0\n\n");

		assert (!t1.hasExpired (100));
		Timer.sleep (200);
		assert ( t1.hasExpired (100));

		log ("CPU Time: " + Timer.getCpuTime() + "\n");
		log (sprintf ("%03d", t1.getElapsed()) + " = "       );
		log (sprintf ("%03d", t1.getElapsed()) + " = 200\n\n");

		assert ( t1.eq (t1)); assert ( t2.eq (t2));
		assert (!t1.ne (t1)); assert (!t2.ne (t2));
		assert (!t1.eq (t2)); assert (!t2.eq (t1));
		assert ( t1.ne (t2)); assert ( t2.ne (t1));

		assert (!t1.lt (t2)); assert (!t2.gt (t1));
		assert ( t1.gt (t2)); assert ( t2.lt (t1));
		assert (!t1.le (t2)); assert (!t2.ge (t1));
		assert ( t1.ge (t2)); assert ( t2.le (t1));

		assert (t1.lt (t2) === (t1.getElapsed() <  t2.getElapsed()));
		assert (t2.gt (t1) === (t2.getElapsed() >  t1.getElapsed()));
		assert (t1.gt (t2) === (t1.getElapsed() >  t2.getElapsed()));
		assert (t2.lt (t1) === (t2.getElapsed() <  t1.getElapsed()));
		assert (t1.le (t2) === (t1.getElapsed() <= t2.getElapsed()));
		assert (t2.ge (t1) === (t2.getElapsed() >= t1.getElapsed()));
		assert (t1.ge (t2) === (t1.getElapsed() >= t2.getElapsed()));
		assert (t2.le (t1) === (t2.getElapsed() <= t1.getElapsed()));

		//----------------------------------------------------------------------------//

		t2.start();
		assert (t1.hasStarted());
		assert (t2.hasStarted());

		assert ( t1.hasExpired (100));
		assert (!t2.hasExpired (100));
		Timer.sleep (200);
		assert ( t1.hasExpired (100));
		assert ( t2.hasExpired (100));

		assert ( t1.eq (t1)); assert ( t2.eq (t2));
		assert (!t1.ne (t1)); assert (!t2.ne (t2));
		assert (!t1.eq (t2)); assert (!t2.eq (t1));
		assert ( t1.ne (t2)); assert ( t2.ne (t1));

		assert (!t1.lt (t2)); assert (!t2.gt (t1));
		assert ( t1.gt (t2)); assert ( t2.lt (t1));
		assert (!t1.le (t2)); assert (!t2.ge (t1));
		assert ( t1.ge (t2)); assert ( t2.le (t1));

		assert (t1.lt (t2) === (t1.getElapsed() <  t2.getElapsed()));
		assert (t2.gt (t1) === (t2.getElapsed() >  t1.getElapsed()));
		assert (t1.gt (t2) === (t1.getElapsed() >  t2.getElapsed()));
		assert (t2.lt (t1) === (t2.getElapsed() <  t1.getElapsed()));
		assert (t1.le (t2) === (t1.getElapsed() <= t2.getElapsed()));
		assert (t2.ge (t1) === (t2.getElapsed() >= t1.getElapsed()));
		assert (t1.ge (t2) === (t1.getElapsed() >= t2.getElapsed()));
		assert (t2.le (t1) === (t2.getElapsed() <= t1.getElapsed()));

		log (sprintf ("%03d", t1.restart()) + " = 400 : ");
		log (sprintf ("%03d", t2.restart()) + " = 200\n" );

		assert (t1.hasStarted());
		assert (t2.hasStarted());

		log (sprintf ("%03d", t1.getElapsed()) + " =   0 : " );
		log (sprintf ("%03d", t2.getElapsed()) + " =   0\n\n");

		assert (!t1.hasExpired (100));
		assert (!t2.hasExpired (100));
		Timer.sleep (200, 400);
		assert ( t1.hasExpired (100));
		assert ( t2.hasExpired (100));

		log (sprintf ("%03d", t1.getElapsed()) + " = (200 - 400) : ");
		log (sprintf ("%03d", t2.getElapsed()) + " = (200 - 400)\n" );

		//----------------------------------------------------------------------------//

		t1.start();
		assert (t1.hasStarted());
		assert (t2.hasStarted());

		assert (!t1.hasExpired (100));
		assert ( t2.hasExpired (100));
		Timer.sleep (200, 400);
		assert ( t1.hasExpired (100));
		assert ( t2.hasExpired (100));

		log (sprintf ("%03d", t1.getElapsed()) + " = (200 - 400) : " );
		log (sprintf ("%03d", t2.getElapsed()) + " = (400 - 800)\n\n");

		assert ( t1.eq (t1)); assert ( t2.eq (t2));
		assert (!t1.ne (t1)); assert (!t2.ne (t2));
		assert (!t1.eq (t2)); assert (!t2.eq (t1));
		assert ( t1.ne (t2)); assert ( t2.ne (t1));

		assert ( t1.lt (t2)); assert ( t2.gt (t1));
		assert (!t1.gt (t2)); assert (!t2.lt (t1));
		assert ( t1.le (t2)); assert ( t2.ge (t1));
		assert (!t1.ge (t2)); assert (!t2.le (t1));

		assert (t1.lt (t2) === (t1.getElapsed() <  t2.getElapsed()));
		assert (t2.gt (t1) === (t2.getElapsed() >  t1.getElapsed()));
		assert (t1.gt (t2) === (t1.getElapsed() >  t2.getElapsed()));
		assert (t2.lt (t1) === (t2.getElapsed() <  t1.getElapsed()));
		assert (t1.le (t2) === (t1.getElapsed() <= t2.getElapsed()));
		assert (t2.ge (t1) === (t2.getElapsed() >= t1.getElapsed()));
		assert (t1.ge (t2) === (t1.getElapsed() >= t2.getElapsed()));
		assert (t2.le (t1) === (t2.getElapsed() <= t1.getElapsed()));

		t1.reset(); assert (!t1.hasStarted());
		t2.reset(); assert (!t2.hasStarted());

		//----------------------------------------------------------------------------//

		assert (t1.hasExpired, t1, [   ]);
		assert (t1.hasExpired, t1, ["a"]);

		assert (t1.lt, t1, [   ]); assert (t1.lt, t1, ["a"]);
		assert (t1.gt, t1, [   ]); assert (t1.gt, t1, ["a"]);
		assert (t1.le, t1, [   ]); assert (t1.le, t1, ["a"]);
		assert (t1.ge, t1, [   ]); assert (t1.ge, t1, ["a"]);
		assert (t1.eq, t1, [   ]); assert (t1.eq, t1, ["a"]);
		assert (t1.ne, t1, [   ]); assert (t1.ne, t1, ["a"]);

		assert (Timer.sleep, t1, ["BadParam"]);
		assert (Timer.sleep, t1, [{ min: 0 }]);

		log (">> Success\n\n"); return true;
	};
};
