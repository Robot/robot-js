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

module.exports = function (robot)
{
	//----------------------------------------------------------------------------//
	// Constructor                                                          Range //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Range (aMin, aMax)
	{
		// Auto instantiate the Range
		if (!(this instanceof Range))
			return new Range (aMin, aMax);

		var r = Range.normalize (aMin, aMax);
		this.min = r.min;
		this.max = r.max;
	}



	//----------------------------------------------------------------------------//
	// Functions                                                            Range //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Range.prototype.getRange = function()
	{
		return this.max - this.min;
	};

	////////////////////////////////////////////////////////////////////////////////

	Range.prototype.setRange = function (aMin, aMax)
	{
		var r = Range.normalize (aMin, aMax);
		this.min = r.min;
		this.max = r.max;
	};

	////////////////////////////////////////////////////////////////////////////////

	Range.prototype.getRandom = function()
	{
		// Check if this range is currently valid
		if (this.min >= this.max) return this.min;

		// Generate value between a range
		return (Math.random() * (this.max -
				this.min) | 0) + this.min;
	};

	////////////////////////////////////////////////////////////////////////////////

	Range.prototype.contains = function (value, inclusive)
	{
		// Inclusive true by default
		if (inclusive === undefined)
			inclusive = true;

		// Verify that parameters are valid
		if (typeof value     !== "number" ||
			typeof inclusive !== "boolean")
			throw new TypeError ("Invalid arguments");

		return inclusive ?
			this.min <= value && value <= this.max :
			this.min <  value && value <  this.max;
	};



	//----------------------------------------------------------------------------//
	// Static                                                               Range //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Range.normalize = function (aMin, aMax)
	{
		if (aMin instanceof Range)
			return aMin;

		if (aMin === undefined)
			return { min: 0, max: 0 };

		if (typeof aMin     === "object" &&
			typeof aMin.min === "number" &&
			typeof aMin.max === "number")
			return aMin;

		if (typeof aMin === "number")
		{
			if (typeof aMax === "number")
				return { min: aMin, max: aMax };
				return { min: aMin, max: aMin };
		}

		throw new TypeError
			("Invalid arguments");
	};



	//----------------------------------------------------------------------------//
	// Operators                                                            Range //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Range.prototype.eq = function (aMin, aMax)
	{
		var r = Range.normalize (aMin, aMax);
		return this.min === r.min
			&& this.max === r.max;
	};

	////////////////////////////////////////////////////////////////////////////////

	Range.prototype.ne = function (aMin, aMax)
	{
		var r = Range.normalize (aMin, aMax);
		return this.min !== r.min
			|| this.max !== r.max;
	};

	////////////////////////////////////////////////////////////////////////////////

	return Range;
};
