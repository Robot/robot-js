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
	// Functions                                                            Image //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Image.prototype.create = function (aw, ah)
	{
		var s = robot
			.Size.normalize ( aw,  ah);
		return this._create (s.w, s.h);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Image.prototype.getPixel = function (ax, ay)
	{
		var p = robot
			 .Point.normalize ( ax,  ay);
		return this._getPixel (p.x, p.y);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Image.prototype.setPixel = function (ax, ay, color)
	{
		var c = arguments[arguments.length - 1];

		// Check if argument is a color
		if (!(c instanceof robot.Color))
			throw new TypeError ("Invalid arguments");

		var p = robot.Point.normalize (ax, ay);
		this._setPixel (p.x, p.y, c.r, c.g, c.b, c.a);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Image.prototype.fill = function (ar, ag, ab, aa)
	{
		var c = robot.
			Color.normalize ( ar,  ag,  ab,  aa);
		return this._fill   (c.r, c.g, c.b, c.a);
	};



	//----------------------------------------------------------------------------//
	// Operators                                                            Image //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	native.Image.prototype.eq = function (image)
	{
		// Check if image is a native image
		if (!(image instanceof native.Image))
			throw new TypeError ("Invalid arguments");

		return  this._equals (image);
	};

	////////////////////////////////////////////////////////////////////////////////

	native.Image.prototype.ne = function (image)
	{
		// Check if image is a native image
		if (!(image instanceof native.Image))
			throw new TypeError ("Invalid arguments");

		return !this._equals (image);
	};

	////////////////////////////////////////////////////////////////////////////////

	return native.Image;
};
