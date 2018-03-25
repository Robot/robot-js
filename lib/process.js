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
	// Static                                                             Process //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Process.isSys64Bit = function()
	{
		// Perform native call only once
		if (this._isSys64 === undefined)
			this._isSys64 = this._isSys64Bit();

		return this._isSys64;
	};



	//----------------------------------------------------------------------------//
	// Operators                                                          Process //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Process.prototype.eq = function (value)
	{
		// Check if arg is of valid type
		if (typeof value === "number" ||
			value instanceof native.Process)
			return  this._equals (value);

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Process.prototype.ne = function (value)
	{
		// Check if arg is of valid type
		if (typeof value === "number" ||
			value instanceof native.Process)
			return !this._equals (value);

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	return native.Process;
};
