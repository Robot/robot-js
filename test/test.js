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
// Modules                                                                    //
//----------------------------------------------------------------------------//

var mRobot   = require ("..");
var mFS      = require ("fs");
var mSprintf = require ("sprintf-js").sprintf;
var mReadLn  = require ("readline-sync");

////////////////////////////////////////////////////////////////////////////////

function log (msg)
{
	process.stdout.write (msg);
}

////////////////////////////////////////////////////////////////////////////////

function getline()
{
	return mReadLn.question ("").trim();
}

////////////////////////////////////////////////////////////////////////////////

function assert (cond, thisArg, args)
{
	// Check for argument test
	if (arguments.length === 3)
	{
		try {
			cond.apply (thisArg, args);
			cond = false;
		} catch (e) { }
	}

	if (!cond) throw new Error
		("Assertion Failed\x07\n");
}

////////////////////////////////////////////////////////////////////////////////

var testTypes     = require ("./types"    )(mRobot, log, mSprintf, getline, assert);
var testTimer     = require ("./timer"    )(mRobot, log, mSprintf, getline, assert);
var testKeyboard  = require ("./keyboard" )(mRobot, log, mSprintf, getline, assert);
var testMouse     = require ("./mouse"    )(mRobot, log, mSprintf, getline, assert);
var testProcess   = require ("./process"  )(mRobot, log, mSprintf, getline, assert);
var testWindow    = require ("./window"   )(mRobot, log, mSprintf, getline, assert);
var testMemory    = require ("./memory"   )(mRobot, log, mSprintf, getline, assert);
var testScreen    = require ("./screen"   )(mRobot, log, mSprintf, getline, assert);
var testClipboard = require ("./clipboard")(mRobot, log, mSprintf, getline, assert);



//----------------------------------------------------------------------------//
// Main                                                                       //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

function main (argc, argv)
{
	log ("\nROBOT TESTING SUITE\n");

	var ver = mRobot.ADDON_VERSION_STR;
	if (process.platform === "linux")
	{
		if (process.arch === "ia32")
			log ("ver " + ver + " x32 - LINUX");

		if (process.arch === "x64")
			log ("ver " + ver + " x64 - LINUX");
	}

	// Check if the platform is Mac
	if (process.platform === "darwin")
	{
		if (process.arch === "ia32")
			log ("ver " + ver + " x32 - MAC");

		if (process.arch === "x64")
			log ("ver " + ver + " x64 - MAC");
	}

	// Check if the platform is Win
	if (process.platform === "win32")
	{
		if (process.arch === "ia32")
			log ("ver " + ver + " x32 - WIN");

		if (process.arch === "x64")
			log ("ver " + ver + " x64 - WIN");
	}

	log (mRobot.Process.isSys64Bit() ? " 64\n" : " 32\n");

	log ("------------------------------\n"  );
	log ("(C) 2010-2018 Robot Developers\n\n");

	// Check args
	if (argc < 3)
	{
		log ("This program is designed  to test the Robot library for\n");
		log ("compliance and compatibility on the target platform. It\n");
		log ("does this by running a series of test  cases on various\n");
		log ("components of the  library; if an error is detected all\n");
		log ("subsequent tests are cancelled. In order to get started\n");
		log ("please select the tests you wish to run via the command\n");
		log ("line. Possible tests  include: types, timer,  keyboard,\n");
		log ("mouse,  process, window,  memory, screen and clipboard.\n");
		log ("Multiple tests can be run at the same time.\n\n"          );

		// All tests have concluded
		log ("Press enter to exit\n");
		getline();
		return 1;
	}

	var _types     = false;
	var _timer     = false;
	var _keyboard  = false;
	var _mouse     = false;
	var _process   = false;
	var _window    = false;
	var _memory    = false;
	var _screen    = false;
	var _clipboard = false;

	// Determine which tests to run
	for (var i = 2; i < argc; ++i)
	{
		// Check all keyword
		if (argv[i] === "all")
		{
			_types     = true;
			_timer     = true;
			_keyboard  = true;
			_mouse     = true;
			_process   = true;
			_window    = true;
			_memory    = true;
			_screen    = true;
			_clipboard = true;
			break;
		}

		if (argv[i] === "types"    ) _types     = true; else
		if (argv[i] === "timer"    ) _timer     = true; else
		if (argv[i] === "keyboard" ) _keyboard  = true; else
		if (argv[i] === "mouse"    ) _mouse     = true; else
		if (argv[i] === "process"  ) _process   = true; else
		if (argv[i] === "window"   ) _window    = true; else
		if (argv[i] === "memory"   ) _memory    = true; else
		if (argv[i] === "screen"   ) _screen    = true; else
		if (argv[i] === "clipboard") _clipboard = true;
	}

	var res = 2;
	while (res)
	{
		if (_types     && !testTypes    ()) break;
		if (_timer     && !testTimer    ()) break;
		if (_keyboard  && !testKeyboard ()) break;
		if (_mouse     && !testMouse    ()) break;
		if (_process   && !testProcess  ()) break;
		if (_window    && !testWindow   ()) break;
		if (_memory    && !testMemory   ()) break;
		if (_screen    && !testScreen   ()) break;
		if (_clipboard && !testClipboard()) break;
		res = 0;
	}

	return res;
}

process.exitCode =
	// Call the main function to begin tests
	main (process.argv.length, process.argv);
