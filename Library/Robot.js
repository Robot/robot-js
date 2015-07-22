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
// Modules                                                                    //
//----------------------------------------------------------------------------//

var mNative = null;
// Check if the platform is Linux
if (process.platform === "linux")
{
	if (process.arch === "x64")
		mNative = require ("./Robot-L64");

	if (process.arch === "ia32")
		mNative = require ("./Robot-L32");
}

// Check if the platform is Mac
if (process.platform === "darwin")
{
	if (process.arch === "x64")
		mNative = require ("./Robot-M64");
}

// Check if the platform is Win
if (process.platform === "win32")
{
	if (process.arch === "x64")
		mNative = require ("./Robot-W64");

	if (process.arch === "ia32")
		mNative = require ("./Robot-W32");
}

if (mNative === null)
	// No compatible platform binary was found
	throw new Error ("Platform not supported");



//----------------------------------------------------------------------------//
// Library                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

var mRobot =
{
	ADDON_VERSION		: 0x000000,
	ROBOT_VERSION		: 0x000000,
	ADDON_VERSION_STR	: "0.0.0",
	ROBOT_VERSION_STR	: "0.0.0"
};

mRobot.Hash				= require ("./Hash"		)(mRobot);
mRobot.Color			= require ("./Color"	)(mRobot);
mRobot.Image			= require ("./Image"	)(mRobot);
mRobot.Range			= require ("./Range"	)(mRobot);
mRobot.Point			= require ("./Point"	)(mRobot);
mRobot.Size				= require ("./Size"		)(mRobot);
mRobot.Bounds			= require ("./Bounds"	)(mRobot);

mRobot.Keyboard			= require ("./Keyboard"	)(mRobot, mNative);
mRobot.Mouse			= require ("./Mouse"	)(mRobot, mNative);
mRobot.Process			= require ("./Process"	)(mRobot, mNative);
mRobot.Module			= require ("./Module"	)(mRobot, mNative);
mRobot.Memory			= require ("./Memory"	)(mRobot, mNative);
mRobot.Window			= require ("./Window"	)(mRobot, mNative);
mRobot.Screen			= require ("./Screen"	)(mRobot, mNative);
mRobot.Timer			= require ("./Timer"	)(mRobot, mNative);
mRobot.Clipboard		= require ("./Clipboard")(mRobot, mNative);



//----------------------------------------------------------------------------//
// Exports                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

module.exports = mRobot;
