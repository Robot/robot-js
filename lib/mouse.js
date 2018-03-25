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
	// Functions                                                            Mouse //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Mouse.prototype.click = function (button)
	{
		// AutoDelay should always be a range object
		if (!(this.autoDelay instanceof robot.Range))
			throw new TypeError ("Invalid properties");

		this._click (button,
			this.autoDelay.min,
			this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Mouse.prototype.press = function (button)
	{
		// AutoDelay should always be a range object
		if (!(this.autoDelay instanceof robot.Range))
			throw new TypeError ("Invalid properties");

		this._press (button,
			this.autoDelay.min,
			this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Mouse.prototype.release = function (button)
	{
		// AutoDelay should always be a range object
		if (!(this.autoDelay instanceof robot.Range))
			throw new TypeError ("Invalid properties");

		this._release (button,
			this.autoDelay.min,
			this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Mouse.prototype.scrollH = function (amount)
	{
		// AutoDelay should always be a range object
		if (!(this.autoDelay instanceof robot.Range))
			throw new TypeError ("Invalid properties");

		this._scrollH (amount,
			this.autoDelay.min,
			this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Mouse.prototype.scrollV = function (amount)
	{
		// AutoDelay should always be a range object
		if (!(this.autoDelay instanceof robot.Range))
			throw new TypeError ("Invalid properties");

		this._scrollV (amount,
			this.autoDelay.min,
			this.autoDelay.max);
	};



	//----------------------------------------------------------------------------//
	// Static                                                               Mouse //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Mouse.setPos = function (ax, ay)
	{
		var p = robot.Point.
			normalize( ax,  ay);
		this._setPos (p.x, p.y);
	};

	////////////////////////////////////////////////////////////////////////////////

	return native.Mouse;
};
