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
	// Segment                                                             Module //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Segment()
	{
		// Auto instantiate the Segment
		if (!(this instanceof Segment))
			return new Segment();

		this.valid = false;
		this.base  = 0;
		this.size  = 0;
		this.name  = "";
	}

	////////////////////////////////////////////////////////////////////////////////

	Segment.prototype.contains = function (value)
	{
		// Check for number comparison
		if (typeof value === "number")
		{
			var base = this.base;
			var stop = this.base +
					   this.size;

			return base <= value &&
				   stop >  value;
		}

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Segment.prototype.lt = function (value)
	{
		// Check for another segment
		if (value instanceof Segment)
			return this.base < value.base;

		// Check for number comparison
		if (typeof value === "number")
			return this.base < value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Segment.prototype.gt = function (value)
	{
		// Check for another segment
		if (value instanceof Segment)
			return this.base > value.base;

		// Check for number comparison
		if (typeof value === "number")
			return this.base > value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Segment.prototype.le = function (value)
	{
		// Check for another segment
		if (value instanceof Segment)
			return this.base <= value.base;

		// Check for number comparison
		if (typeof value === "number")
			return this.base <= value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Segment.prototype.ge = function (value)
	{
		// Check for another segment
		if (value instanceof Segment)
			return this.base >= value.base;

		// Check for number comparison
		if (typeof value === "number")
			return this.base >= value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Segment.prototype.eq = function (segment)
	{
		// Verify that segment is valid
		if (!(segment instanceof Segment))
			throw new TypeError ("Invalid arguments");

		return this.valid === segment.valid
			&& this.base  === segment.base
			&& this.size  === segment.size
			&& this.name  === segment.name;
	};

	////////////////////////////////////////////////////////////////////////////////

	Segment.prototype.ne = function (segment)
	{
		// Verify that segment is valid
		if (!(segment instanceof Segment))
			throw new TypeError ("Invalid arguments");

		return this.valid !== segment.valid
			|| this.base  !== segment.base
			|| this.size  !== segment.size
			|| this.name  !== segment.name;
	};



	//----------------------------------------------------------------------------//
	// Constructor                                                         Module //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Module (process, name, path, base, size)
	{
		// Auto instantiate the Module
		if (!(this instanceof Module))
		{
			return new Module (process,
				name, path, base, size);
		}

		// Check for any arguments
		if (process === undefined)
		{
			this._valid = false;
			this._name  = "";
			this._path  = "";
			this._base  = 0;
			this._size  = 0;
			this._proc  = robot.Process();
			this._segments = null;
			return;
		}

		// Verify that args are valid
		if (typeof name === "string" &&
			typeof path === "string" &&
			typeof base === "number" &&
			typeof size === "number" &&
			process instanceof robot.Process)
		{
			this._valid = true;
			this._name  = name;
			this._path  = path;
			this._base  = base;
			this._size  = size;
			this._proc  = process;
			this._segments = null;
			return;
		}

		throw new TypeError ("Invalid arguments");
	}



	//----------------------------------------------------------------------------//
	// Functions                                                           Module //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Module.prototype.isValid    = function() { return this._valid; };
	Module.prototype.getName    = function() { return this._name;  };
	Module.prototype.getPath    = function() { return this._path;  };
	Module.prototype.getBase    = function() { return this._base;  };
	Module.prototype.getSize    = function() { return this._size;  };
	Module.prototype.getProcess = function() { return this._proc;  };

	////////////////////////////////////////////////////////////////////////////////

	Module.prototype.getSegments = function()
	{
		// Check validity of module
		if (!this._valid) return [ ];

		// Check if value available
		if (this._segments === null)
		{
			this._segments = robot.
				Process._getSegments
				(this._proc, this._base);
		}

		// Return the segments
		return this._segments;
	};

	////////////////////////////////////////////////////////////////////////////////

	Module.prototype.contains = function (value)
	{
		// Check for number comparison
		if (typeof value === "number")
		{
			var base = this._base;
			var stop = this._base +
					   this._size;

			return base <= value &&
				   stop >  value;
		}

		throw new TypeError ("Invalid arguments");
	};



	//----------------------------------------------------------------------------//
	// Operators                                                           Module //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Module.prototype.lt = function (value)
	{
		// Check for another module
		if (value instanceof Module)
			return this._base < value._base;

		// Check for number comparison
		if (typeof value === "number")
			return this._base < value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Module.prototype.gt = function (value)
	{
		// Check for another module
		if (value instanceof Module)
			return this._base > value._base;

		// Check for number comparison
		if (typeof value === "number")
			return this._base > value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Module.prototype.le = function (value)
	{
		// Check for another module
		if (value instanceof Module)
			return this._base <= value._base;

		// Check for number comparison
		if (typeof value === "number")
			return this._base <= value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Module.prototype.ge = function (value)
	{
		// Check for another module
		if (value instanceof Module)
			return this._base >= value._base;

		// Check for number comparison
		if (typeof value === "number")
			return this._base >= value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Module.prototype.eq = function (module)
	{
		// Verify that module is valid
		if (!(module instanceof Module))
			throw new TypeError ("Invalid arguments");

		return this._valid === module._valid
			&& this._base  === module._base
			&& this._size  === module._size
			&& this._proc .eq (module._proc);
	};

	////////////////////////////////////////////////////////////////////////////////

	Module.prototype.ne = function (module)
	{
		// Verify that module is valid
		if (!(module instanceof Module))
			throw new TypeError ("Invalid arguments");

		return this._valid !== module._valid
			|| this._base  !== module._base
			|| this._size  !== module._size
			|| this._proc .ne (module._proc);
	};

	////////////////////////////////////////////////////////////////////////////////

	Module.Segment = Segment;
	return Module;
};
