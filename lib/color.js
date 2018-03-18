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
	// Constructor                                                          Color //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Color (ar, ag, ab, aa)
	{
		// Auto instantiate the Color
		if (!(this instanceof Color))
			return new Color (ar, ag, ab, aa);

		var c = Color.normalize (ar, ag, ab, aa);
		this.r = c.r;
		this.g = c.g;
		this.b = c.b;
		this.a = c.a;
	}



	//----------------------------------------------------------------------------//
	// Functions                                                            Color //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Color.prototype.getARGB = function()
	{
		return ((this.a << 24) | (this.r << 16) |
				(this.g <<  8) | (this.b <<  0))
				>>> 0;
	};

	////////////////////////////////////////////////////////////////////////////////

	Color.prototype.setARGB = function (argb)
	{
		// Verify that argb is valid
		if (typeof argb !== "number")
			throw new TypeError ("Invalid arguments");

		this.a = (argb & 0xFF000000) >>> 24;
		this.r = (argb & 0x00FF0000) >>> 16;
		this.g = (argb & 0x0000FF00) >>>  8;
		this.b = (argb & 0x000000FF) >>>  0;
	};



	//----------------------------------------------------------------------------//
	// Static                                                               Color //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Color.normalize = function (ar, ag, ab, aa)
	{
		if (ar instanceof Color)
			return ar;

		if (ar === undefined)
			return { r: 0, g: 0, b: 0, a: 0 };

		if (typeof ar   === "object" &&
			typeof ar.r === "number" &&
			typeof ar.g === "number" &&
			typeof ar.b === "number")
		{
			if (typeof ar.a === "number")
				return ar;

			return { r: ar.r, g: ar.g,
					 b: ar.b, a: 255 };
		}

		if (typeof ar === "number")
		{
			if (typeof ag === "number" &&
				typeof ab === "number")
			{
				if (typeof aa === "number")
					return { r: ar, g: ag, b: ab, a: aa  };
					return { r: ar, g: ag, b: ab, a: 255 };
			}

			return {
				a: (ar & 0xFF000000) >>> 24,
				r: (ar & 0x00FF0000) >>> 16,
				g: (ar & 0x0000FF00) >>>  8,
				b: (ar & 0x000000FF) >>>  0
			};
		}

		throw new TypeError ("Invalid arguments");
	};



	//----------------------------------------------------------------------------//
	// Operators                                                            Color //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Color.prototype.eq = function (ar, ag, ab, aa)
	{
		var c = Color.normalize (ar, ag, ab, aa);
		return this.a === c.a
			&& this.r === c.r
			&& this.g === c.g
			&& this.b === c.b;
	};

	////////////////////////////////////////////////////////////////////////////////

	Color.prototype.ne = function (ar, ag, ab, aa)
	{
		var c = Color.normalize (ar, ag, ab, aa);
		return this.a !== c.a
			|| this.r !== c.r
			|| this.g !== c.g
			|| this.b !== c.b;
	};

	////////////////////////////////////////////////////////////////////////////////

	return Color;
};
