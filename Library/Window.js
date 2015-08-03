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
	// Constructor                                                         Window //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Window (handle)
	{
		// Auto instantiate the Window
		if (!(this instanceof Window))
			return new Window (handle);

		this._handle = 0;
		this._window = null;

		if (handle !== null)
		{
			// Current constructor is unmanaged
			this._window = new native.Window();

			// Set the window handle
			if (handle !== undefined)
				this.setHandle (handle);
		}
	}



	//----------------------------------------------------------------------------//
	// Functions                                                           Window //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.isValid = function()
	{
		return this._window.isValid();
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.close = function()
	{
		this._window.close();
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.isTopMost = function()
	{
		return this._window.isTopMost();
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.isBorderless = function()
	{
		return this._window.isBorderless();
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.isMinimized = function()
	{
		return this._window.isMinimized();
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.isMaximized = function()
	{
		return this._window.isMaximized();
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.setTopMost = function (state)
	{
		// Verify that state is valid
		if (typeof state !== "boolean")
			throw new TypeError ("Invalid arguments");

		this._window.setTopMost (state);
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.setBorderless = function (state)
	{
		// Verify that state is valid
		if (typeof state !== "boolean")
			throw new TypeError ("Invalid arguments");

		this._window.setBorderless (state);
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.setMinimized = function (state)
	{
		// Verify that state is valid
		if (typeof state !== "boolean")
			throw new TypeError ("Invalid arguments");

		this._window.setMinimized (state);
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.setMaximized = function (state)
	{
		// Verify that state is valid
		if (typeof state !== "boolean")
			throw new TypeError ("Invalid arguments");

		this._window.setMaximized (state);
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.getProcess = function()
	{
		var result =
			// Get the current process
			this._window.getProcess();

		// Create new managed process
		var process = robot.Process (null);

		// Set the cached process data
		process._procID  = result.procID;
		process._name    = result.name;
		process._path    = result.path;
		process._is64Bit = result.is64Bit;
		process._process = result.process;
		return process;
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.getPID = function()
	{
		return this._window.getPID();
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.getHandle = function()
	{
		return this._handle;
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.setHandle = function (handle)
	{
		// Verify that handle is valid
		if (typeof handle !== "number")
			throw new TypeError ("Invalid arguments");

		var result =
			// Perform a native set handle
			this._window.setHandle (handle);

		// Update cached window data
		this._handle = result.handle;
		return result.status;
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.getTitle = function()
	{
		return this._window.getTitle();
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.setTitle = function (title)
	{
		// Verify that title is valid
		if (title !== undefined &&
			typeof title !== "string")
			throw new TypeError ("Invalid arguments");

		this._window.setTitle (title);
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.getBounds = function()
	{
		return robot.Bounds
			(this._window.getBounds());
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.setBounds = function (ax, ay, aw, ah)
	{
		var b = robot
			 .Bounds.normalize ( ax,  ay,  aw,  ah);
		this._window.setBounds (b.x, b.y, b.w, b.h);
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.getClient = function()
	{
		return robot.Bounds
			(this._window.getClient());
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.setClient = function (ax, ay, aw, ah)
	{
		var b = robot
			 .Bounds.normalize ( ax,  ay,  aw,  ah);
		this._window.setClient (b.x, b.y, b.w, b.h);
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.mapToClient = function (ax, ay)
	{
		var p = robot.Point.normalize ( ax,  ay);
		return robot.Point
			(this._window.mapToClient (p.x, p.y));
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.mapToScreen = function (ax, ay)
	{
		var p = robot.Point.normalize ( ax,  ay);
		return robot.Point
			(this._window.mapToScreen (p.x, p.y));
	};



	//----------------------------------------------------------------------------//
	// Static                                                              Window //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Window.getList = function (title)
	{
		// Verify that title is valid
		if (title !== undefined &&
			typeof title !== "string")
			throw new TypeError ("Invalid arguments");

		// Retrieve the list of all system windows
		var results = native.Window.getList (title);

		var list = new Array (results.length);
		// Iterate through the list of windows
		for (var i = 0; i < results.length; ++i)
		{
			// Create new managed window
			var window = Window (null);

			// Set the cached window data
			window._handle = results[i].handle;
			window._window = results[i].window;
			list[i] = window;
		}

		return list;
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.getActive = function()
	{
		var result =
			// Get the active window
			native.Window.getActive();

		// Create new managed window
		var window = Window (null);

		// Set the cached window data
		window._handle = result.handle;
		window._window = result.window;
		return window;
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.setActive = function (window)
	{
		// Verify that window is valid
		if (!(window instanceof Window))
			throw new TypeError ("Invalid arguments");

		native.Window.setActive (window._window);
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.isAxEnabled = function (options)
	{
		// Verify that options is valid
		if (options !== undefined &&
			typeof options !== "boolean")
			throw new TypeError ("Invalid arguments");

		return native.Window.isAxEnabled (options);
	};



	//----------------------------------------------------------------------------//
	// Operators                                                           Window //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.eq = function (value)
	{
		// Check for another window
		if (value instanceof Window)
			return this._handle === value._handle;

		// Check win handle comparison
		if (typeof value === "number")
			return this._handle === value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Window.prototype.ne = function (value)
	{
		// Check for another window
		if (value instanceof Window)
			return this._handle !== value._handle;

		// Check win handle comparison
		if (typeof value === "number")
			return this._handle !== value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	return Window;
};
