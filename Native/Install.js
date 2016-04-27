////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                       (C) 2010-2016 Robot Developers                       //
//                       See LICENSE for licensing info                       //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

"use strict";

//----------------------------------------------------------------------------//
// Install                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

var mFS   = require ("fs"  );
var mHTTP = require ("http");

////////////////////////////////////////////////////////////////////////////////

var SOURCE = "http://node.getrobot.net/addon/1.0.2/" +
	process.platform   + "-" +
	process.arch       + "-" +
	process.versions.modules +
	".node";

var TARGET = "./Library/" +
	process.platform   + "-" +
	process.arch       + "-" +
	process.versions.modules +
	".node";

////////////////////////////////////////////////////////////////////////////////

function failure (reason)
{
	console.error
		("ERROR: robot-js binaries failed to install. " +
		 "You will need to install them manually, see " +
		 "http://getrobot.net/docs/node.html for more " +
		 "info. Reason: " + reason + "\n");
}

////////////////////////////////////////////////////////////////////////////////

// Attempt to download binary
var req = mHTTP.get (SOURCE);

// Whenever a response is received
req.on ("response", function (res)
{
	// Check if response is OK
	if (res.statusCode === 200)
	{
		// Open a writable stream to binary file
		var file = mFS.createWriteStream (TARGET);

		// Save response
		res.pipe (file);

		// Whenever an error is thrown
		file.on ("error", function (err)
		{
			mFS.unlink (TARGET);
			failure (err.message);
		});
	}

	// Some unexpected response
	else failure ("bad response" +
		" (" + res.statusCode +
		") " + res.statusMessage);
});

// Whenever an error is thrown
req.on ("error", function (err)
{
	failure (err.message);
});
