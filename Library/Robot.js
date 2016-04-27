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

var mNative = require  ("./" +
	process.platform   + "-" +
	process.arch       + "-" +
	process.versions.modules);



//----------------------------------------------------------------------------//
// Library                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

var mRobot =
{
	ADDON_VERSION		: 0x010002,
	ADDON_VERSION_STR	: "1.0.2"
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
// Clone                                                                      //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

mRobot.Hash.prototype.clone = function()
{
	var copy = new mRobot.Hash();
	copy.result = this.result;
	return copy;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Color.prototype.clone = function()
{
	return new mRobot.Color (this);
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Image.prototype.clone = function()
{
	return new mRobot.Image (this);
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Range.prototype.clone = function()
{
	return new mRobot.Range (this);
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Point.prototype.clone = function()
{
	return new mRobot.Point (this);
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Size.prototype.clone = function()
{
	return new mRobot.Size (this);
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Bounds.prototype.clone = function()
{
	return new mRobot.Bounds (this);
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Keyboard.prototype.clone = function()
{
	var copy = new mRobot.Keyboard();
	copy.autoDelay.min = this.autoDelay.min;
	copy.autoDelay.max = this.autoDelay.max;
	return copy;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Mouse.prototype.clone = function()
{
	var copy = new mRobot.Mouse();
	copy.autoDelay.min = this.autoDelay.min;
	copy.autoDelay.max = this.autoDelay.max;
	return copy;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Process.prototype.clone = function()
{
	return new mRobot.Process (this.getPID());
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Module.prototype.clone = function()
{
	var copy = new mRobot.Module
		(this._proc, this._name,
		 this._path, this._base,
		 this._size);

	// Check if segments present
	if (this._segments !== null)
	{
		copy._segments = [ ];
		this._segments.map (function (s)
		{
			// Clone every segment in array
			copy._segments.push (s.clone());
		});
	}

	return copy;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Module.Segment.prototype.clone = function()
{
	var copy = new mRobot.Module.Segment();
	copy.valid = this.valid;
	copy.base  = this.base;
	copy.size  = this.size;
	copy.name  = this.name;
	return copy;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Memory.prototype.clone = function()
{
	return new mRobot.Memory (this.getProcess());
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Memory.Stats.prototype.clone = function()
{
	var copy = new mRobot.Memory.Stats();

	copy.systemReads  = this.systemReads;
	copy.cachedReads  = this.cachedReads;
	copy.systemWrites = this.systemWrites;
	copy.accessWrites = this.accessWrites;

	copy. readErrors  = this. readErrors;
	copy.writeErrors  = this.writeErrors;

	return copy;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Memory.Region.prototype.clone = function()
{
	var copy = new mRobot.Memory.Region();

	copy.valid      = this.valid;
	copy.bound      = this.bound;

	copy.start      = this.start;
	copy.stop       = this.stop;
	copy.size       = this.size;

	copy.readable   = this.readable;
	copy.writable   = this.writable;
	copy.executable = this.executable;
	copy.access     = this.access;

	copy.private    = this.private;
	copy.guarded    = this.guarded;

	return copy;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Window.prototype.clone = function()
{
	return new mRobot.Window (this.getHandle());
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Screen.prototype.clone = function()
{
	var copy = new mRobot.Screen();
	copy._bounds = this._bounds.clone();
	copy._usable = this._usable.clone();
	return copy;
};

////////////////////////////////////////////////////////////////////////////////

mRobot.Timer.prototype.clone = function()
{
	var copy = new mRobot.Timer();
	copy._started = this._started;
	return copy;
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
