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

module.exports = function (robot, log, sprintf, getchar, assert)
{
	//----------------------------------------------------------------------------//
	// Locals                                                                     //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	var Hash   = robot.Hash;
	var Color  = robot.Color;
	var Image  = robot.Image;
	var Range  = robot.Range;
	var Point  = robot.Point;
	var Size   = robot.Size;
	var Bounds = robot.Bounds;



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function testHash()
	{
		var h1 = Hash ("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
		var h2 = Hash ("PZNXECYBMOVHUWSGIKRFLAQDTJ");
		var h3 = Hash ("PZNXECYBMOVHUWSGIKRFLAQDTJ");
		var h4 = Hash ("MKQYRNCZFBGXLHEIWAOJPSVTUD");
		var h5 = Hash ("KMQYRNCZFBGXLHEIWAOJPSVTUD");
		var h6 = Hash ("LSIWNEURFMZAXYJKQBVGHCPTOD");
		var h7 = Hash ("LSIWNEURFMZAXYJKQBVGHCPTDO");
		var h8 = Hash ("QHWBMKZRELNYDJAFUPTXICGOSV");
		var h9 = Hash ("QHWBMKZRELYNDJAFUPTXICGOSV");

		assert (h1.eq (0xABF77822));
		assert (h2.eq (0xB402F824));
		assert (h3.eq (0xB402F824));
		assert (h4.eq (0x211B870C));
		assert (h5.eq (0x751E361B));
		assert (h6.eq (0x86A920A7));
		assert (h7.eq (0xF28F20E4));
		assert (h8.eq (0x94942DD5));
		assert (h9.eq (0x50297B6B));

		assert ( h1.eq (h1));
		assert (!h1.eq (h2));
		assert (!h1.ne (h1));
		assert ( h1.ne (h2));

		assert (h2.eq (h3));
		assert (h3.eq (h2));
		assert (h4.ne (h5));
		assert (h5.ne (h4));
		assert (h6.ne (h7));
		assert (h7.ne (h6));
		assert (h8.ne (h9));
		assert (h9.ne (h8));

		h1 = new Hash (Buffer (".M:.Ak=-n.~.%^njfb|*-!9+dO3o"    ));
		h2 = new Hash (Buffer ("7J4P67_09;!5=-;55.2_x!533aH7_X"  ));
		h3 = new Hash (Buffer ("ai!.tc_Z-*%x6%3TCb0Yjxh^84D8A"   ));
		h4 = new Hash (Buffer (";e.o;V7F.qut;thwdO^:|^=!3;.!+~H" ));
		h5 = new Hash (Buffer ("q3_!GG:%8z54=%c!!o7~!.^Wwj%=_R"  ));
		h6 = new Hash (Buffer ("b;B7+t=.^^.L*%i9;|*%S++56q.|%~^u"));
		h7 = new Hash (Buffer ("Us*Fki-XgYTp.OVWL|t~GxrQ5G;7xC"  ));
		h8 = new Hash (Buffer ("%e*5aY681;Z0TX_-n~:4~^0W-6_D"    ));
		h9 = new Hash (Buffer ("r73%Q-9dz!YB:j2!9*64B+M%j+O4e"   ));

		assert (h1.result === 0x73FECF56);
		assert (h2.result === 0xA99190FB);
		assert (h3.result === 0xBC85CDC1);
		assert (h4.result === 0xC30A3672);
		assert (h5.result === 0xAF8EEBEA);
		assert (h6.result === 0x92FDEC2E);
		assert (h7.result === 0x129F85F3);
		assert (h8.result === 0xC9671825);
		assert (h9.result === 0x2221D6E3);

		h1 = Hash(); assert (h1.result === 0);

		h1.append ("z=6x_p2-8F--=IYi%;jZ3*+i"); assert (h1.result === 0x7192FCF6);
		h1.append ("32Yl1+*%%I_S:5;4.=8805|v"); assert (h1.result === 0x476D1F3A);
		h1.append ("_3hdn-!nAA!+B~+:l;7Oz..K"); assert (h1.result === 0x28F13959);
		h1.append ("0+g|1|T324G;=~=.~^.i;aZn"); assert (h1.result === 0xED3A4012);

		//----------------------------------------------------------------------------//

		assert (h1.append, h1, [ ]);
		assert (h1.eq, h1, ["a"]);
		assert (h1.ne, h1, ["a"]);

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testColor()
	{
		var c1 = Color ();
		var c2 = Color (0xDC195A);
		var c3 = Color (0x5A6E2882);
		var c4 = Color (100, 215, 180);
		var c5 = Color (110, 40, 130, 90);

		assert (c1.a ===   0 && c1.r ===    0 && c1.g ===   0 && c1.b ===   0);
		assert (c2.a ===   0 && c2.r ===  220 && c2.g ===  25 && c2.b ===  90);
		assert (c3.a ===  90 && c3.r ===  110 && c3.g ===  40 && c3.b === 130);
		assert (c4.a === 255 && c4.r ===  100 && c4.g === 215 && c4.b === 180);
		assert (c5.a ===  90 && c5.r ===  110 && c5.g ===  40 && c5.b === 130);

		assert (c1.getARGB() === 0         );
		assert (c2.getARGB() === 0xDC195A  );
		assert (c3.getARGB() === 0x5A6E2882);
		assert (c4.getARGB() === 0xFF64D7B4);
		assert (c5.getARGB() === 0x5A6E2882);

		c2.setARGB (0xFF64D7B4);

		assert ( c1.eq (c1));
		assert (!c1.eq (c2));
		assert (!c1.ne (c1));
		assert ( c1.ne (c2));

		assert (c2.ne (c3));
		assert (c3.ne (c2));
		assert (c3.ne (c4));
		assert (c4.ne (c3));
		assert (c4.ne (c5));
		assert (c5.ne (c4));
		assert (c2.eq (c4));
		assert (c4.eq (c2));
		assert (c3.eq (c5));
		assert (c5.eq (c3));

		//----------------------------------------------------------------------------//

		c2 = Color (c3);
		c3 = Color ({ r: 180, g: 200, b: 100        });
		c4 = Color ({ r: 160, g: 180, b: 120, a: 20 });
		c5 = Color (c3);

		assert (c2.a ===  90 && c2.r ===  110 && c2.g ===  40 && c2.b === 130);
		assert (c3.a === 255 && c3.r ===  180 && c3.g === 200 && c3.b === 100);
		assert (c4.a ===  20 && c4.r ===  160 && c4.g === 180 && c4.b === 120);
		assert (c5.a === 255 && c5.r ===  180 && c5.g === 200 && c5.b === 100);

		assert (c3.ne (  ));
		assert (c3.eq (c3));
		assert (c3.eq (0xFFB4C864        ));
		assert (c3.eq (180, 200, 100, 255));
		assert (c3.eq (180, 200, 100     ));
		assert (c3.eq ({ r: 180, g: 200, b: 100, a: 255 }));
		assert (c3.eq ({ r: 180, g: 200, b: 100         }));

		assert (c4.ne (  ));
		assert (c4.eq (c4));
		assert (c4.eq (0x14A0B478       ));
		assert (c4.eq (160, 180, 120, 20));
		assert (c4.ne (160, 180, 120    ));
		assert (c4.eq ({ r: 160, g: 180, b: 120, a: 20 }));
		assert (c4.ne ({ r: 160, g: 180, b: 120        }));

		assert (c1.setARGB, c1, [   ]);
		assert (c1.setARGB, c1, ["a"]);

		assert (c1.eq, c1, ["a"]);
		assert (c1.ne, c1, ["a"]);

		assert (c1.eq, c1, [{ r: 0 }]);
		assert (c1.ne, c1, [{ g: 0 }]);
		assert (c1.eq, c1, [{ b: 0 }]);
		assert (c1.ne, c1, [{ a: 0 }]);

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testImage1()
	{
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testImage2()
	{
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testRange()
	{
		var r1 = Range ();
		var r2 = Range ( 5    );
		var r3 = Range ( 2,  8);
		var r4 = Range ( 7,  3);
		var r5 = Range (-4,  5);
		var r6 = Range ( 3, -6);
		var r7 = Range (-8, -4);
		var r8 = Range (-3, -7);
		var r9 = Range (-6, -6);

		assert (r1.min ===  0 && r1.max ===  0);
		assert (r2.min ===  5 && r2.max ===  5);
		assert (r3.min ===  2 && r3.max ===  8);
		assert (r4.min ===  7 && r4.max ===  3);
		assert (r5.min === -4 && r5.max ===  5);
		assert (r6.min ===  3 && r6.max === -6);
		assert (r7.min === -8 && r7.max === -4);
		assert (r8.min === -3 && r8.max === -7);
		assert (r9.min === -6 && r9.max === -6);

		assert (r1.getRange() ===  0);
		assert (r2.getRange() ===  0);
		assert (r3.getRange() ===  6);
		assert (r4.getRange() === -4);
		assert (r5.getRange() ===  9);
		assert (r6.getRange() === -9);
		assert (r7.getRange() ===  4);
		assert (r8.getRange() === -4);
		assert (r9.getRange() ===  0);

		assert ( r1.contains (0));
		assert (!r2.contains (4));
		assert ( r2.contains (5));
		assert (!r2.contains (6));
		assert (!r3.contains (1));
		assert ( r3.contains (2));
		assert ( r3.contains (3));
		assert ( r3.contains (7));
		assert ( r3.contains (8));
		assert (!r3.contains (9));
		assert (!r4.contains (6));
		assert (!r4.contains (7));
		assert (!r4.contains (8));
		assert (!r4.contains (2));
		assert (!r4.contains (3));
		assert (!r4.contains (4));

		assert (!r1.contains (0, false));
		assert (!r2.contains (4, false));
		assert (!r2.contains (5, false));
		assert (!r2.contains (6, false));
		assert (!r3.contains (1, false));
		assert (!r3.contains (2, false));
		assert ( r3.contains (3, false));
		assert ( r3.contains (7, false));
		assert (!r3.contains (8, false));
		assert (!r3.contains (9, false));
		assert (!r4.contains (6, false));
		assert (!r4.contains (7, false));
		assert (!r4.contains (8, false));
		assert (!r4.contains (2, false));
		assert (!r4.contains (3, false));
		assert (!r4.contains (4, false));

		var min1 = 99; var max1 = -99;
		var min2 = 99; var max2 = -99;
		var min3 = 99; var max3 = -99;
		var min4 = 99; var max4 = -99;
		var min5 = 99; var max5 = -99;
		var min6 = 99; var max6 = -99;
		var min7 = 99; var max7 = -99;
		var min8 = 99; var max8 = -99;
		var min9 = 99; var max9 = -99;

		for (var i = 0; i < 99999; ++i)
		{
			var rand1 = r1.getRandom();
			var rand2 = r2.getRandom();
			var rand3 = r3.getRandom();
			var rand4 = r4.getRandom();
			var rand5 = r5.getRandom();
			var rand6 = r6.getRandom();
			var rand7 = r7.getRandom();
			var rand8 = r8.getRandom();
			var rand9 = r9.getRandom();

			if (min1 > rand1) min1 = rand1; if (max1 < rand1) max1 = rand1;
			if (min2 > rand2) min2 = rand2; if (max2 < rand2) max2 = rand2;
			if (min3 > rand3) min3 = rand3; if (max3 < rand3) max3 = rand3;
			if (min4 > rand4) min4 = rand4; if (max4 < rand4) max4 = rand4;
			if (min5 > rand5) min5 = rand5; if (max5 < rand5) max5 = rand5;
			if (min6 > rand6) min6 = rand6; if (max6 < rand6) max6 = rand6;
			if (min7 > rand7) min7 = rand7; if (max7 < rand7) max7 = rand7;
			if (min8 > rand8) min8 = rand8; if (max8 < rand8) max8 = rand8;
			if (min9 > rand9) min9 = rand9; if (max9 < rand9) max9 = rand9;
		}

		assert (min1 ===  0 && max1 ===  0);
		assert (min2 ===  5 && max2 ===  5);
		assert (min3 ===  2 && max3 ===  7);
		assert (min4 ===  7 && max4 ===  7);
		assert (min5 === -4 && max5 ===  4);
		assert (min6 ===  3 && max6 ===  3);
		assert (min7 === -8 && max7 === -5);
		assert (min8 === -3 && max8 === -3);
		assert (min9 === -6 && max9 === -6);

		r6 =  Range (r2   );
		r7 =  Range (r3   );
		r2.setRange ( 6   );
		r3.setRange ( 3, 9);
		r4.setRange ( 6, 2);
		r5.setRange (-3, 8);
		r8 =  Range (r4   );
		r9.setRange (-3, 8);

		assert (r1.min ===  0 && r1.max === 0);
		assert (r2.min ===  6 && r2.max === 6);
		assert (r3.min ===  3 && r3.max === 9);
		assert (r4.min ===  6 && r4.max === 2);
		assert (r5.min === -3 && r5.max === 8);
		assert (r6.min ===  5 && r6.max === 5);
		assert (r7.min ===  2 && r7.max === 8);
		assert (r8.min ===  6 && r8.max === 2);
		assert (r9.min === -3 && r9.max === 8);

		assert ( r1.eq (r1));
		assert (!r1.eq (r2));
		assert (!r1.ne (r1));
		assert ( r1.ne (r2));

		assert (r6.ne (r2));
		assert (r2.ne (r6));
		assert (r8.eq (r4));
		assert (r4.eq (r8));
		assert (r3.ne (r5));
		assert (r5.ne (r3));
		assert (r9.eq (r5));
		assert (r5.eq (r9));

		//----------------------------------------------------------------------------//

		r2 = Range (r3);
		r3 = Range ({ min:  2, max:  8 });
		r4 = Range ({ min: -6, max:  2 });
		r5 = Range ({ min: -8, max: -6 });
		r6 = Range (r3);
		r7.setRange ({ min:  2, max:  8 });
		r8.setRange ({ min: -8, max: -6 });

		assert (r2.min ===  3 && r2.max ===  9);
		assert (r3.min ===  2 && r3.max ===  8);
		assert (r4.min === -6 && r4.max ===  2);
		assert (r5.min === -8 && r5.max === -6);
		assert (r6.min ===  2 && r6.max ===  8);
		assert (r7.min ===  2 && r7.max ===  8);
		assert (r8.min === -8 && r8.max === -6);

		assert (r3.ne (  ));
		assert (r3.eq (r3));
		assert (r3.ne ( 8));
		assert (r3.eq ( 2, 8));
		assert (r3.eq ({ min:  2, max: 8 }));

		assert (r4.ne (  ));
		assert (r4.eq (r4));
		assert (r4.ne (-6));
		assert (r4.eq (-6, 2));
		assert (r4.eq ({ min: -6, max: 2 }));

		assert (r1.contains, r1, [   ]);
		assert (r1.contains, r1, ["a"]);

		assert (r1.eq, r1, ["a"]);
		assert (r1.ne, r1, ["a"]);

		assert (r1.eq, r1, [{ min: 0 }]);
		assert (r1.ne, r1, [{ max: 0 }]);

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testBounds()
	{
		var p1 = Point ();
		var p2 = Point ( 5    );
		var p3 = Point ( 0,  8);
		var p4 = Point (-4,  0);
		var p5 = Point ( 3, -6);
		var p6 = Point (-3, -7);

		var s1 = Size ();
		var s2 = Size ( 5    );
		var s3 = Size ( 0,  8);
		var s4 = Size (-4,  0);
		var s5 = Size ( 3, -6);
		var s6 = Size (-3, -7);

		var p7 = s2.toPoint();
		var p8 = s6.toPoint();
		var p9 = Point (-6);

		var s7 = p2.toSize();
		var s8 = p6.toSize();
		var s9 = Size (-6);

		assert (p1.x ===  0 && p1.y ===  0);
		assert (p2.x ===  5 && p2.y ===  5);
		assert (p3.x ===  0 && p3.y ===  8);
		assert (p4.x === -4 && p4.y ===  0);
		assert (p5.x ===  3 && p5.y === -6);
		assert (p6.x === -3 && p6.y === -7);
		assert (p7.x ===  5 && p7.y ===  5);
		assert (p8.x === -3 && p8.y === -7);
		assert (p9.x === -6 && p9.y === -6);

		assert (s1.w ===  0 && s1.h ===  0);
		assert (s2.w ===  5 && s2.h ===  5);
		assert (s3.w ===  0 && s3.h ===  8);
		assert (s4.w === -4 && s4.h ===  0);
		assert (s5.w ===  3 && s5.h === -6);
		assert (s6.w === -3 && s6.h === -7);
		assert (s7.w ===  5 && s7.h ===  5);
		assert (s8.w === -3 && s8.h === -7);
		assert (s9.w === -6 && s9.h === -6);

		assert ( p1.isZero());
		assert (!p2.isZero());
		assert (!p3.isZero());
		assert (!p4.isZero());

		assert ( s1.isEmpty());
		assert (!s2.isEmpty());
		assert (!s3.isEmpty());
		assert (!s4.isEmpty());

		assert (p1.toSize ().w ===  0 && p1.toSize ().h === 0);
		assert (p2.toSize ().w ===  5 && p2.toSize ().h === 5);
		assert (p3.toSize ().w ===  0 && p3.toSize ().h === 8);
		assert (p4.toSize ().w === -4 && p4.toSize ().h === 0);

		assert (s1.toPoint().x ===  0 && s1.toPoint().y === 0);
		assert (s2.toPoint().x ===  5 && s2.toPoint().y === 5);
		assert (s3.toPoint().x ===  0 && s3.toPoint().y === 8);
		assert (s4.toPoint().x === -4 && s4.toPoint().y === 0);

		p2 = p2.add (p1);
		p3 = p3.add (p2);
		p4 = p4.sub (p3);
		p5 = p5.sub (p4);
		p6 = p2.add (p3);
		p7 = p4.add (p5);
		p8 = p2.sub (p3);
		p9 = p4.sub (p5);

		s2 = s2.add (s1);
		s3 = s3.add (s2);
		s4 = s4.sub (s3);
		s5 = s5.sub (s4);
		s6 = s2.add (s3);
		s7 = s4.add (s5);
		s8 = s2.sub (s3);
		s9 = s4.sub (s5);

		assert (p1.x ===   0 && p1.y ===   0);
		assert (p2.x ===   5 && p2.y ===   5);
		assert (p3.x ===   5 && p3.y ===  13);
		assert (p4.x ===  -9 && p4.y === -13);
		assert (p5.x ===  12 && p5.y ===   7);
		assert (p6.x ===  10 && p6.y ===  18);
		assert (p7.x ===   3 && p7.y ===  -6);
		assert (p8.x ===   0 && p8.y ===  -8);
		assert (p9.x === -21 && p9.y === -20);

		assert (s1.w ===   0 && s1.h ===   0);
		assert (s2.w ===   5 && s2.h ===   5);
		assert (s3.w ===   5 && s3.h ===  13);
		assert (s4.w ===  -9 && s4.h === -13);
		assert (s5.w ===  12 && s5.h ===   7);
		assert (s6.w ===  10 && s6.h ===  18);
		assert (s7.w ===   3 && s7.h ===  -6);
		assert (s8.w ===   0 && s8.h ===  -8);
		assert (s9.w === -21 && s9.h === -20);

		p6 = Point (p2   );
		p7 = Point (p3   );
		p2 = Point ( 6   );
		p3 = Point ( 3, 9);
		p4 = Point ( 6, 2);
		p5 = Point (-3, 8);
		p8 = Point (p4   );
		p9 = Point (-3, 8);

		s6 = Size (s2   );
		s7 = Size (s3   );
		s2 = Size ( 6   );
		s3 = Size ( 3, 9);
		s4 = Size ( 6, 2);
		s5 = Size (-3, 8);
		s8 = Size (s4   );
		s9 = Size (-3, 8);

		assert (p1.x ===  0 && p1.y ===  0);
		assert (p2.x ===  6 && p2.y ===  6);
		assert (p3.x ===  3 && p3.y ===  9);
		assert (p4.x ===  6 && p4.y ===  2);
		assert (p5.x === -3 && p5.y ===  8);
		assert (p6.x ===  5 && p6.y ===  5);
		assert (p7.x ===  5 && p7.y === 13);
		assert (p8.x ===  6 && p8.y ===  2);
		assert (p9.x === -3 && p9.y ===  8);

		assert (s1.w ===  0 && s1.h ===  0);
		assert (s2.w ===  6 && s2.h ===  6);
		assert (s3.w ===  3 && s3.h ===  9);
		assert (s4.w ===  6 && s4.h ===  2);
		assert (s5.w === -3 && s5.h ===  8);
		assert (s6.w ===  5 && s6.h ===  5);
		assert (s7.w ===  5 && s7.h === 13);
		assert (s8.w ===  6 && s8.h ===  2);
		assert (s9.w === -3 && s9.h ===  8);

		assert ( p1.eq (p1));
		assert (!p1.eq (p2));
		assert (!p1.ne (p1));
		assert ( p1.ne (p2));

		assert (p6.ne (p2));
		assert (p2.ne (p6));
		assert (p8.eq (p4));
		assert (p4.eq (p8));
		assert (p3.ne (p5));
		assert (p5.ne (p3));
		assert (p9.eq (p5));
		assert (p5.eq (p9));

		assert ( s1.eq (s1));
		assert (!s1.eq (s2));
		assert (!s1.ne (s1));
		assert ( s1.ne (s2));

		assert (s6.ne (s2));
		assert (s2.ne (s6));
		assert (s8.eq (s4));
		assert (s4.eq (s8));
		assert (s3.ne (s5));
		assert (s5.ne (s3));
		assert (s9.eq (s5));
		assert (s5.eq (s9));

		p2 = p2.neg();
		p3 = p3.neg();
		p4 = p5.neg();
		p5 = p4.neg();
		p6 = Point (4, 8).neg();
		p7 = s7.toPoint().neg();

		assert (p2.x === -6 && p2.y ===  -6);
		assert (p3.x === -3 && p3.y ===  -9);
		assert (p4.x ===  3 && p4.y ===  -8);
		assert (p5.x === -3 && p5.y ===   8);
		assert (p6.x === -4 && p6.y ===  -8);
		assert (p7.x === -5 && p7.y === -13);

		p3 = Point ( 0, 8);
		p4 = Point (-4, 0);
		s3 = Size  (-4, 0);
		s4 = Size  ( 0, 8);

		var b1 = Bounds ();
		var b2 = Bounds ( 2,  8,  7,  3);
		var b3 = Bounds (-4,  5,  3, -6);
		var b4 = Bounds (-8, -4, -3, -7);
		var b5 = Bounds (p3, s3);
		var b6 = Bounds (p4, s4);
		var b7 = Bounds (20    );
		var b8 = Bounds (20, 40);

		assert (b1.x ===  0 && b1.y ===  0 && b1.w ===  0 && b1.h ===  0);
		assert (b2.x ===  2 && b2.y ===  8 && b2.w ===  7 && b2.h ===  3);
		assert (b3.x === -4 && b3.y ===  5 && b3.w ===  3 && b3.h === -6);
		assert (b4.x === -8 && b4.y === -4 && b4.w === -3 && b4.h === -7);
		assert (b5.x ===  0 && b5.y ===  8 && b5.w === -4 && b5.h ===  0);
		assert (b6.x === -4 && b6.y ===  0 && b6.w ===  0 && b6.h ===  8);
		assert (b7.x === 20 && b7.y === 20 && b7.w === 20 && b7.h === 20);
		assert (b8.x === 20 && b8.y === 20 && b8.w === 40 && b8.h === 40);

		assert ( b1.isZero()); assert ( b1.isEmpty()); assert (!b1.isValid());
		assert (!b2.isZero()); assert (!b2.isEmpty()); assert ( b2.isValid());
		assert (!b3.isZero()); assert (!b3.isEmpty()); assert (!b3.isValid());
		assert (!b4.isZero()); assert (!b4.isEmpty()); assert (!b4.isValid());
		assert (!b5.isZero()); assert (!b5.isEmpty()); assert (!b5.isValid());
		assert (!b6.isZero()); assert (!b6.isEmpty()); assert (!b6.isValid());
		assert (!b7.isZero()); assert (!b7.isEmpty()); assert ( b7.isValid());
		assert (!b8.isZero()); assert (!b8.isEmpty()); assert ( b8.isValid());

		assert (b1.getLeft () ===   0); assert (b1.getTop   () ===   0);
		assert (b1.getRight() ===   0); assert (b1.getBottom() ===   0);
		assert (b2.getLeft () ===   2); assert (b2.getTop   () ===   8);
		assert (b2.getRight() ===   9); assert (b2.getBottom() ===  11);
		assert (b3.getLeft () ===  -4); assert (b3.getTop   () ===   5);
		assert (b3.getRight() ===  -1); assert (b3.getBottom() ===  -1);
		assert (b4.getLeft () ===  -8); assert (b4.getTop   () ===  -4);
		assert (b4.getRight() === -11); assert (b4.getBottom() === -11);
		assert (b5.getLeft () ===   0); assert (b5.getTop   () ===   8);
		assert (b5.getRight() ===  -4); assert (b5.getBottom() ===   8);
		assert (b6.getLeft () ===  -4); assert (b6.getTop   () ===   0);
		assert (b6.getRight() ===  -4); assert (b6.getBottom() ===   8);
		assert (b7.getLeft () ===  20); assert (b7.getTop   () ===  20);
		assert (b7.getRight() ===  40); assert (b7.getBottom() ===  40);
		assert (b8.getLeft () ===  20); assert (b8.getTop   () ===  20);
		assert (b8.getRight() ===  60); assert (b8.getBottom() ===  60);

		assert (b1.getCenter().eq (Point ( 0,  0)));
		assert (b2.getCenter().eq (Point ( 5,  9)));
		assert (b3.getCenter().eq (Point (-3,  2)));
		assert (b4.getCenter().eq (Point (-9, -7)));
		assert (b5.getCenter().eq (Point (-2,  8)));
		assert (b6.getCenter().eq (Point (-4,  4)));
		assert (b7.getCenter().eq (Point (30, 30)));
		assert (b8.getCenter().eq (Point (40, 40)));

		b7.setLTRB (3,  9, 8, 10);
		b8.setLTRB (5, 13, 7,  6);
		assert (!b1.containsBounds (b7)); assert (!b1.intersects (b7));
		assert ( b2.containsBounds (b7)); assert ( b2.intersects (b7));
		assert (!b4.containsBounds (b7)); assert (!b4.intersects (b7));
		assert (!b6.containsBounds (b7)); assert (!b6.intersects (b7));
		assert (!b1.containsBounds (b8)); assert (!b1.intersects (b8));
		assert (!b2.containsBounds (b8)); assert ( b2.intersects (b8));
		assert (!b4.containsBounds (b8)); assert (!b4.intersects (b8));
		assert (!b6.containsBounds (b8)); assert (!b6.intersects (b8));

		assert (b7.unite (b1).eq (Bounds (0, 0, 0, 0))); assert (b7.intersect (b1).eq (Bounds (  3,   9,  5,  1)));
		assert (b8.unite (b1).eq (Bounds (0, 0, 0, 0))); assert (b8.intersect (b1).eq (Bounds (  5,   6,  2,  7)));

		assert (b1.unite (b7).eq (Bounds (0, 0, 0, 0))); assert (b1.intersect (b7).eq (Bounds (  3,   9,  5,  1)));
		assert (b2.unite (b7).eq (Bounds (3, 9, 5, 1))); assert (b2.intersect (b7).eq (Bounds (  2,   8,  7,  3)));
		assert (b4.unite (b7).eq (Bounds (0, 0, 0, 0))); assert (b4.intersect (b7).eq (Bounds (-11, -11, 19, 21)));
		assert (b6.unite (b7).eq (Bounds (0, 0, 0, 0))); assert (b6.intersect (b7).eq (Bounds ( -4,   0, 12, 10)));
		assert (b1.unite (b8).eq (Bounds (0, 0, 0, 0))); assert (b1.intersect (b8).eq (Bounds (  5,   6,  2,  7)));
		assert (b2.unite (b8).eq (Bounds (5, 8, 2, 3))); assert (b2.intersect (b8).eq (Bounds (  2,   6,  7,  7)));
		assert (b4.unite (b8).eq (Bounds (0, 0, 0, 0))); assert (b4.intersect (b8).eq (Bounds (-11, -11, 18, 24)));
		assert (b6.unite (b8).eq (Bounds (0, 0, 0, 0))); assert (b6.intersect (b8).eq (Bounds ( -4,   0, 11, 13)));
		b7.normalize(); assert (b7.eq (Bounds (3, 9, 5, 1)));
		b8.normalize(); assert (b8.eq (Bounds (5, 6, 2, 7)));
		b7 = b7.unite     (b2); assert (b7.eq (Bounds (3, 9, 5, 1)));
		b8 = b8.intersect (b2); assert (b8.eq (Bounds (2, 6, 7, 7)));

		b7.setLTRB (-2, 10, -2, 6);
		b8.setLTRB (-6,  2, -2, 2);
		assert (!b3.containsBounds (b7)); assert (!b3.intersects (b7));
		assert (!b4.containsBounds (b7)); assert (!b4.intersects (b7));
		assert (!b5.containsBounds (b7)); assert ( b5.intersects (b7));
		assert (!b6.containsBounds (b7)); assert (!b6.intersects (b7));
		assert (!b3.containsBounds (b8)); assert ( b3.intersects (b8));
		assert (!b4.containsBounds (b8)); assert (!b4.intersects (b8));
		assert (!b5.containsBounds (b8)); assert (!b5.intersects (b8));
		assert (!b6.containsBounds (b8)); assert ( b6.intersects (b8));

		assert (b3.unite (b7).eq (Bounds ( 0, 0, 0, 0))); assert (b3.intersect (b7).eq (Bounds ( -4,  -1, 3, 11)));
		assert (b4.unite (b7).eq (Bounds ( 0, 0, 0, 0))); assert (b4.intersect (b7).eq (Bounds (-11, -11, 9, 21)));
		assert (b5.unite (b7).eq (Bounds (-2, 8, 0, 0))); assert (b5.intersect (b7).eq (Bounds ( -4,   6, 4,  4)));
		assert (b6.unite (b7).eq (Bounds ( 0, 0, 0, 0))); assert (b6.intersect (b7).eq (Bounds ( -4,   0, 2, 10)));
		assert (b3.unite (b8).eq (Bounds (-4, 2, 2, 0))); assert (b3.intersect (b8).eq (Bounds ( -6,  -1, 5,  6)));
		assert (b4.unite (b8).eq (Bounds ( 0, 0, 0, 0))); assert (b4.intersect (b8).eq (Bounds (-11, -11, 9, 13)));
		assert (b5.unite (b8).eq (Bounds ( 0, 0, 0, 0))); assert (b5.intersect (b8).eq (Bounds ( -6,   2, 6,  6)));
		assert (b6.unite (b8).eq (Bounds (-4, 2, 0, 0))); assert (b6.intersect (b8).eq (Bounds ( -6,   0, 4,  8)));
		b7.normalize(); assert (b7.eq (Bounds (-2, 6, 0, 4)));
		b8.normalize(); assert (b8.eq (Bounds (-6, 2, 4, 0)));
		b7 = b7.intersect (b3); assert (b7.eq (Bounds (-4, -1, 3, 11)));
		b8 = b8.unite     (b3); assert (b8.eq (Bounds (-4,  2, 2,  0)));

		b7 = Bounds (-2, 1, -1, -1);
		b8 = Bounds (-3, 3, -2,  1);
		assert (!b1.containsBounds (b7)); assert (!b1.intersects (b7));
		assert (!b2.containsBounds (b7)); assert (!b2.intersects (b7));
		assert ( b3.containsBounds (b7)); assert ( b3.intersects (b7));
		assert (!b6.containsBounds (b7)); assert (!b6.intersects (b7));
		assert (!b1.containsBounds (b8)); assert (!b1.intersects (b8));
		assert (!b2.containsBounds (b8)); assert (!b2.intersects (b8));
		assert (!b3.containsBounds (b8)); assert ( b3.intersects (b8));
		assert (!b6.containsBounds (b8)); assert ( b6.intersects (b8));

		assert (b1.unite (b7).eq (Bounds ( 0, 0, 0, 0))); assert (b1.intersect (b7).eq (Bounds (-3,  0,  1,  1)));
		assert (b2.unite (b7).eq (Bounds ( 0, 0, 0, 0))); assert (b2.intersect (b7).eq (Bounds (-3,  0, 12, 11)));
		assert (b3.unite (b7).eq (Bounds (-3, 0, 1, 1))); assert (b3.intersect (b7).eq (Bounds (-4, -1,  3,  6)));
		assert (b6.unite (b7).eq (Bounds ( 0, 0, 0, 0))); assert (b6.intersect (b7).eq (Bounds (-4,  0,  2,  8)));
		assert (b1.unite (b8).eq (Bounds ( 0, 0, 0, 0))); assert (b1.intersect (b8).eq (Bounds (-5,  3,  2,  1)));
		assert (b2.unite (b8).eq (Bounds ( 0, 0, 0, 0))); assert (b2.intersect (b8).eq (Bounds (-5,  3, 14,  8)));
		assert (b3.unite (b8).eq (Bounds (-4, 3, 1, 1))); assert (b3.intersect (b8).eq (Bounds (-5, -1,  4,  6)));
		assert (b6.unite (b8).eq (Bounds (-4, 3, 0, 1))); assert (b6.intersect (b8).eq (Bounds (-5,  0,  2,  8)));
		b7.normalize(); assert (b7.eq (Bounds (-3, 0, 1, 1)));
		b8.normalize(); assert (b8.eq (Bounds (-5, 3, 2, 1)));
		b7 = b7.unite     (b3); assert (b7.eq (Bounds (-3,  0, 1, 1)));
		b8 = b8.intersect (b3); assert (b8.eq (Bounds (-5, -1, 4, 6)));

		b7 = Bounds (-11, -9, 2,  2);
		b8 = Bounds ( -8, -5, 2, -2);
		assert ( b4.containsBounds (b7,  true)); assert ( b4.intersects (b7,  true));
		assert (!b4.containsBounds (b8,  true)); assert ( b4.intersects (b8,  true));
		assert (!b4.containsBounds (b7, false)); assert ( b4.intersects (b7, false));
		assert (!b4.containsBounds (b8, false)); assert (!b4.intersects (b8, false));
		assert (b4.unite (b7).eq (Bounds (-11, -9, 2, 2))); assert (b4.intersect (b7).eq (Bounds (-11, -11, 3, 7)));
		assert (b4.unite (b8).eq (Bounds ( -8, -7, 0, 2))); assert (b4.intersect (b8).eq (Bounds (-11, -11, 5, 7)));
		b7.normalize(); assert (b7.eq (Bounds (-11, -9, 2, 2)));
		b8.normalize(); assert (b8.eq (Bounds ( -8, -7, 2, 2)));
		b7 = b7.intersect (b4); assert (b7.eq (Bounds (-11, -11, 3, 7)));
		b8 = b8.unite     (b4); assert (b8.eq (Bounds ( -8,  -7, 0, 2)));

		b7 = Bounds (-8, -10,  0, 1);
		b8 = Bounds (-9,  -4, -1, 0);
		assert ( b4.containsBounds (b7,  true)); assert ( b4.intersects (b7,  true));
		assert ( b4.containsBounds (b8,  true)); assert ( b4.intersects (b8,  true));
		assert (!b4.containsBounds (b7, false)); assert (!b4.intersects (b7, false));
		assert (!b4.containsBounds (b8, false)); assert (!b4.intersects (b8, false));
		assert (b4.unite (b7).eq (Bounds ( -8, -10, 0, 1))); assert (b4.intersect (b7).eq (Bounds (-11, -11, 3, 7)));
		assert (b4.unite (b8).eq (Bounds (-10,  -4, 1, 0))); assert (b4.intersect (b8).eq (Bounds (-11, -11, 3, 7)));
		b7.normalize(); assert (b7.eq (Bounds ( -8, -10, 0, 1)));
		b8.normalize(); assert (b8.eq (Bounds (-10,  -4, 1, 0)));
		b7 = b7.unite     (b4); assert (b7.eq (Bounds ( -8, -10, 0, 1)));
		b8 = b8.intersect (b4); assert (b8.eq (Bounds (-11, -11, 3, 7)));

		b7 = Bounds (-1, 8, -1,  0);
		b8 = Bounds (-4, 8,  0, -2);
		assert ( b5.containsBounds (b7,  true)); assert ( b5.intersects (b7,  true));
		assert (!b6.containsBounds (b7,  true)); assert (!b6.intersects (b7,  true));
		assert (!b5.containsBounds (b8,  true)); assert ( b5.intersects (b8,  true));
		assert ( b6.containsBounds (b8,  true)); assert ( b6.intersects (b8,  true));
		assert (!b5.containsBounds (b7, false)); assert (!b5.intersects (b7, false));
		assert (!b6.containsBounds (b7, false)); assert (!b6.intersects (b7, false));
		assert (!b5.containsBounds (b8, false)); assert (!b5.intersects (b8, false));
		assert (!b6.containsBounds (b8, false)); assert (!b6.intersects (b8, false));
		assert (b5.unite (b7).eq (Bounds (-2, 8, 1, 0))); assert (b5.intersect (b7).eq (Bounds (-4, 8, 4, 0)));
		assert (b6.unite (b7).eq (Bounds ( 0, 0, 0, 0))); assert (b6.intersect (b7).eq (Bounds (-4, 0, 3, 8)));
		assert (b5.unite (b8).eq (Bounds (-4, 8, 0, 0))); assert (b5.intersect (b8).eq (Bounds (-4, 6, 4, 2)));
		assert (b6.unite (b8).eq (Bounds (-4, 6, 0, 2))); assert (b6.intersect (b8).eq (Bounds (-4, 0, 0, 8)));
		b7.normalize(); assert (b7.eq (Bounds (-2, 8, 1, 0)));
		b8.normalize(); assert (b8.eq (Bounds (-4, 6, 0, 2)));
		b7 = b7.intersect (b6); assert (b7.eq (Bounds (-4, 0, 3, 8)));
		b8 = b8.unite     (b6); assert (b8.eq (Bounds (-4, 6, 0, 2)));

		b1.setLeft (4); b2.setTop (-6); b3.setRight (7); b4.setBottom (-2);
		b5.setLeft (8); b5.setTop (-2); b6.setRight (6); b6.setBottom (-3);

		assert (b1.x ===  4 && b1.y ===  0 && b1.w ===  0 && b1.h ===  0);
		assert (b2.x ===  2 && b2.y === -6 && b2.w ===  7 && b2.h ===  3);
		assert (b3.x === -4 && b3.y ===  5 && b3.w === 11 && b3.h === -6);
		assert (b4.x === -8 && b4.y === -4 && b4.w === -3 && b4.h ===  2);
		assert (b5.x ===  8 && b5.y === -2 && b5.w === -4 && b5.h ===  0);
		assert (b6.x === -4 && b6.y ===  0 && b6.w === 10 && b6.h === -3);

		b1.setLTRB (-6, 8, 4, -2);
		b2.setLTRB (-5, 9, 3, -3);

		assert (b1.eq (Bounds (b1.getLTRB())));
		assert (b2.eq (Bounds (b2.getLTRB())));
		assert (b1.x === -6 && b1.y ===  8 && b1.w === 10 && b1.h === -10);
		assert (b2.x === -5 && b2.y ===  9 && b2.w ===  8 && b2.h === -12);

		p1 = Point (-6, 12);
		p2 = Point ( 3,  4);
		p3 = Point ( 8,  3);
		p4 = Point (-5,  3);
		p5 = Point (-2,  8);
		p6 = Point (-3, -3);

		assert (!b1.containsPoint (-7,  3));
		assert ( b1.containsPoint (-6,  3));
		assert ( b1.containsPoint (-5,  3));
		assert ( b1.containsPoint ( 3,  3));
		assert ( b1.containsPoint ( 4,  3));
		assert (!b1.containsPoint ( 5,  3));
		assert ( b1.containsPoint ( 0,  7));
		assert ( b1.containsPoint ( 0,  8));
		assert (!b1.containsPoint ( 0,  9));
		assert (!b1.containsPoint ( 0, -3));
		assert ( b1.containsPoint ( 0, -2));
		assert ( b1.containsPoint ( 0, -1));

		assert (!b2.containsPoint (p1));
		assert ( b2.containsPoint (p2));
		assert (!b2.containsPoint (p3));
		assert ( b2.containsPoint (p4));
		assert ( b2.containsPoint (p5));
		assert ( b2.containsPoint (p6));

		assert (!b1.containsPoint (-7,  3, false));
		assert (!b1.containsPoint (-6,  3, false));
		assert ( b1.containsPoint (-5,  3, false));
		assert ( b1.containsPoint ( 3,  3, false));
		assert (!b1.containsPoint ( 4,  3, false));
		assert (!b1.containsPoint ( 5,  3, false));
		assert ( b1.containsPoint ( 0,  7, false));
		assert (!b1.containsPoint ( 0,  8, false));
		assert (!b1.containsPoint ( 0,  9, false));
		assert (!b1.containsPoint ( 0, -3, false));
		assert (!b1.containsPoint ( 0, -2, false));
		assert ( b1.containsPoint ( 0, -1, false));

		assert (!b2.containsPoint (p1, false));
		assert (!b2.containsPoint (p2, false));
		assert (!b2.containsPoint (p3, false));
		assert (!b2.containsPoint (p4, false));
		assert ( b2.containsPoint (p5, false));
		assert (!b2.containsPoint (p6, false));

		b1.setPoint ( 2,  8);
		b2.setPoint ( 7,  3);
		b3.setPoint (-8, -4);
		b4.setPoint (Point ( 7,  3));
		b5.setPoint (Point ( 7,  3));
		b6.setPoint (Point (-3, -7));

		b1.setSize ( 2,  8);
		b2.setSize ( 3, -6);
		b3.setSize (-3, -7);
		b4.setSize (Size ( 2,  8));
		b5.setSize (Size ( 2,  8));
		b6.setSize (Size (-8, -4));

		assert (b1.getPoint().x ===  2 && b1.getPoint().y ===  8);
		assert (b2.getPoint().x ===  7 && b2.getPoint().y ===  3);
		assert (b3.getPoint().x === -8 && b3.getPoint().y === -4);
		assert (b4.getPoint().x ===  7 && b4.getPoint().y ===  3);
		assert (b5.getPoint().x ===  7 && b5.getPoint().y ===  3);
		assert (b6.getPoint().x === -3 && b6.getPoint().y === -7);

		assert (b1.getSize().w ===  2 && b1.getSize().h ===  8);
		assert (b2.getSize().w ===  3 && b2.getSize().h === -6);
		assert (b3.getSize().w === -3 && b3.getSize().h === -7);
		assert (b4.getSize().w ===  2 && b4.getSize().h ===  8);
		assert (b5.getSize().w ===  2 && b5.getSize().h ===  8);
		assert (b6.getSize().w === -8 && b6.getSize().h === -4);

		assert ( b1.eq (b1));
		assert (!b1.eq (b2));
		assert (!b1.ne (b1));
		assert ( b1.ne (b2));

		assert (b6.ne (b2));
		assert (b2.ne (b6));
		assert (b4.eq (b5));
		assert (b5.eq (b4));
		assert (b4.ne (b2));
		assert (b2.ne (b4));
		assert (b5.ne (b1));
		assert (b1.ne (b5));

		//----------------------------------------------------------------------------//

		p2 = Point (p3);
		p3 = Point ({ x:  2, y:  8 });
		p4 = Point ({ x: -6, y: -4 });
		p5 = Point (p3);

		assert (p2.x ===  8 && p2.y ===  3);
		assert (p3.x ===  2 && p3.y ===  8);
		assert (p4.x === -6 && p4.y === -4);
		assert (p5.x ===  2 && p5.y ===  8);

		assert (p3.ne (  ));
		assert (p3.eq (p3));
		assert (p3.ne ( 2));
		assert (p3.eq ( 2, 8));
		assert (p3.eq ({ x:  2, y:  8 }));

		assert (p4.ne (  ));
		assert (p4.eq (p4));
		assert (p4.ne (-4));
		assert (p4.eq (-6, -4));
		assert (p4.eq ({ x: -6, y: -4 }));

		assert (p1.eq, p1, ["a"]);
		assert (p1.ne, p1, ["a"]);

		assert (p1.eq, p1, [{ x: 0 }]);
		assert (p1.ne, p1, [{ y: 0 }]);

		s2 = Size (s3);
		s3 = Size ({ w:  2, h:  8 });
		s4 = Size ({ w: -6, h: -4 });
		s5 = Size (s3);

		assert (s2.w === -4 && s2.h ===  0);
		assert (s3.w ===  2 && s3.h ===  8);
		assert (s4.w === -6 && s4.h === -4);
		assert (s5.w ===  2 && s5.h ===  8);

		assert (s3.ne (  ));
		assert (s3.eq (s3));
		assert (s3.ne ( 2));
		assert (s3.eq ( 2, 8));
		assert (s3.eq ({ w:  2, h:  8 }));

		assert (s4.ne (  ));
		assert (s4.eq (s4));
		assert (s4.ne (-4));
		assert (s4.eq (-6, -4));
		assert (s4.eq ({ w: -6, h: -4 }));

		assert (s1.eq, s1, ["a"]);
		assert (s1.ne, s1, ["a"]);

		assert (s1.eq, s1, [{ w: 0 }]);
		assert (s1.ne, s1, [{ h: 0 }]);

		b2 = Bounds (b3);
		b3 = Bounds ({ l: 2, t: 4,     r: 6, b: 8 });
		b4 = Bounds ({ x: 8, y: 6 }, { w: 4, h: 2 });
		b5 = Bounds ({ x: 2, y: 4,     w: 6, h: 8 });
		b6 = Bounds (b3);

		assert (b2.x === -8 && b2.y === -4 && b2.w === -3 && b2.h === -7);
		assert (b3.x ===  2 && b3.y ===  4 && b3.w ===  4 && b3.h ===  4);
		assert (b4.x ===  8 && b4.y ===  6 && b4.w ===  4 && b4.h ===  2);
		assert (b5.x ===  2 && b5.y ===  4 && b5.w ===  6 && b5.h ===  8);
		assert (b6.x ===  2 && b6.y ===  4 && b6.w ===  4 && b6.h ===  4);

		p1 = Point (2, 4);
		s1 = Size  (4, 4);
		assert (b3.ne (  ));
		assert (b3.eq (b3));
		assert (b3.ne ( 2));
		assert (b3.ne ( 2,  4));
		assert (b3.eq (p1, s1));
		assert (b3.eq (     2,    4,        4,    4  ));
		assert (b3.eq ({ l: 2, t: 4,     r: 6, b: 8 }));
		assert (b3.eq ({ x: 2, y: 4 }, { w: 4, h: 4 }));
		assert (b3.eq ({ x: 2, y: 4,     w: 4, h: 4 }));

		p1 = Point (8, 6);
		s1 = Size  (4, 2);
		assert (b4.ne (  ));
		assert (b4.eq (b4));
		assert (b4.ne ( 8));
		assert (b4.ne ( 8,  2));
		assert (b4.eq (p1, s1));
		assert (b4.eq (     8,    6,         4,    2  ));
		assert (b4.eq ({ l: 8, t: 6,     r: 12, b: 8 }));
		assert (b4.eq ({ x: 8, y: 6 }, { w:  4, h: 2 }));
		assert (b4.eq ({ x: 8, y: 6,     w:  4, h: 2 }));

		assert (b1.setLeft,   b1, [   ]);
		assert (b1.setLeft,   b1, ["a"]);
		assert (b1.setTop,    b1, [   ]);
		assert (b1.setTop,    b1, ["a"]);
		assert (b1.setRight,  b1, [   ]);
		assert (b1.setRight,  b1, ["a"]);
		assert (b1.setBottom, b1, [   ]);
		assert (b1.setBottom, b1, ["a"]);
		assert (b1.setLTRB,   b1, [   ]);
		assert (b1.setLTRB,   b1, ["a"]);
		assert (b1.setLTRB,   b1, [100, "a"]);

		assert (b1.containsPoint,  b1, ["a"]);
		assert (b1.containsBounds, b1, ["a"]);
		assert (b1.intersects,     b1, ["a"]);
		assert (b1.setPoint,       b1, ["a"]);
		assert (b1.setSize,        b1, ["a"]);
		assert (b1.unite,          b1, ["a"]);
		assert (b1.intersect,      b1, ["a"]);

		assert (b1.containsPoint,  b1, [{ x: 0 }]);
		assert (b1.containsBounds, b1, [{ x: 0 }]);
		assert (b1.intersects,     b1, [{ x: 0 }]);
		assert (b1.setPoint,       b1, [{ x: 0 }]);
		assert (b1.setSize,        b1, [{ x: 0 }]);
		assert (b1.unite,          b1, [{ x: 0 }]);
		assert (b1.intersect,      b1, [{ x: 0 }]);

		assert (b1.eq, b1, ["a"]);
		assert (b1.ne, b1, ["a"]);

		assert (b1.eq, b1, [{ x: 0 }]);
		assert (b1.ne, b1, [{ y: 0 }]);
		assert (b1.eq, b1, [{ w: 0 }]);
		assert (b1.ne, b1, [{ h: 0 }]);

		return true;
	}



	//----------------------------------------------------------------------------//
	// Main                                                                       //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	return function()
	{
		log ("BEGIN TYPES TESTING\n------------------------------\n");
		if (!testHash  ()) { log (">> Hash Failed  \n\n"); return false; }
		if (!testColor ()) { log (">> Color Failed \n\n"); return false; }
		if (!testImage1()) { log (">> Image1 Failed\n\n"); return false; }
		if (!testImage2()) { log (">> Image2 Failed\n\n"); return false; }
		if (!testRange ()) { log (">> Range Failed \n\n"); return false; }
		if (!testBounds()) { log (">> Bounds Failed\n\n"); return false; }
		log (">> Success\n\n"); return true;
	};
};
