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
	// Functions                                                           Window //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Window.prototype.setBounds = function (ax, ay, aw, ah)
	{
		var b = robot.Bounds
			 .normalize ( ax,  ay,  aw,  ah);
		this._setBounds (b.x, b.y, b.w, b.h);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Window.prototype.setClient = function (ax, ay, aw, ah)
	{
		var b = robot.Bounds
			 .normalize ( ax,  ay,  aw,  ah);
		this._setClient (b.x, b.y, b.w, b.h);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Window.prototype.mapToClient = function (ax, ay)
	{
		var p =
			robot.Point.normalize( ax,  ay);
		return this._mapToClient (p.x, p.y);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Window.prototype.mapToScreen = function (ax, ay)
	{
		var p =
			robot.Point.normalize( ax,  ay);
		return this._mapToScreen (p.x, p.y);
	};



	//----------------------------------------------------------------------------//
	// Static                                                              Window //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Window.setActive = function (window)
	{
		// Check if window is a native window
		if (!(window instanceof native.Window))
			throw new TypeError ("Invalid arguments");

		this._setActive (window);
	};



	//----------------------------------------------------------------------------//
	// Operators                                                           Window //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Window.prototype.eq = function (value)
	{
		// Check if arg is of valid type
		if (typeof value === "number" ||
			value instanceof native.Window)
			return  this._equals (value);

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Window.prototype.ne = function (value)
	{
		// Check if arg is of valid type
		if (typeof value === "number" ||
			value instanceof native.Window)
			return !this._equals (value);

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	return native.Window;
};
