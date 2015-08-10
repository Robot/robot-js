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
	// Functions                                                          Process //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Process.prototype.is64Bit = function() { return this._is64Bit; };
	native.Process.prototype.getPID  = function() { return this._procID;  };
	native.Process.prototype.getName = function() { return this._name;    };
	native.Process.prototype.getPath = function() { return this._path;    };



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
		// Check for another native process
		if (value instanceof native.Process)
			return this._procID === value._procID;

		// Check process ID comparison
		if (typeof value === "number")
			return this._procID === value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Process.prototype.ne = function (value)
	{
		// Check for another native process
		if (value instanceof native.Process)
			return this._procID !== value._procID;

		// Check process ID comparison
		if (typeof value === "number")
			return this._procID !== value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	return native.Process;
};
