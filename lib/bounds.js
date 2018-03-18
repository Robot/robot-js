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
	// Constructor                                                         Bounds //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Bounds (ax, ay, aw, ah)
	{
		// Auto instantiate the Bounds
		if (!(this instanceof Bounds))
			return new Bounds (ax, ay, aw, ah);

		var b = Bounds.normalize (ax, ay, aw, ah);
		this.x = b.x;
		this.y = b.y;
		this.w = b.w;
		this.h = b.h;
	}



	//----------------------------------------------------------------------------//
	// Functions                                                           Bounds //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.isZero = function()
	{
		return this.x === 0
			&& this.y === 0
			&& this.w === 0
			&& this.h === 0;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.isEmpty = function()
	{
		return this.w === 0
			|| this.h === 0;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.isValid = function()
	{
		return this.w > 0
			&& this.h > 0;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.getLeft = function()
	{
		return this.x;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.getTop = function()
	{
		return this.y;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.getRight = function()
	{
		return this.x + this.w;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.getBottom = function()
	{
		return this.y + this.h;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.setLeft = function (l)
	{
		// Verify that l is valid
		if (typeof l !== "number")
			throw new TypeError ("Invalid arguments");

		this.x = l;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.setTop = function (t)
	{
		// Verify that t is valid
		if (typeof t !== "number")
			throw new TypeError ("Invalid arguments");

		this.y = t;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.setRight = function (r)
	{
		// Verify that r is valid
		if (typeof r !== "number")
			throw new TypeError ("Invalid arguments");

		this.w = r - this.x;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.setBottom = function (b)
	{
		// Verify that b is valid
		if (typeof b !== "number")
			throw new TypeError ("Invalid arguments");

		this.h = b - this.y;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.getLTRB = function()
	{
		return {
			l: this.x, r: this.x + this.w,
			t: this.y, b: this.y + this.h
		};
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.setLTRB = function (l, t, r, b)
	{
		// Verify that LTRB is valid
		if (typeof l !== "number" ||
			typeof t !== "number" ||
			typeof r !== "number" ||
			typeof b !== "number")
			throw new TypeError ("Invalid arguments");

		this.x = l; this.w = r - l;
		this.y = t; this.h = b - t;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.normalize = function()
	{
		if (this.w < 0) { this.x += this.w; this.w = -this.w; }
		if (this.h < 0) { this.y += this.h; this.h = -this.h; }
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.containsP = function (ax, ay, inc)
	{
		var p = robot.Point.normalize (ax, ay);

		// Retrieve last argument
		var inclusive = arguments
			[arguments.length - 1];

		// If inclusive should be default
		if (typeof inclusive !== "boolean")
			inclusive = true;

		// Normalize negative rectangle
		var l = this.x; var r = this.x;
		var t = this.y; var b = this.y;
		if (this.w < 0) l += this.w; else r += this.w;
		if (this.h < 0) t += this.h; else b += this.h;

		return inclusive ?
			l <= p.x && p.x <= r && t <= p.y && p.y <= b :
			l <  p.x && p.x <  r && t <  p.y && p.y <  b;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.containsB = function (ax, ay, aw, ah, inc)
	{
		var bnds = Bounds.normalize (ax, ay, aw, ah);

		// Retrieve last argument
		var inclusive = arguments
			[arguments.length - 1];

		// If inclusive should be default
		if (typeof inclusive !== "boolean")
			inclusive = true;

		if ((this.w === 0 && this.h === 0) ||
			(bnds.w === 0 && bnds.h === 0))
			return false;

		// Normalize negative rectangles
		var l1 = this.x; var r1 = this.x;
		var t1 = this.y; var b1 = this.y;
		if (this.w < 0) l1 += this.w; else r1 += this.w;
		if (this.h < 0) t1 += this.h; else b1 += this.h;

		var l2 = bnds.x; var r2 = bnds.x;
		var t2 = bnds.y; var b2 = bnds.y;
		if (bnds.w < 0) l2 += bnds.w; else r2 += bnds.w;
		if (bnds.h < 0) t2 += bnds.h; else b2 += bnds.h;

		return inclusive ?
			l1 <= l2 && r1 >= r2 && t1 <= t2 && b1 >= b2 :
			l1 <  l2 && r1 >  r2 && t1 <  t2 && b1 >  b2;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.intersects = function (ax, ay, aw, ah, inc)
	{
		var bnds = Bounds.normalize (ax, ay, aw, ah);

		// Retrieve last argument
		var inclusive = arguments
			[arguments.length - 1];

		// If inclusive should be default
		if (typeof inclusive !== "boolean")
			inclusive = true;

		if ((this.w === 0 && this.h === 0) ||
			(bnds.w === 0 && bnds.h === 0))
			return false;

		// Normalize negative rectangles
		var l1 = this.x; var r1 = this.x;
		var t1 = this.y; var b1 = this.y;
		if (this.w < 0) l1 += this.w; else r1 += this.w;
		if (this.h < 0) t1 += this.h; else b1 += this.h;

		var l2 = bnds.x; var r2 = bnds.x;
		var t2 = bnds.y; var b2 = bnds.y;
		if (bnds.w < 0) l2 += bnds.w; else r2 += bnds.w;
		if (bnds.h < 0) t2 += bnds.h; else b2 += bnds.h;

		return inclusive ?
			l1 <= r2 && r1 >= l2 && t1 <= b2 && b1 >= t2 :
			l1 <  r2 && r1 >  l2 && t1 <  b2 && b1 >  t2;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.getPoint = function()
	{
		return robot.Point (this.x, this.y);
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.setPoint = function (ax, ay)
	{
		var p = robot.Point.normalize (ax, ay);
		this.x = p.x;
		this.y = p.y;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.getSize = function()
	{
		return robot.Size (this.w, this.h);
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.setSize = function (aw, ah)
	{
		var s = robot.Size.normalize (aw, ah);
		this.w = s.w;
		this.h = s.h;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.getCenter = function()
	{
		return robot.Point
			(this.x + (this.w * 0.5 | 0),
			 this.y + (this.h * 0.5 | 0));
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.unite = function (ax, ay, aw, ah)
	{
		var bnds = Bounds.normalize (ax, ay, aw, ah);

		// Normalize negative rectangles
		var l1 = this.x; var r1 = this.x;
		var t1 = this.y; var b1 = this.y;
		if (this.w < 0) l1 += this.w; else r1 += this.w;
		if (this.h < 0) t1 += this.h; else b1 += this.h;

		var l2 = bnds.x; var r2 = bnds.x;
		var t2 = bnds.y; var b2 = bnds.y;
		if (bnds.w < 0) l2 += bnds.w; else r2 += bnds.w;
		if (bnds.h < 0) t2 += bnds.h; else b2 += bnds.h;

		if (this.w === 0 && this.h === 0)
			return Bounds ({ l: l2, t: t2, r: r2, b: b2 });

		if (bnds.w === 0 && bnds.h === 0)
			return Bounds ({ l: l1, t: t1, r: r1, b: b1 });

		return Bounds ({
			l: Math.min (l1, l2), r: Math.max (r1, r2),
			t: Math.min (t1, t2), b: Math.max (b1, b2)
		});
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.intersect = function (ax, ay, aw, ah)
	{
		var bnds = Bounds.normalize (ax, ay, aw, ah);

		if ((this.w === 0 && this.h === 0) ||
			(bnds.w === 0 && bnds.h === 0))
			return Bounds();

		// Normalize negative rectangles
		var l1 = this.x; var r1 = this.x;
		var t1 = this.y; var b1 = this.y;
		if (this.w < 0) l1 += this.w; else r1 += this.w;
		if (this.h < 0) t1 += this.h; else b1 += this.h;

		var l2 = bnds.x; var r2 = bnds.x;
		var t2 = bnds.y; var b2 = bnds.y;
		if (bnds.w < 0) l2 += bnds.w; else r2 += bnds.w;
		if (bnds.h < 0) t2 += bnds.h; else b2 += bnds.h;

		// Check for bounds intersection
		if (l1 > r2 || r1 < l2 || t1 > b2 || b1 < t2)
			return Bounds();

		return Bounds ({
			l: Math.max (l1, l2), r: Math.min (r1, r2),
			t: Math.max (t1, t2), b: Math.min (b1, b2)
		});
	};



	//----------------------------------------------------------------------------//
	// Static                                                              Bounds //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Bounds.normalize = function (ax, ay, aw, ah)
	{
		if (ax instanceof Bounds)
			return ax;

		if (ax === undefined)
			return { x: 0, y: 0, w: 0, h: 0 };

		if (ax instanceof robot.Point &&
			ay instanceof robot.Size)
			return {
				x: ax.x, y: ax.y,
				w: ay.w, h: ay.h
			};

		if (typeof ax === "object")
		{
			if (typeof ax.x === "number" &&
				typeof ax.y === "number")
			{
				if (typeof ax.w === "number" &&
					typeof ax.h === "number")
					return ax;

				if (typeof ay   === "object" &&
					typeof ay.w === "number" &&
					typeof ay.h === "number")
					return {
						x: ax.x, y: ax.y,
						w: ay.w, h: ay.h
					};
			}

			if (typeof ax.l === "number" &&
				typeof ax.t === "number" &&
				typeof ax.r === "number" &&
				typeof ax.b === "number")
				return {
					x: ax.l, w: ax.r - ax.l,
					y: ax.t, h: ax.b - ax.t
				};
		}

		if (typeof ax === "number")
		{
			if (typeof ay === "number")
			{
				if (typeof aw === "number" &&
					typeof ah === "number")
					return { x: ax, y: ay, w: aw, h: ah };
					return { x: ax, y: ax, w: ay, h: ay };
			}

			return { x: ax, y: ax, w: ax, h: ax };
		}

		throw new TypeError ("Invalid arguments");
	};



	//----------------------------------------------------------------------------//
	// Operators                                                           Bounds //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.eq = function (ax, ay, aw, ah)
	{
		var b = Bounds.normalize (ax, ay, aw, ah);
		return this.x === b.x
			&& this.y === b.y
			&& this.w === b.w
			&& this.h === b.h;
	};

	////////////////////////////////////////////////////////////////////////////////

	Bounds.prototype.ne = function (ax, ay, aw, ah)
	{
		var b = Bounds.normalize (ax, ay, aw, ah);
		return this.x !== b.x
			|| this.y !== b.y
			|| this.w !== b.w
			|| this.h !== b.h;
	};

	////////////////////////////////////////////////////////////////////////////////

	return Bounds;
};
