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
	// Functions                                                         Keyboard //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Keyboard.prototype.click = function (keycode)
	{
		// AutoDelay should always be a range object
		if (!(this.autoDelay instanceof robot.Range))
			throw new TypeError ("Invalid properties");

		return this._click (keycode,
				 this.autoDelay.min,
				 this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Keyboard.prototype.press = function (keycode)
	{
		// AutoDelay should always be a range object
		if (!(this.autoDelay instanceof robot.Range))
			throw new TypeError ("Invalid properties");

		this._press (keycode,
			this.autoDelay.min,
			this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Keyboard.prototype.release = function (keycode)
	{
		// AutoDelay should always be a range object
		if (!(this.autoDelay instanceof robot.Range))
			throw new TypeError ("Invalid properties");

		this._release (keycode,
			this.autoDelay.min,
			this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	return native.Keyboard;
};
