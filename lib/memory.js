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
	// Stats                                                               Memory //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Stats()
	{
		// Auto instantiate the Stats
		if (!(this instanceof Stats))
			return new Stats();

		this.systemReads  = 0;
		this.cachedReads  = 0;
		this.systemWrites = 0;
		this.accessWrites = 0;

		this. readErrors  = 0;
		this.writeErrors  = 0;
	}

	////////////////////////////////////////////////////////////////////////////////

	Stats.prototype.eq = function (stats)
	{
		// Verify that stats is valid
		if (!(stats instanceof Stats))
			throw new TypeError ("Invalid arguments");

		return this.systemReads  === stats.systemReads
			&& this.cachedReads  === stats.cachedReads
			&& this.systemWrites === stats.systemWrites
			&& this.accessWrites === stats.accessWrites

			&& this. readErrors  === stats. readErrors
			&& this.writeErrors  === stats.writeErrors;
	};

	////////////////////////////////////////////////////////////////////////////////

	Stats.prototype.ne = function (stats)
	{
		// Verify that stats is valid
		if (!(stats instanceof Stats))
			throw new TypeError ("Invalid arguments");

		return this.systemReads  !== stats.systemReads
			|| this.cachedReads  !== stats.cachedReads
			|| this.systemWrites !== stats.systemWrites
			|| this.accessWrites !== stats.accessWrites

			|| this. readErrors  !== stats. readErrors
			|| this.writeErrors  !== stats.writeErrors;
	};



	//----------------------------------------------------------------------------//
	// Region                                                              Memory //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Region()
	{
		// Auto instantiate the Region
		if (!(this instanceof Region))
			return new Region();

		this.valid      = false;
		this.bound      = false;

		this.start      = 0;
		this.stop       = 0;
		this.size       = 0;

		this.readable   = false;
		this.writable   = false;
		this.executable = false;
		this.access     = 0;

		this.private    = false;
		this.guarded    = false;
	}

	////////////////////////////////////////////////////////////////////////////////

	Region.prototype.contains = function (value)
	{
		// Check for number comparison
		if (typeof value === "number")
		{
			return this.start <= value &&
				   this.stop  >  value;
		}

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Region.prototype.lt = function (value)
	{
		// Check for another region
		if (value instanceof Region)
			return this.start < value.start;

		// Check for number comparison
		if (typeof value === "number")
			return this.start < value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Region.prototype.gt = function (value)
	{
		// Check for another region
		if (value instanceof Region)
			return this.start > value.start;

		// Check for number comparison
		if (typeof value === "number")
			return this.start > value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Region.prototype.le = function (value)
	{
		// Check for another region
		if (value instanceof Region)
			return this.start <= value.start;

		// Check for number comparison
		if (typeof value === "number")
			return this.start <= value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Region.prototype.ge = function (value)
	{
		// Check for another region
		if (value instanceof Region)
			return this.start >= value.start;

		// Check for number comparison
		if (typeof value === "number")
			return this.start >= value;

		throw new TypeError ("Invalid arguments");
	};

	////////////////////////////////////////////////////////////////////////////////

	Region.prototype.eq = function (region)
	{
		// Verify that region is valid
		if (!(region instanceof Region))
			throw new TypeError ("Invalid arguments");

		return this.valid      === region.valid
			&& this.bound      === region.bound

			&& this.start      === region.start
			&& this.stop       === region.stop
			&& this.size       === region.size

			&& this.readable   === region.readable
			&& this.writable   === region.writable
			&& this.executable === region.executable
			&& this.access     === region.access

			&& this.private    === region.private
			&& this.guarded    === region.guarded;
	};

	////////////////////////////////////////////////////////////////////////////////

	Region.prototype.ne = function (region)
	{
		// Verify that region is valid
		if (!(region instanceof Region))
			throw new TypeError ("Invalid arguments");

		return this.valid      !== region.valid
			|| this.bound      !== region.bound

			|| this.start      !== region.start
			|| this.stop       !== region.stop
			|| this.size       !== region.size

			|| this.readable   !== region.readable
			|| this.writable   !== region.writable
			|| this.executable !== region.executable
			|| this.access     !== region.access

			|| this.private    !== region.private
			|| this.guarded    !== region.guarded;
	};



	//----------------------------------------------------------------------------//
	// Functions                                                           Memory //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.setAccess = function (region, r, w, x)
	{
		// Verify that region is valid
		if (!(region instanceof Region))
			throw new TypeError ("Invalid arguments");

		return this._setAccess
			// Optimize the native call
			(region.valid, region.bound,
			 region.start, region.size,
			 r, w, x);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.getPtrSize    = function() { return this._ptrSize;    };
	native.Memory.prototype.getMinAddress = function() { return this._minAddress; };
	native.Memory.prototype.getMaxAddress = function() { return this._maxAddress; };
	native.Memory.prototype.getPageSize   = function() { return this._pageSize;   };



	//----------------------------------------------------------------------------//
	// Extensions                                                          Memory //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.readInt8 = function (address, count, stride)
	{
		return this._readType (address, native.Memory._TYPE_INT8, 1, count, stride);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.readInt16 = function (address, count, stride)
	{
		return this._readType (address, native.Memory._TYPE_INT16, 2, count, stride);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.readInt32 = function (address, count, stride)
	{
		return this._readType (address, native.Memory._TYPE_INT32, 4, count, stride);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.readInt64 = function (address, count, stride)
	{
		return this._readType (address, native.Memory._TYPE_INT64, 8, count, stride);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.readReal32 = function (address, count, stride)
	{
		return this._readType (address, native.Memory._TYPE_REAL32, 4, count, stride);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.readReal64 = function (address, count, stride)
	{
		return this._readType (address, native.Memory._TYPE_REAL64, 8, count, stride);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.readPtr = function (address, count, stride)
	{
		if (this._ptrSize === 4)
			return this._readType (address, native.Memory._TYPE_INT32, 4, count, stride);
		else
			return this._readType (address, native.Memory._TYPE_INT64, 8, count, stride);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.readBool = function (address, count, stride)
	{
		return this._readType (address, native.Memory._TYPE_BOOL, 1, count, stride);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.readString = function (address, length, count, stride)
	{
		return this._readType (address, native.Memory._TYPE_STRING, length, count, stride);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.writeInt8 = function (address, data)
	{
		return this._writeType (address, data, native.Memory._TYPE_INT8, 1);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.writeInt16 = function (address, data)
	{
		return this._writeType (address, data, native.Memory._TYPE_INT16, 2);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.writeInt32 = function (address, data)
	{
		return this._writeType (address, data, native.Memory._TYPE_INT32, 4);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.writeInt64 = function (address, data)
	{
		return this._writeType (address, data, native.Memory._TYPE_INT64, 8);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.writeReal32 = function (address, data)
	{
		return this._writeType (address, data, native.Memory._TYPE_REAL32, 4);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.writeReal64 = function (address, data)
	{
		return this._writeType (address, data, native.Memory._TYPE_REAL64, 8);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.writePtr = function (address, data)
	{
		if (this._ptrSize === 4)
			return this._writeType (address, data, native.Memory._TYPE_INT32, 4);
		else
			return this._writeType (address, data, native.Memory._TYPE_INT64, 8);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.writeBool = function (address, data)
	{
		return this._writeType (address, data, native.Memory._TYPE_BOOL, 1);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.prototype.writeString = function (address, data, length)
	{
		return this._writeType (address, data, native.Memory._TYPE_STRING, length);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Memory.Stats  = Stats;
	native.Memory.Region = Region;
	return native.Memory;
};
