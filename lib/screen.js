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

module.exports = function (robot, native)
{
	//----------------------------------------------------------------------------//
	// Constructor                                                         Screen //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Screen (bounds, usable)
	{
		// Auto instantiate the Screen
		if (!(this instanceof Screen))
			return new Screen (bounds, usable);

		// Check if using defaults
		if (bounds === undefined &&
			usable === undefined)
		{
			this._bounds = robot.Bounds();
			this._usable = robot.Bounds();
			return;
		}

		// Check if assigning bounds values
		if (bounds instanceof robot.Bounds &&
			usable instanceof robot.Bounds)
		{
			this._bounds = bounds;
			this._usable = usable;
			return;
		}

		throw new TypeError ("Invalid arguments");
	}



	//----------------------------------------------------------------------------//
	// Functions                                                           Screen //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Screen.prototype.getBounds   = function() { return this._bounds;                     };
	Screen.prototype.getUsable   = function() { return this._usable;                     };
	Screen.prototype.isPortrait  = function() { return this._bounds.w <  this._bounds.h; };
	Screen.prototype.isLandscape = function() { return this._bounds.w >= this._bounds.h; };



	//----------------------------------------------------------------------------//
	// Static                                                              Screen //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Screen._screens = [ ];
	Screen._totalBounds = robot.Bounds();
	Screen._totalUsable = robot.Bounds();

	////////////////////////////////////////////////////////////////////////////////

	Screen.synchronize = function()
	{
		// Perform native screen synchronization
		var result = native.Screen.synchronize();

		this._screens     = result.screens;
		this._totalBounds = result.totalBounds;
		this._totalUsable = result.totalUsable;

		// Convert screen objects into screen classes
		for (var i = 0; i < this._screens.length; ++i)
		{
			this._screens[i] = Screen
				(this._screens[i].bounds,
				 this._screens[i].usable);
		}

		return result.status;
	};

	////////////////////////////////////////////////////////////////////////////////

	Screen.getMain = function()
	{
		// The primary screen is always the first screen object
		return this._screens.length ? this._screens[0] : null;
	};

	////////////////////////////////////////////////////////////////////////////////

	Screen.getList = function() { return this._screens; };

	////////////////////////////////////////////////////////////////////////////////

	Screen.getScreen = function (ax, ay)
	{
		var p;
		// Check if instance of window
		if (ax instanceof robot.Window)
		{
			if (!ax.isValid()) return null;
			p = ax.getBounds().getCenter();
		}

		// Attempt to parse as a regular point
		else p = robot.Point.normalize (ax, ay);

		// Loop through every available screen object
		for (var i = 0; i < this._screens.length; ++i)
		{
			if (this._screens[i]._bounds.containsP
				(p.x, p.y)) return this._screens[i];
		}

		// The primary screen is always the first screen object
		return this._screens.length ? this._screens[0] : null;
	};

	////////////////////////////////////////////////////////////////////////////////

	Screen.grabScreen = function (image, ax, ay, aw, ah, window)
	{
		// Check if argument is native image
		if (!(image instanceof robot.Image))
			throw new TypeError ("Invalid arguments");

		var b = robot.Bounds.
			normalize (ax, ay, aw, ah);

		// Perform native image capture
		return native.Screen.grabScreen
			(image, b.x, b.y, b.w, b.h,
			 arguments[arguments.length - 1]);
	};

	////////////////////////////////////////////////////////////////////////////////

	Screen.getTotalBounds = function() { return this._totalBounds; };
	Screen.getTotalUsable = function() { return this._totalUsable; };

	////////////////////////////////////////////////////////////////////////////////

	Screen. isCompositing = native.Screen. isCompositing;
	Screen.setCompositing = native.Screen.setCompositing;

	////////////////////////////////////////////////////////////////////////////////

	return Screen;
};
