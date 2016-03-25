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
// Modules                                                                    //
//----------------------------------------------------------------------------//

var mNative = require ("./Robot-" +
	process.platform   + "-" +
	process.arch       + "-" +
	process.versions.modules);



//----------------------------------------------------------------------------//
// Library                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

var mRobot =
{
	ADDON_VERSION		: 0x010000,
	ADDON_VERSION_STR	: "1.0.0"
};

mRobot.Hash				= require ("./Hash"		)(mRobot);
mRobot.Color			= require ("./Color"	)(mRobot);
mRobot.Range			= require ("./Range"	)(mRobot);
mRobot.Point			= require ("./Point"	)(mRobot);
mRobot.Size				= require ("./Size"		)(mRobot);
mRobot.Bounds			= require ("./Bounds"	)(mRobot);

mRobot.Image			= require ("./Image"	)(mRobot, mNative);
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
// ToString                                                                   //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

mRobot.Hash.prototype.toString = function()
{
	return "0x" +
		this.result.toString
		(16).toUpperCase( );
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Color.prototype.toString = function()
{
	return "["
		+ this.r + ", "
		+ this.g + ", "
		+ this.b + ", "
		+ this.a + "]";
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Image.prototype.toString = function()
{
	return "["
		+ this.getWidth () + "x"
		+ this.getHeight() + " - "
		+ this.getLength() + "/"
		+ this.getLimit () + "]";
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Range.prototype.toString = function()
{
	return "["
		+ this.min + ", "
		+ this.max + ")";
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Point.prototype.toString = function()
{
	return "["
		+ this.x + ", "
		+ this.y + "]";
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Size.prototype.toString = function()
{
	return "["
		+ this.w + ", "
		+ this.h + "]";
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Bounds.prototype.toString = function()
{
	return "["
		+ this.x + ", "
		+ this.y + ", "
		+ this.w + ", "
		+ this.h + "]";
};



//----------------------------------------------------------------------------//
// Compare                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

mRobot.Timer.compare = function (a, b)
{
	if (a.lt (b)) return -1;
	if (a.gt (b)) return  1;
	return 0;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Module.compare = function (a, b)
{
	if (a.lt (b)) return -1;
	if (a.gt (b)) return  1;
	return 0;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Module.Segment.compare = function (a, b)
{
	if (a.lt (b)) return -1;
	if (a.gt (b)) return  1;
	return 0;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Memory.Region.compare = function (a, b)
{
	if (a.lt (b)) return -1;
	if (a.gt (b)) return  1;
	return 0;
};



//----------------------------------------------------------------------------//
// Exports                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

mNative.prepare  (mRobot);
 module.exports = mRobot;
