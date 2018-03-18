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
	// Locals                                                                     //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	var mInvalid = Number.MAX_SAFE_INTEGER;



	//----------------------------------------------------------------------------//
	// Constructor                                                          Timer //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Timer()
	{
		// Auto instantiate the Timer
		if (!(this instanceof Timer))
			return new Timer();

		this._started = mInvalid;
	}



	//----------------------------------------------------------------------------//
	// Functions                                                            Timer //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.start = function()
	{
		this._started = Timer.getCpuTime();
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.reset = function()
	{
		// Check if timer has started
		if (this._started === mInvalid)
			return 0;

		else
		{
			var old = this._started;
			this._started = mInvalid;
			return Timer.getCpuTime() - old;
		}
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.restart = function()
	{
		// Check if timer has started
		if (this._started === mInvalid)
		{
			this._started = Timer.getCpuTime();
			return 0;
		}

		else
		{
			var old = this._started;
			this._started = Timer.getCpuTime();
			return this._started - old;
		}
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.getElapsed = function()
	{
		// Check if timer has started
		if (this._started === mInvalid)
			return 0;

		return Timer.getCpuTime() - this._started;
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.hasStarted = function()
	{
		return this._started !== mInvalid;
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.hasExpired = function (time)
	{
		// Verify that time is valid
		if (typeof time !== "number")
			throw new TypeError ("Invalid arguments");

		// Check if timer has started
		if (this._started === mInvalid)
			return true;

		return this.getElapsed() > time;
	};



	//----------------------------------------------------------------------------//
	// Static                                                               Timer //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Timer.sleep = function (aMin, aMax)
	{
		var r = robot.Range.normalize (aMin, aMax);

		var d = 0;
		// Check if the range is valid
		if (r.min >= r.max) d = r.min;

		// Generate value between a range
		else d = (Math.random() *
			(r.max - r.min) | 0) + r.min;

		native.sleep (d);
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.getCpuTime = native.clock;



	//----------------------------------------------------------------------------//
	// Operators                                                            Timer //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.lt = function (timer)
	{
		// Verify that timer is valid
		if (!(timer instanceof Timer))
			throw new TypeError ("Invalid arguments");

		if (timer._started === mInvalid) return false;
		if ( this._started === mInvalid) return true;
		return this._started > timer._started;
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.gt = function (timer)
	{
		// Verify that timer is valid
		if (!(timer instanceof Timer))
			throw new TypeError ("Invalid arguments");

		if ( this._started === mInvalid) return false;
		if (timer._started === mInvalid) return true;
		return this._started < timer._started;
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.le = function (timer)
	{
		// Verify that timer is valid
		if (!(timer instanceof Timer))
			throw new TypeError ("Invalid arguments");

		if ( this._started === mInvalid) return true;
		if (timer._started === mInvalid) return false;
		return this._started >= timer._started;
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.ge = function (timer)
	{
		// Verify that timer is valid
		if (!(timer instanceof Timer))
			throw new TypeError ("Invalid arguments");

		if (timer._started === mInvalid) return true;
		if ( this._started === mInvalid) return false;
		return this._started <= timer._started;
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.eq = function (timer)
	{
		// Verify that timer is valid
		if (!(timer instanceof Timer))
			throw new TypeError ("Invalid arguments");

		return this._started === timer._started;
	};

	////////////////////////////////////////////////////////////////////////////////

	Timer.prototype.ne = function (timer)
	{
		// Verify that timer is valid
		if (!(timer instanceof Timer))
			throw new TypeError ("Invalid arguments");

		return this._started !== timer._started;
	};

	////////////////////////////////////////////////////////////////////////////////

	return Timer;
};
