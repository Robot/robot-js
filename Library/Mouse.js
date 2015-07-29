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

module.exports = function (robot, native)
{
	//----------------------------------------------------------------------------//
	// Constants                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	robot.BUTTON_LEFT		= 0;
	robot.BUTTON_MID		= 1;
	robot.BUTTON_MIDDLE		= 1;
	robot.BUTTON_RIGHT		= 2;
	robot.BUTTON_X1			= 3;
	robot.BUTTON_X2			= 4;



	//----------------------------------------------------------------------------//
	// Constructor                                                          Mouse //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Mouse()
	{
		// Auto instantiate the Mouse
		if (!(this instanceof Mouse))
			return new Mouse();

		// Setup the initial auto delay range
		this.autoDelay = robot.Range (40, 90);
		this._mouse    = new native.Mouse();
	}



	//----------------------------------------------------------------------------//
	// Functions                                                            Mouse //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Mouse.prototype.click = function (button)
	{
		// Verify that button is valid
		if (typeof button !== "number")
			throw new TypeError ("Invalid arguments");

		this._mouse.click (button,
			   this.autoDelay.min,
			   this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	Mouse.prototype.press = function (button)
	{
		// Verify that button is valid
		if (typeof button !== "number")
			throw new TypeError ("Invalid arguments");

		this._mouse.press (button,
			   this.autoDelay.min,
			   this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	Mouse.prototype.release = function (button)
	{
		// Verify that button is valid
		if (typeof button !== "number")
			throw new TypeError ("Invalid arguments");

		this._mouse.release (button,
				 this.autoDelay.min,
				 this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	Mouse.prototype.scrollH = function (amount)
	{
		// Verify that amount is valid
		if (typeof amount !== "number")
			throw new TypeError ("Invalid arguments");

		this._mouse.scrollH (amount,
				 this.autoDelay.min,
				 this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	Mouse.prototype.scrollV = function (amount)
	{
		// Verify that amount is valid
		if (typeof amount !== "number")
			throw new TypeError ("Invalid arguments");

		this._mouse.scrollV (amount,
				 this.autoDelay.min,
				 this.autoDelay.max);
	};



	//----------------------------------------------------------------------------//
	// Static                                                               Mouse //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Mouse.getPos = function()
	{
		return robot.Point
			// Safe to return point
			(native.Mouse.getPos());
	};

	////////////////////////////////////////////////////////////////////////////////

	Mouse.setPos = function (ax, ay)
	{
		var p = robot.
			Point.normalize ( ax,  ay);
		native.Mouse.setPos (p.x, p.y);
	};

	////////////////////////////////////////////////////////////////////////////////

	Mouse.getState = function (button)
	{
		// Verify that button is valid
		if (button !== undefined &&
			typeof button !== "number")
			throw new TypeError ("Invalid arguments");

		return native.Mouse.getState (button);
	};

	////////////////////////////////////////////////////////////////////////////////

	return Mouse;
};
