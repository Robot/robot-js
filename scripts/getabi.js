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
// Requires                                                                   //
//----------------------------------------------------------------------------//

var mFS   = require ("fs"  );
var mPath = require ("path");



//----------------------------------------------------------------------------//
// Main                                                                       //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////
/// Discovers the Node ABI version by peeking into the node_version header file
/// Expects the header include path as an argument and works with Node and IOjs

var paths =
[
	mPath.join (process.argv[2], "include", "node", "node_version.h"),
	mPath.join (process.argv[2], "src",             "node_version.h")
];

var contents = null;
// Iterate through all possible paths
for (var i = 0; i < paths.length; ++i)
{
	try
	{
		// Read the contents of the header file
		contents = mFS.readFileSync (paths[i]);
		break;

	} catch (e) { }
}

// Verify read
if (!contents)
{
	console.error ("Unable to find node_version.h");
	process.exitCode = 1;
}

else
{
	console.info (contents.toString().match
		(/\s+NODE_MODULE_VERSION\s+(\d+)/)[1]);
}
