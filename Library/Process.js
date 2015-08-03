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
	// Locals                                                                     //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	var mIs64 = null;



	//----------------------------------------------------------------------------//
	// Constructor                                                        Process //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Process (pid)
	{
		// Auto instantiate the Process
		if (!(this instanceof Process))
			return new Process (pid);

		this._procID  = 0;
		this._name    = "";
		this._path    = "";
		this._is64Bit = false;
		this._process = null;

		if (pid !== null)
		{
			// Current constructor is unmanaged
			this._process = new native.Process();

			// Check whether open should be called
			if (pid !== undefined) this.open (pid);
		}
	}



	//----------------------------------------------------------------------------//
	// Functions                                                          Process //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.open = function (pid)
	{
		// Verify that pid is valid
		if (typeof pid !== "number")
			throw new TypeError ("Invalid arguments");

		var result =
			// Perform a native open
			this._process.open (pid);

		// Update cached process data
		this._procID  = result.procID;
		this._name    = result.name;
		this._path    = result.path;
		this._is64Bit = result.is64Bit;

		// Return the result
		return result.status;
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.close = function()
	{
		// Close the process
		this._process.close();

		// Reset cached data
		this._procID  = 0;
		this._name    = "";
		this._path    = "";
		this._is64Bit = false;
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.isValid = function()
	{
		return this._process.isValid();
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.is64Bit = function()
	{
		return this._is64Bit;
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.isDebugged = function()
	{
		return this._process.isDebugged();
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.getPID = function()
	{
		return this._procID;
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.getMemory = function()
	{
		// NYI: Not Yet Implemented
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.getName = function()
	{
		return this._name;
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.getPath = function()
	{
		return this._path;
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.exit = function()
	{
		this._process.exit();
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.kill = function()
	{
		this._process.kill();
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.hasExited = function()
	{
		return this._process.hasExited();
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.getModules = function (name)
	{
		// NYI: Not Yet Implemented
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.getWindows = function (title)
	{
		// Verify that title is valid
		if (title !== undefined &&
			typeof title !== "string")
			throw new TypeError ("Invalid arguments");

		// Retrieve the list of all process windows
		var results = this._process.getWindows (title);

		var list = new Array (results.length);
		// Iterate through the list of windows
		for (var i = 0; i < results.length; ++i)
		{
			// Create a new managed window
			var window = robot.Window (null);

			// Set the cached window data
			window._handle = results[i].handle;
			window._window = results[i].window;
			list[i] = window;
		}

		return list;
	};



	//----------------------------------------------------------------------------//
	// Static                                                             Process //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Process.getList = function (name)
	{
		// Verify that name is valid
		if (name !== undefined &&
			typeof name !== "string")
			throw new TypeError ("Invalid arguments");

		// Retrieve the list of all system processes
		var results = native.Process.getList (name);

		var list = new Array (results.length);
		// Iterate through the list of processes
		for (var i = 0; i < results.length; ++i)
		{
			// Create new managed process
			var process = Process (null);

			// Set the cached process data
			process._procID  = results[i].procID;
			process._name    = results[i].name;
			process._path    = results[i].path;
			process._is64Bit = results[i].is64Bit;
			process._process = results[i].process;
			list[i] = process;
		}

		return list;
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.getCurrent = function()
	{
		var result =
			// Get the current process
			native.Process.getCurrent();

		// Create new managed process
		var process = Process (null);

		// Set the cached process data
		process._procID  = result.procID;
		process._name    = result.name;
		process._path    = result.path;
		process._is64Bit = result.is64Bit;
		process._process = result.process;
		return process;
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.isSys64Bit = function()
	{
		return (mIs64 !== null) ? mIs64 :
			// Set value once then cache result
			(mIs64 = native.Process.isSys64Bit());
	};



	//----------------------------------------------------------------------------//
	// Operators                                                          Process //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.eq = function (value)
	{
		// Check for another process
		if (value instanceof Process)
			return this._procID === value._procID;

		// Check process ID comparison
		if (typeof value === "number")
			return this._procID === value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Process.prototype.ne = function (value)
	{
		// Check for another process
		if (value instanceof Process)
			return this._procID !== value._procID;

		// Check process ID comparison
		if (typeof value === "number")
			return this._procID !== value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	return Process;
};
