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

module.exports = function (robot, log, sprintf, getline, assert)
{
	//----------------------------------------------------------------------------//
	// Locals                                                                     //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	var Module  = robot.Module;
	var Memory  = robot.Memory;
	var Process = robot.Process;



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function TEST_INVALID_RW (mem, address)
	{
		var data = Buffer (1);
		assert (mem. readData (address, data, 0) === 0);
		assert (mem. readData (address, data, 1) === 0);

		assert (mem.writeData (address, data, 0) === 0);
		assert (mem.writeData (address, data, 1) === 0);
	}

	////////////////////////////////////////////////////////////////////////////////

	function testInvalid()
	{
		var mod = Module(); assert (!mod.isValid());
		var mem = Memory(); assert (!mem.isValid());
		assert (mod.getProcess().eq (Process()));
		assert (mem.getProcess().eq (Process()));

		assert ( mod.getName    () === "");
		assert ( mod.getPath    () === "");
		assert ( mod.getBase    () ===  0);
		assert ( mod.getSize    () ===  0);
		assert (!mod.getSegments().length);

		var p = Process( ); assert (!  p.isValid());
		  mem = Memory (p); assert (!mem.isValid());
		assert (mem.getProcess().eq (p));

		assert (!p.isDebugged()       );
		assert (!p.getModules().length);

		var stats = mem.getStats();
		assert (stats.systemReads  === 0);
		assert (stats.cachedReads  === 0);
		assert (stats.systemWrites === 0);
		assert (stats.accessWrites === 0);
		assert (stats.readErrors   === 0);
		assert (stats.writeErrors  === 0);

		assert (!mem.getRegion (0).valid);
		assert (!mem.getRegion (1).valid);
		assert (!mem.getRegion (mem.getMinAddress()-1).valid);
		assert (!mem.getRegion (mem.getMinAddress()  ).valid);
		assert (!mem.getRegion (mem.getMinAddress()+1).valid);
		assert (!mem.getRegion (mem.getMaxAddress()-1).valid);
		assert (!mem.getRegion (mem.getMaxAddress()  ).valid);
		assert (!mem.getRegion (mem.getMaxAddress()+1).valid);

		assert (!mem.getRegions().length);

		var region = Memory.Region();
		assert (!mem.setAccess (region, 0));
		assert (!mem.setAccess (region, 1));
		assert (!mem.setAccess (region,
				 false, false, false));

		region.valid = true;
		assert (!mem.setAccess (region, 0));
		assert (!mem.setAccess (region, 1));
		assert (!mem.setAccess (region,
				 false, false, false));

		region.bound = true;
		assert (!mem.setAccess (region, 0));
		assert (!mem.setAccess (region, 1));
		assert (!mem.setAccess (region,
				 false, false, false));

		assert (!mem.find ("  ").length);

		TEST_INVALID_RW (mem, 0);
		TEST_INVALID_RW (mem, 1);

		TEST_INVALID_RW (mem, mem.getMinAddress()-1);
		TEST_INVALID_RW (mem, mem.getMinAddress()  );
		TEST_INVALID_RW (mem, mem.getMinAddress()+1);

		TEST_INVALID_RW (mem, mem.getMaxAddress()-1);
		TEST_INVALID_RW (mem, mem.getMaxAddress()  );
		TEST_INVALID_RW (mem, mem.getMaxAddress()+1);

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testEquals()
	{
		{
			var module1 = Module();
			var module2 = Module();

			assert (module1.eq (module1)); assert (module1.eq (module2));
			assert (module2.eq (module2)); assert (module2.eq (module1));

			module1 = Module (Process(), "", "", 0, 0);
			assert (module1.eq (module1)); assert (module1.ne (module2));
			assert (module2.eq (module2)); assert (module2.ne (module1));

			module2 = Module (Process(), "", "", 0, 0);
			assert (module1.eq (module1)); assert (module1.eq (module2));
			assert (module2.eq (module2)); assert (module2.eq (module1));

			module1 = Module (Process(), "", "", 3, 0); assert (module1.ne (module2));
			module2 = Module (Process(), "", "", 3, 0); assert (module1.eq (module2));
			module1 = Module (Process(), "", "", 0, 4); assert (module1.ne (module2));
			module2 = Module (Process(), "", "", 0, 4); assert (module1.eq (module2));

			module1 = Module (Process.getCurrent(), "", "", 0, 0); assert (module1.ne (module2));
			module2 = Module (Process.getCurrent(), "", "", 0, 0); assert (module1.eq (module2));

			assert (!module1.getSegments().length);
			assert (!module2.getSegments().length);

			module1 = Module (Process(), "", "", 5, 0);
			module2 = Module (Process(), "", "", 5, 0);
			assert (!module1.lt (module2)); assert (!module1.lt (module2.getBase()));
			assert (!module1.gt (module2)); assert (!module1.gt (module2.getBase()));
			assert ( module1.le (module2)); assert ( module1.le (module2.getBase()));
			assert ( module1.ge (module2)); assert ( module1.ge (module2.getBase()));

			module1 = Module (Process(), "", "", 4, 0);
			assert ( module1.lt (module2)); assert ( module1.lt (module2.getBase()));
			assert (!module1.gt (module2)); assert (!module1.gt (module2.getBase()));
			assert ( module1.le (module2)); assert ( module1.le (module2.getBase()));
			assert (!module1.ge (module2)); assert (!module1.ge (module2.getBase()));

			module1 = Module (Process(), "", "", 6, 0);
			assert (!module1.lt (module2)); assert (!module1.lt (module2.getBase()));
			assert ( module1.gt (module2)); assert ( module1.gt (module2.getBase()));
			assert (!module1.le (module2)); assert (!module1.le (module2.getBase()));
			assert ( module1.ge (module2)); assert ( module1.ge (module2.getBase()));

			module1 = Module (Process(), "", "", 1000, 1000);
			assert (!module1.contains ( 999));
			assert ( module1.contains (1000));
			assert ( module1.contains (1001));
			assert ( module1.contains (1999));
			assert (!module1.contains (2000));
			assert (!module1.contains (2001));
		}

		//----------------------------------------------------------------------------//

		{
			var segment1 = Module.Segment();
			var segment2 = Module.Segment();

			segment1.valid = segment2.valid = true;
			segment1.base  = segment2.base  = 1;
			segment1.size  = segment2.size  = 2;
			segment1.name  = segment2.name  = "z";

			assert (segment1.eq (segment1)); assert (segment1.eq (segment2));
			assert (segment2.eq (segment2)); assert (segment2.eq (segment1));

			segment1.valid = false; assert (segment1.ne (segment2));
			segment2.valid = false; assert (segment1.eq (segment2));
			segment1.base  = 0;     assert (segment1.ne (segment2));
			segment2.base  = 0;     assert (segment1.eq (segment2));
			segment2.size  = 0;     assert (segment2.ne (segment1));
			segment1.size  = 0;     assert (segment2.eq (segment1));

			segment1.name  = "a";   assert (segment1.ne (segment2));
			segment2.name  = "a";   assert (segment1.eq (segment2));
			segment2.name  = "b";   assert (segment2.ne (segment1));
			segment1.name  = "b";   assert (segment2.eq (segment1));
			segment1.name  = "c";   assert (segment1.ne (segment2));
			segment2.name  = "c";   assert (segment1.eq (segment2));

			segment1.base = 5;
			segment2.base = 5;
			assert (!segment1.lt (segment2)); assert (!segment1.lt (segment2.base));
			assert (!segment1.gt (segment2)); assert (!segment1.gt (segment2.base));
			assert ( segment1.le (segment2)); assert ( segment1.le (segment2.base));
			assert ( segment1.ge (segment2)); assert ( segment1.ge (segment2.base));

			segment1.base = 4;
			assert ( segment1.lt (segment2)); assert ( segment1.lt (segment2.base));
			assert (!segment1.gt (segment2)); assert (!segment1.gt (segment2.base));
			assert ( segment1.le (segment2)); assert ( segment1.le (segment2.base));
			assert (!segment1.ge (segment2)); assert (!segment1.ge (segment2.base));

			segment1.base = 6;
			assert (!segment1.lt (segment2)); assert (!segment1.lt (segment2.base));
			assert ( segment1.gt (segment2)); assert ( segment1.gt (segment2.base));
			assert (!segment1.le (segment2)); assert (!segment1.le (segment2.base));
			assert ( segment1.ge (segment2)); assert ( segment1.ge (segment2.base));

			segment1.base = 1000;
			segment1.size = 1000;
			assert (!segment1.contains ( 999));
			assert ( segment1.contains (1000));
			assert ( segment1.contains (1001));
			assert ( segment1.contains (1999));
			assert (!segment1.contains (2000));
			assert (!segment1.contains (2001));
		}

		//----------------------------------------------------------------------------//

		{
			var stats1 = Memory.Stats();
			var stats2 = Memory.Stats();

			stats1.systemReads  = stats2.systemReads  = 1;
			stats1.cachedReads  = stats2.cachedReads  = 2;
			stats1.systemWrites = stats2.systemWrites = 3;
			stats1.accessWrites = stats2.accessWrites = 4;

			stats1. readErrors  = stats2. readErrors  = 5;
			stats1.writeErrors  = stats2.writeErrors  = 6;

			assert (stats1.eq (stats1)); assert (stats1.eq (stats2));
			assert (stats2.eq (stats2)); assert (stats2.eq (stats1));

			stats1.systemReads  = 0; assert (stats1.ne (stats2));
			stats2.systemReads  = 0; assert (stats1.eq (stats2));
			stats2.cachedReads  = 0; assert (stats2.ne (stats1));
			stats1.cachedReads  = 0; assert (stats2.eq (stats1));
			stats1.systemWrites = 0; assert (stats1.ne (stats2));
			stats2.systemWrites = 0; assert (stats1.eq (stats2));
			stats2.accessWrites = 0; assert (stats2.ne (stats1));
			stats1.accessWrites = 0; assert (stats2.eq (stats1));

			stats1. readErrors  = 0; assert (stats1.ne (stats2));
			stats2. readErrors  = 0; assert (stats1.eq (stats2));
			stats2.writeErrors  = 0; assert (stats2.ne (stats1));
			stats1.writeErrors  = 0; assert (stats2.eq (stats1));
		}

		//----------------------------------------------------------------------------//

		{
			var region1 = Memory.Region();
			var region2 = Memory.Region();

			region1.valid      = region2.valid      = true;
			region1.bound      = region2.bound      = true;

			region1.start      = region2.start      = 1;
			region1.stop       = region2.stop       = 2;
			region1.size       = region2.size       = 3;

			region1.readable   = region2.readable   = true;
			region1.writable   = region2.writable   = true;
			region1.executable = region2.executable = true;
			region1.access     = region2.access     = 4;

			region1.private    = region2.private    = true;
			region1.guarded    = region2.guarded    = true;

			assert (region1.eq (region1)); assert (region1.eq (region2));
			assert (region2.eq (region2)); assert (region2.eq (region1));

			region1.valid      = false; assert (region1.ne (region2));
			region2.valid      = false; assert (region1.eq (region2));
			region1.bound      = false; assert (region1.ne (region2));
			region2.bound      = false; assert (region1.eq (region2));

			region1.start      = 0;     assert (region1.ne (region2));
			region2.start      = 0;     assert (region1.eq (region2));
			region1.stop       = 0;     assert (region1.ne (region2));
			region2.stop       = 0;     assert (region1.eq (region2));
			region2.size       = 0;     assert (region2.ne (region1));
			region1.size       = 0;     assert (region2.eq (region1));

			region1.readable   = false; assert (region1.ne (region2));
			region2.readable   = false; assert (region1.eq (region2));
			region2.writable   = false; assert (region2.ne (region1));
			region1.writable   = false; assert (region2.eq (region1));
			region1.executable = false; assert (region1.ne (region2));
			region2.executable = false; assert (region1.eq (region2));
			region2.access     = 0;     assert (region2.ne (region1));
			region1.access     = 0;     assert (region2.eq (region1));

			region1.private    = false; assert (region1.ne (region2));
			region2.private    = false; assert (region1.eq (region2));
			region2.guarded    = false; assert (region2.ne (region1));
			region1.guarded    = false; assert (region2.eq (region1));

			region1.start = 5;
			region2.start = 5;
			assert (!region1.lt (region2)); assert (!region1.lt (region2.start));
			assert (!region1.gt (region2)); assert (!region1.gt (region2.start));
			assert ( region1.le (region2)); assert ( region1.le (region2.start));
			assert ( region1.ge (region2)); assert ( region1.ge (region2.start));

			region1.start = 4;
			assert ( region1.lt (region2)); assert ( region1.lt (region2.start));
			assert (!region1.gt (region2)); assert (!region1.gt (region2.start));
			assert ( region1.le (region2)); assert ( region1.le (region2.start));
			assert (!region1.ge (region2)); assert (!region1.ge (region2.start));

			region1.start = 6;
			assert (!region1.lt (region2)); assert (!region1.lt (region2.start));
			assert ( region1.gt (region2)); assert ( region1.gt (region2.start));
			assert (!region1.le (region2)); assert (!region1.le (region2.start));
			assert ( region1.ge (region2)); assert ( region1.ge (region2.start));

			region1.start = 1000;
			region1.stop  = 2000;
			assert (!region1.contains ( 999));
			assert ( region1.contains (1000));
			assert ( region1.contains (1001));
			assert ( region1.contains (1999));
			assert (!region1.contains (2000));
			assert (!region1.contains (2001));
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testParams()
	{
		// Perform parameter tests
		var p = Process.getCurrent();

		if (process.arch === "x64")
		{
			assert ( p.isValid());
			assert ( p.is64Bit());
		}

		else
		{
			assert ( p.isValid());
			assert (!p.is64Bit());
		}

		var m = Memory (p);
		assert (m.isValid());
		assert (m.getProcess().eq (p));

		log ("Please verify the following\n");
		log ("Min VM: 0x" + m.getMinAddress().toString (16).toUpperCase() + "\n"  );
		log ("Max VM: 0x" + m.getMaxAddress().toString (16).toUpperCase() + "\n"  );
		log ("PgSize: 0x" + m.getPageSize  ().toString (16).toUpperCase() + "\n\n");

		//----------------------------------------------------------------------------//

		assert (!m.getRegion (0).valid);
		assert (!m.getRegion (1).valid);
		assert (!m.getRegion (m.getMinAddress()-1).valid);
		assert (!m.getRegion (m.getMaxAddress()  ).valid);
		assert (!m.getRegion (m.getMaxAddress()+1).valid);

		var region = Memory.Region();
		assert (!m.setAccess (region, 0));
		assert (!m.setAccess (region, 1));
		assert (!m.setAccess (region,
				false, false, false));

		region.valid = true;
		assert (!m.setAccess (region, 0));
		assert (!m.setAccess (region, 1));
		assert (!m.setAccess (region,
				false, false, false));

		//----------------------------------------------------------------------------//

		assert (!m.find ("  ").length);
		assert (!m.find (""  ).length);

		assert (!m.find ("0" ).length);
		assert (!m.find ("X" ).length);
		assert (!m.find ("X0").length);
		assert (!m.find ("0X").length);
		assert (!m.find ("?0").length);
		assert (!m.find ("0?").length);

		assert (!m.find ("?? 0" ).length);
		assert (!m.find ("00 X" ).length);
		assert (!m.find ("0 00" ).length);
		assert (!m.find ("X ??" ).length);
		assert (!m.find ("00 X0").length);
		assert (!m.find ("?? 0X").length);
		assert (!m.find ("?? ?0").length);
		assert (!m.find ("00 0?").length);
		assert (!m.find ("X0 ??").length);
		assert (!m.find ("0X 00").length);
		assert (!m.find ("?0 00").length);
		assert (!m.find ("0? ??").length);

		assert (!m.getRegions (0x100000, 0xFFFFF).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF).length);

		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, ""    ).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, " "   ).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "-"   ).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "?"   ).length);

		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "r"   ).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "w"   ).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "x"   ).length);

		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "Ww"  ).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "-x"  ).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, " p"  ).length);

		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "W x" ).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "-Xp" ).length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, " -g" ).length);

		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "W -p").length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "-X g").length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, " -Py").length);

		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "    abc").length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "----xyz").length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "wxpg123").length);
		assert (!m.find ("00", 0x100000, 0xFFFFF, 0, "WXPG123").length);

		//----------------------------------------------------------------------------//

		assert (!m.isCaching()); assert (m.getCacheSize() === 0);

		assert (!m.createCache (    0,    0,     0));
		assert (!m.createCache (12288,    0,     0));
		assert (!m.createCache (12287,    0,     0));
		assert (!m.createCache (    0, 4096,     0));
		assert (!m.createCache (12288, 4096,     0));
		assert (!m.createCache (12287, 4096,     0));
		assert (!m.createCache (    0, 4095,     0));
		assert (!m.createCache (12288, 4095,     0));
		assert (!m.createCache (12287, 4095,     0));

		assert (!m.createCache (    0,    0, 65536));
		assert (!m.createCache (12288,    0, 65536));
		assert (!m.createCache (12287,    0, 65536));
		assert (!m.createCache (    0, 4096, 65536));
		assert ( m.createCache (16384, 4096, 65536));
		assert (!m.createCache (12288, 4096, 65536));
		assert (!m.createCache (12287, 4096, 65536));
		assert (!m.createCache (    0, 4095, 65536));
		assert (!m.createCache (12288, 4095, 65536));
		assert (!m.createCache (12287, 4095, 65536));

		assert (!m.createCache (    0,    0, 65535));
		assert (!m.createCache (12288,    0, 65535));
		assert (!m.createCache (12287,    0, 65535));
		assert (!m.createCache (    0, 4096, 65535));
		assert (!m.createCache (12288, 4096, 65535));
		assert (!m.createCache (12287, 4096, 65535));
		assert (!m.createCache (    0, 4095, 65535));
		assert (!m.createCache (12288, 4095, 65535));
		assert (!m.createCache (12287, 4095, 65535));

		assert (!m.createCache (    0,    0, 12288));
		assert (!m.createCache (12288,    0, 12288));
		assert (!m.createCache (12287,    0, 12288));
		assert (!m.createCache (    0, 4096, 12288));
		assert (!m.createCache (12288, 4096, 12288));
		assert (!m.createCache (12287, 4096, 12288));
		assert (!m.createCache (    0, 4095, 12288));
		assert (!m.createCache (12288, 4095, 12288));
		assert (!m.createCache (12287, 4095, 12288));

		assert ( m.createCache (16384, 4096, 65536, 65536, 524288));
		assert (!m.createCache (12288, 4096, 65536, 65536, 524288));
		assert (!m.createCache (12288, 4096, 65536, 65536, 524287));
		assert (!m.createCache (12288, 4096, 65536, 65535, 524288));
		assert (!m.createCache (12288, 4096, 65536, 65535, 524287));

		assert (!m.createCache (4096, 12288, 65536, 0, 0));

		assert ( m.createCache (16384, 4096, 65536, 65536));
		assert ( m.createCache (16384, 4096, 65536, 20480));
		assert (!m.createCache (12288, 4096, 65536, 65536));
		assert (!m.createCache (12288, 4096, 65536, 16384));
		assert (!m.createCache (12288, 4096, 65536, 12288));

		assert ( m.createCache (16384, 4096, 65536, 65536, 524288));
		assert ( m.createCache (16384, 4096, 65536, 65536,  65536));
		assert (!m.createCache (12288, 4096, 65536, 65536, 524288));
		assert (!m.createCache (12288, 4096, 65536, 65536,  65536));
		assert (!m.createCache (12288, 4096, 65536, 65536,  12288));

		assert ( m.isCaching()); assert (m.getCacheSize() === 65536);

		//----------------------------------------------------------------------------//

		TEST_INVALID_RW (m, 0);
		TEST_INVALID_RW (m, 1);

		TEST_INVALID_RW (m, m.getMinAddress()-1);
		TEST_INVALID_RW (m, m.getMaxAddress()  );
		TEST_INVALID_RW (m, m.getMaxAddress()+1);

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testArgs()
	{
		{
			var m1 = Module();
			var m2 = Module();

			assert (m1.lt, m1, [   ]);
			assert (m1.gt, m1, [   ]);
			assert (m1.le, m1, [   ]);
			assert (m1.ge, m1, [   ]);
			assert (m1.lt, m1, ["a"]);
			assert (m1.gt, m1, ["a"]);
			assert (m1.le, m1, ["a"]);
			assert (m1.ge, m1, ["a"]);
			assert (m1.eq, m1, [   ]);
			assert (m1.ne, m1, [   ]);
			assert (m1.eq, m1, ["a"]);
			assert (m1.ne, m1, ["a"]);

			assert (typeof m1.isValid    ( ) === "boolean"     );
			assert (typeof m1.getName    ( ) === "string"      );
			assert (typeof m1.getPath    ( ) === "string"      );
			assert (typeof m1.getBase    ( ) === "number"      );
			assert (typeof m1.getSize    ( ) === "number"      );
			assert (       m1.getProcess ( ) instanceof Process);
			assert (       m1.getSegments( ) instanceof Array  );
			assert (typeof m1.contains   (0) === "boolean"     );

			assert (typeof m1.lt (m2) === "boolean");
			assert (typeof m1.gt (m2) === "boolean");
			assert (typeof m1.le (m2) === "boolean");
			assert (typeof m1.ge (m2) === "boolean");
			assert (typeof m1.lt (48) === "boolean");
			assert (typeof m1.gt (48) === "boolean");
			assert (typeof m1.le (48) === "boolean");
			assert (typeof m1.ge (48) === "boolean");
			assert (typeof m1.eq (m2) === "boolean");
			assert (typeof m1.ne (m2) === "boolean");
		}

		//----------------------------------------------------------------------------//

		{
			var s1 = Module.Segment();
			var s2 = Module.Segment();

			assert (s1.lt, s1, [   ]);
			assert (s1.gt, s1, [   ]);
			assert (s1.le, s1, [   ]);
			assert (s1.ge, s1, [   ]);
			assert (s1.lt, s1, ["a"]);
			assert (s1.gt, s1, ["a"]);
			assert (s1.le, s1, ["a"]);
			assert (s1.ge, s1, ["a"]);
			assert (s1.eq, s1, [   ]);
			assert (s1.ne, s1, [   ]);
			assert (s1.eq, s1, ["a"]);
			assert (s1.ne, s1, ["a"]);

			assert (typeof s1.contains (0) === "boolean");

			assert (typeof s1.lt (s2) === "boolean");
			assert (typeof s1.gt (s2) === "boolean");
			assert (typeof s1.le (s2) === "boolean");
			assert (typeof s1.ge (s2) === "boolean");
			assert (typeof s1.lt (48) === "boolean");
			assert (typeof s1.gt (48) === "boolean");
			assert (typeof s1.le (48) === "boolean");
			assert (typeof s1.ge (48) === "boolean");
			assert (typeof s1.eq (s2) === "boolean");
			assert (typeof s1.ne (s2) === "boolean");
		}

		//----------------------------------------------------------------------------//

		{
			var m = Memory();
			var b = false;
			var r = Memory.Region();
			var f = Buffer (0);

			assert (m.getStats,    m, [ 0                  ]);
			assert (m.getStats,    m, ["a"                 ]);
			assert (m.getRegion,   m, [                    ]);
			assert (m.getRegion,   m, ["a"                 ]);
			assert (m.getRegions,  m, [ 0, "a"             ]);
			assert (m.getRegions,  m, ["a"                 ]);
			assert (m.getRegions,  m, ["a", 0              ]);
			assert (m.setAccess,   m, [                    ]);
			assert (m.setAccess,   m, ["a"                 ]);
			assert (m.setAccess,   m, [ r,                 ]);
			assert (m.setAccess,   m, [ r, "a"             ]);
			assert (m.setAccess,   m, [ r,  b              ]);
			assert (m.setAccess,   m, [ r,  b,  b          ]);
			assert (m.find,        m, [                    ]);
			assert (m.find,        m, [ 0                  ]);
			assert (m.find,        m, ["a","a"             ]);
			assert (m.createCache, m, [                    ]);
			assert (m.createCache, m, [ 0                  ]);
			assert (m.createCache, m, ["a"                 ]);
			assert (m.createCache, m, [ 0,  0              ]);
			assert (m.createCache, m, [ 0,  0, "a"         ]);
			assert (m.createCache, m, [ 0,  0,  0, "a"     ]);
			assert (m.createCache, m, [ 0,  0,  0,  0, "a" ]);
			assert (m.readData,    m, [                    ]);
			assert (m.readData,    m, [ 0                  ]);
			assert (m.readData,    m, ["a"                 ]);
			assert (m.readData,    m, [ 0,  f, "a"         ]);
			assert (m.readData,    m, ["a", f,  0          ]);
			assert (m.readData,    m, [ 0,  0,  0          ]);
			assert (m.readData,    m, [ 0,  f,  0, "a"     ]);
			assert (m.writeData,   m, [                    ]);
			assert (m.writeData,   m, [ 0                  ]);
			assert (m.writeData,   m, ["a"                 ]);
			assert (m.writeData,   m, [ 0,  f, "a"         ]);
			assert (m.writeData,   m, ["a", f,  0          ]);
			assert (m.writeData,   m, [ 0,  0,  0          ]);
			assert (m.writeData,   m, [ 0,  f,  0, "a"     ]);
			assert (m.readInt8,    m, [                    ]);
			assert (m.readInt8,    m, ["a"                 ]);
			assert (m.readInt8,    m, [ 0, "a"             ]);
			assert (m.readInt8,    m, [ 0,  0, "a"         ]);
			assert (m.readInt16,   m, [                    ]);
			assert (m.readInt16,   m, ["a"                 ]);
			assert (m.readInt16,   m, [ 0, "a"             ]);
			assert (m.readInt16,   m, [ 0,  0, "a"         ]);
			assert (m.readInt32,   m, [                    ]);
			assert (m.readInt32,   m, ["a"                 ]);
			assert (m.readInt32,   m, [ 0, "a"             ]);
			assert (m.readInt32,   m, [ 0,  0, "a"         ]);
			assert (m.readInt64,   m, [                    ]);
			assert (m.readInt64,   m, ["a"                 ]);
			assert (m.readInt64,   m, [ 0, "a"             ]);
			assert (m.readInt64,   m, [ 0,  0, "a"         ]);
			assert (m.readReal32,  m, [                    ]);
			assert (m.readReal32,  m, ["a"                 ]);
			assert (m.readReal32,  m, [ 0, "a"             ]);
			assert (m.readReal32,  m, [ 0,  0, "a"         ]);
			assert (m.readReal64,  m, [                    ]);
			assert (m.readReal64,  m, ["a"                 ]);
			assert (m.readReal64,  m, [ 0, "a"             ]);
			assert (m.readReal64,  m, [ 0,  0, "a"         ]);
			assert (m.readPtr,     m, [                    ]);
			assert (m.readPtr,     m, ["a"                 ]);
			assert (m.readPtr,     m, [ 0, "a"             ]);
			assert (m.readPtr,     m, [ 0,  0, "a"         ]);
			assert (m.readBool,    m, [                    ]);
			assert (m.readBool,    m, ["a"                 ]);
			assert (m.readBool,    m, [ 0, "a"             ]);
			assert (m.readBool,    m, [ 0,  0, "a"         ]);
			assert (m.readInt8,    m, [                    ]);
			assert (m.readInt8,    m, ["a"                 ]);
			assert (m.readInt8,    m, [ 0, "a"             ]);
			assert (m.readInt8,    m, [ 0,  0, "a"         ]);
			assert (m.readString,  m, [                    ]);
			assert (m.readString,  m, ["a"                 ]);
			assert (m.readString,  m, [ 0, "a"             ]);
			assert (m.readString,  m, [ 0,  0, "a"         ]);
			assert (m.readString,  m, [ 0,  0,  0, "a"     ]);
			assert (m.writeInt8,   m, [                    ]);
			assert (m.writeInt8,   m, ["a"                 ]);
			assert (m.writeInt8,   m, [ 0, "a"             ]);
			assert (m.writeInt16,  m, [                    ]);
			assert (m.writeInt16,  m, ["a"                 ]);
			assert (m.writeInt16,  m, [ 0, "a"             ]);
			assert (m.writeInt32,  m, [                    ]);
			assert (m.writeInt32,  m, ["a"                 ]);
			assert (m.writeInt32,  m, [ 0, "a"             ]);
			assert (m.writeInt64,  m, [                    ]);
			assert (m.writeInt64,  m, ["a"                 ]);
			assert (m.writeInt64,  m, [ 0, "a"             ]);
			assert (m.writeReal32, m, [                    ]);
			assert (m.writeReal32, m, ["a"                 ]);
			assert (m.writeReal32, m, [ 0, "a"             ]);
			assert (m.writeReal64, m, [                    ]);
			assert (m.writeReal64, m, ["a"                 ]);
			assert (m.writeReal64, m, [ 0, "a"             ]);
			assert (m.writePtr,    m, [                    ]);
			assert (m.writePtr,    m, ["a"                 ]);
			assert (m.writePtr,    m, [ 0, "a"             ]);
			assert (m.writeBool,   m, [                    ]);
			assert (m.writeBool,   m, ["a"                 ]);
			assert (m.writeBool,   m, [ 0, "a"             ]);
			assert (m.writeString, m, [                    ]);
			assert (m.writeString, m, ["a"                 ]);
			assert (m.writeString, m, ["a", 0              ]);
			assert (m.writeString, m, [ 0,  0, "a"         ]);

			assert (typeof m.isValid      (           ) === "boolean"           );
			assert (       m.getProcess   (           ) instanceof Process      );

			assert (       m.getStats     (           ) instanceof Memory.Stats );
			assert (       m.getStats     (b          ) instanceof Memory.Stats );

			assert (       m.getRegion    (0          ) instanceof Memory.Region);

			assert (       m.getRegions   (           ) instanceof Array        );
			assert (       m.getRegions   (0          ) instanceof Array        );
			assert (       m.getRegions   (0,0        ) instanceof Array        );

			assert (typeof m.setAccess    (r,0        ) === "boolean"           );
			assert (typeof m.setAccess    (r,b,b,b    ) === "boolean"           );

			assert (       m.find         (""         ) instanceof Array        );
			assert (       m.find         ("",0       ) instanceof Array        );
			assert (       m.find         ("",0,0     ) instanceof Array        );
			assert (       m.find         ("",0,0,0   ) instanceof Array        );
			assert (       m.find         ("",0,0,0,"") instanceof Array        );

			assert (typeof m.createCache  (0,0,0      ) === "boolean"           );
			assert (typeof m.createCache  (0,0,0,0    ) === "boolean"           );
			assert (typeof m.createCache  (0,0,0,0,0  ) === "boolean"           );

			assert (typeof m.clearCache   (           ) === "undefined"         );
			assert (typeof m.deleteCache  (           ) === "undefined"         );
			assert (typeof m.isCaching    (           ) === "boolean"           );
			assert (typeof m.getCacheSize (           ) === "number"            );

			assert (typeof m.getPtrSize   (           ) === "number"            );
			assert (typeof m.getMinAddress(           ) === "number"            );
			assert (typeof m.getMaxAddress(           ) === "number"            );
			assert (typeof m.getPageSize  (           ) === "number"            );

			assert (typeof m.readData     (0,f,0      ) === "number"            );
			assert (typeof m.readData     (0,f,0,0    ) === "number"            );

			assert (typeof m.writeData    (0,f,0      ) === "number"            );
			assert (typeof m.writeData    (0,f,0,0    ) === "number"            );

			assert (m.readInt8   (0  ) === null);
			assert (m.readInt16  (0  ) === null);
			assert (m.readInt32  (0  ) === null);
			assert (m.readInt64  (0  ) === null);
			assert (m.readReal32 (0  ) === null);
			assert (m.readReal64 (0  ) === null);
			assert (m.readPtr    (0  ) === null);
			assert (m.readBool   (0  ) === null);
			assert (m.readString (0,0) === null);

			assert (typeof m.writeInt8   (0, 0) === "boolean");
			assert (typeof m.writeInt16  (0, 0) === "boolean");
			assert (typeof m.writeInt32  (0, 0) === "boolean");
			assert (typeof m.writeInt64  (0, 0) === "boolean");
			assert (typeof m.writeReal32 (0, 0) === "boolean");
			assert (typeof m.writeReal64 (0, 0) === "boolean");
			assert (typeof m.writePtr    (0, 0) === "boolean");
			assert (typeof m.writeBool   (0, b) === "boolean");
			assert (typeof m.writeString (0,"") === "boolean");
		}

		//----------------------------------------------------------------------------//

		{
			var s1 = Memory.Stats();
			var s2 = Memory.Stats();

			assert (s1.eq, s1, [   ]);
			assert (s1.ne, s1, [   ]);
			assert (s1.eq, s1, ["a"]);
			assert (s1.ne, s1, ["a"]);

			assert (typeof s1.eq (s2) === "boolean");
			assert (typeof s1.ne (s2) === "boolean");
		}

		//----------------------------------------------------------------------------//

		{
			var r1 = Memory.Region();
			var r2 = Memory.Region();

			assert (r1.lt, r1, [   ]);
			assert (r1.gt, r1, [   ]);
			assert (r1.le, r1, [   ]);
			assert (r1.ge, r1, [   ]);
			assert (r1.lt, r1, ["a"]);
			assert (r1.gt, r1, ["a"]);
			assert (r1.le, r1, ["a"]);
			assert (r1.ge, r1, ["a"]);
			assert (r1.eq, r1, [   ]);
			assert (r1.ne, r1, [   ]);
			assert (r1.eq, r1, ["a"]);
			assert (r1.ne, r1, ["a"]);

			assert (typeof r1.contains (0) === "boolean");

			assert (typeof r1.lt (r2) === "boolean");
			assert (typeof r1.gt (r2) === "boolean");
			assert (typeof r1.le (r2) === "boolean");
			assert (typeof r1.ge (r2) === "boolean");
			assert (typeof r1.lt (48) === "boolean");
			assert (typeof r1.gt (48) === "boolean");
			assert (typeof r1.le (48) === "boolean");
			assert (typeof r1.ge (48) === "boolean");
			assert (typeof r1.eq (r2) === "boolean");
			assert (typeof r1.ne (r2) === "boolean");
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testDebug (p)
	{
		// Check if the parameter is this process
		var local = Process.getCurrent().eq (p);
		assert ( p.isValid   ());
		assert (!p.isDebugged());

		if (local)
			log ("Attach a debugger to the current app" );
		else
			log ("Attach a debugger to the selected app");

		getline(); assert ( p.isDebugged());

		if (local)
			log ("Detach debugger from the current app\n" );
		else
			log ("Detach debugger from the selected app\n");

		getline(); assert (!p.isDebugged());

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testRegion (p)
	{
		// Check if the parameter is this process
		var local = Process.getCurrent().eq (p);
		assert (p.isValid());

		if (local)
			log ("Verify regions for the current app\n" );
		else
			log ("Verify regions for the selected app\n");

		var m = Memory (p); var i, j;
		var list1 = m.getRegions();
		var list2 = m.getRegions
			(0x10000000, 0x80000000);

		log ("Total regions: ");
		log (list1.length + " | Bounded: ");
		log (list2.length + "\n");

		// Print relevant info about the regions
		for (i = 0, j = 0; i < list1.length; ++i)
		{
			assert ( list1[i].valid);
			assert ( list1[i].start >= m.getMinAddress());
			assert ( list1[i].stop  <= m.getMaxAddress());
			assert ( list1[i].start < list1[i].stop);
			assert ((list1[i].start + list1[i].size ) === list1[i].stop );
			assert ((list1[i].stop  - list1[i].start) === list1[i].size );
			assert ((list1[i].stop  - list1[i].size ) === list1[i].start);

			if (list1[i].bound)
			{
				log (sprintf ("%012X : ",   list1[i].start));
				log (sprintf ("%012X (",    list1[i].stop ));
				log (sprintf ("%012X) - " , list1[i].size ));
				log ((list1[i].readable   ? "R" : "-") + (list1[i].writable ? "W" : "-"));
				log ((list1[i].executable ? "X" : "-") + (list1[i].private  ? "P" : "S"));
				log (sprintf (" (0x%03X) ", list1[i].access));
				log ((list1[i].guarded ? "G " : "  "      ));
			}

			else
			{
				assert (!list1[i].readable  );
				assert (!list1[i].writable  ); assert (!list1[i].private);
				assert (!list1[i].executable); assert (!list1[i].guarded);

			if (process.platform === "win32")
				assert (list1[i].access === 1);
			else
				assert (list1[i].access === 0);

				log (sprintf ("%012X : ", list1[i].start));
				log (sprintf ("%012X (",  list1[i].stop ));
				log (sprintf ("%012X) ",  list1[i].size ));
				log ("                 ");
			}

			if (process.platform === "linux")
			{
				assert (!m.setAccess (list1[i], false, false, false));
				assert (!m.setAccess (list1[i], false, false, true ));
				assert (!m.setAccess (list1[i], false, true , false));
				assert (!m.setAccess (list1[i], false, true , true ));
				assert (!m.setAccess (list1[i], true , false, false));
				assert (!m.setAccess (list1[i], true , false, true ));
				assert (!m.setAccess (list1[i], true , true , false));
				assert (!m.setAccess (list1[i], true , true , true ));

				// This is unused on Linux
				assert (!list1[i].guarded);
			}

			if (process.platform === "darwin")
			{
				// This is unused on Mac
				assert (!list1[i].guarded);
			}

			if (process.platform === "darwin" ||
				process.platform === "win32")
			{
				// Attempt to change the regions protection value
				if ( list1[i].readable   && !list1[i].writable &&
					!list1[i].executable && !list1[i].guarded)
				{
					assert (list1[i].bound); log ("M ");
					// Attempt to make the current region writable
					if (m.setAccess (list1[i], true, true, false))
					{
						var r = m.getRegion (list1[i].start);

						if (!r.writable)
							log ("Y ");
						else
							log ("  ");

						assert (m.setAccess (list1[i], list1[i].access));
						assert (m.getRegion (list1[i].start).eq (list1[i]));
					}

					else log ("X ");
				}

				else log ("    ");
			}

			// Check if we hit the second list
			if (list1[i].start < 0x80000000 &&
				list1[i].stop  > 0x10000000)
			{
				assert (j < list2.length);

				log ("<< ");
				if (list1[i].start !== list2[j++].start)
					log ("X ");
			}

			log ("\n");
			if (i > 0) assert (list1[i-1].stop === list1[i].start);
		}

		// If we matched all values
		assert (j === list2.length);
		log ("Press enter to continue\n");
		getline();
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testModules (p)
	{
		// Check if the parameter is this process
		var local = Process.getCurrent().eq (p);
		assert (p.isValid());

		if (local)
			log ("Verify module lists for the current app\n\n" );
		else
			log ("Verify module lists for the selected app\n\n");

		if (process.platform === "linux" ||
			process.platform === "win32")
		{
			// This result is unreliable on OSX
			assert (!p.getModules ("*").length);
			assert (!p.getModules (")").length);
		}

		var list1 = p.getModules (    );
		var list2 = p.getModules (".*");
		log ("List all - " + list1.length + "\n");

		assert (list1.length !==            0);
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			assert (list1[i].isValid());
			assert (list2[i].isValid());
			assert (list1[i].getBase());
			assert (list1[i].getProcess().eq (p));

			assert ( list1[i].eq (list2[i]));
			assert (!list1[i].ne (list2[i]));

			log (sprintf ("0x%012X : ", list1[i].getBase()));
			log (sprintf ("0x%012X - ", list1[i].getSize()));
			log (list1[i].getName() + "\n");

			var segs1 = list1[i].getSegments();
			var segs2 = list2[i].getSegments();

			if (process.platform === "linux" ||
				process.platform === "win32")
			{
				assert (list1[i].getSize());
				assert (segs1.length === 0);
				assert (segs2.length === 0);
			}

			if (process.platform === "darwin")
			{
				assert (segs1.length === segs2.length);
				assert (list1[i].getSize() === 0);

				for (var j = 0; j < segs1.length; ++j)
				{
					assert (segs1[j].valid );
					assert (segs2[j].valid );
					assert (segs1[j].size  );
					assert (segs1[j].name.length);

					assert ( segs1[j].eq (segs2[j]));
					assert (!segs1[j].ne (segs2[j]));

					log (sprintf ("0x%012X : ", segs1[j].base                ));
					log (sprintf ("0x%012X (",  segs1[j].base + segs1[j].size));
					log (sprintf ("0x%012X) ",  segs1[j].size                ));
					log (segs1[j].name + "\n");
				}

				log ("------------------------------\n");
			}
		}

		log ("Press enter to continue\n");
		getline();

		list1 = p.getModules (".*a.*");
		list2 = p.getModules (".*A.*");
		log ("List *a* - " + list1.length + "\n");
		assert (list1.length === list2.length);

		for (var i = 0; i < list1.length; ++i)
		{
			var name = list1[i].getName();
			assert (name.indexOf ("a") >= 0 ||
					name.indexOf ("A") >= 0);
		}

		log ("Verified\n\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testStress()
	{
		log ("Stress test started\n");
		var pList = Process.getList();
		for (var p = 0; p < pList.length; ++p)
		{
			// Process might have disappeared
			if (!pList[p].isValid()) continue;

			if (process.arch === "ia32")
				// Ensure architecture is correct
				if (pList[p].is64Bit()) continue;

			var m = Memory (pList[p]);
			var rList = m.getRegions();

			for (var r = 0; r < rList.length; ++r)
			{
				assert ( rList[r].valid);
				assert ( rList[r].start >= m.getMinAddress());
				assert ( rList[r].stop  <= m.getMaxAddress());
				assert ( rList[r].start < rList[r].stop);
				assert ((rList[r].start + rList[r].size ) === rList[r].stop );
				assert ((rList[r].stop  - rList[r].start) === rList[r].size );
				assert ((rList[r].stop  - rList[r].size ) === rList[r].start);

				if (!rList[r].bound)
				{
					assert (!rList[r].readable  );
					assert (!rList[r].writable  ); assert (!rList[r].private);
					assert (!rList[r].executable); assert (!rList[r].guarded);

					if (process.platform === "win32")
						assert (rList[r].access === 1);
					else
						assert (rList[r].access === 0);
				}

				if (process.platform === "linux")
					assert (rList[r].eq (m.getRegion (rList[r].start)));

				if (r > 0) assert (rList[r-1].stop === rList[r].start);
			}

			var mList = pList[p].getModules();
			for (var m = 0; m < mList.length; ++m)
			{
				assert (mList[m].isValid());
				assert (mList[m].getBase());
				assert (mList[m].getProcess().eq (pList[p]));

				var sList = mList[m].getSegments();
				if (process.platform === "linux" ||
					process.platform === "win32")
				{
					assert (mList[m].getSize());
					assert (sList.length === 0);
				}

				if (process.platform === "darwin")
				{
					assert (mList[m].getSize() === 0);
					for (var s = 0; s < sList.length; ++s)
					{
						assert (sList[s].valid);
						assert (sList[s].name[0] !== "\0");

						if (sList[s].size === 0)
						{
							// Probably just a __RESTRICT segment
							log ("Found a size zero segment: ");
							log (sList[s].name + " p: " + p);
							log (" pid: " + pList[p].getPID ());
							log (" m: "   + mList[m].getName());
							log ("\n");
						}
					}
				}
			}
		}

		log ("Stress test finished\n\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testRW (p, mem)
	{
		mem = mem || null;
		// Attempt to retrieve the main module
		var list = p.getModules (".*peon.*");
		assert (list.length === 1);

		var module;
		if (process.platform === "darwin" ||
			process.platform === "win32")
			module = list[0].getBase();

		if (process.platform === "linux")
			module = 0;

		var is64Bit = p.is64Bit();
		var l = is64Bit ? 8 : 4;

		var m = Memory (p);
		if (mem === null) mem = m;
		var f = Memory.SKIP_ERRORS;
		assert (l === mem.getPtrSize());

		//----------------------------------------------------------------------------//

		var  PINT16,  PINT32, PINT64;
		var PREAL32, PREAL64;
		var  PPTR16,  PPTR32, PPTR64;
		var  PARRAY, PFINITE, PVECTOR;

		if (process.platform === "linux")
		{
			 PINT16 = is64Bit ? 0x604202 : 0x804D112;
			 PINT32 = is64Bit ? 0x604204 : 0x804D114;
			 PINT64 = is64Bit ? 0x604208 : 0x804D118;

			PREAL32 = is64Bit ? 0x604210 : 0x804D120;
			PREAL64 = is64Bit ? 0x604218 : 0x804D128;

			 PPTR16 = is64Bit ? 0x604220 : 0x804D130;
			 PPTR32 = is64Bit ? 0x604228 : 0x804D134;
			 PPTR64 = is64Bit ? 0x604230 : 0x804D138;

			 PARRAY = is64Bit ? 0x604238 : 0x804D13C;

			PFINITE = is64Bit ? 0x604240 : 0x804D140;
			PVECTOR = is64Bit ? 0x604250 : 0x804D150;
		}

		if (process.platform === "darwin")
		{
			 PINT16 = is64Bit ? 0xA400 : 0x0;
			 PINT32 = is64Bit ? 0xA404 : 0x0;
			 PINT64 = is64Bit ? 0xA408 : 0x0;

			PREAL32 = is64Bit ? 0xA410 : 0x0;
			PREAL64 = is64Bit ? 0xA418 : 0x0;

			 PPTR16 = is64Bit ? 0xA420 : 0x0;
			 PPTR32 = is64Bit ? 0xA428 : 0x0;
			 PPTR64 = is64Bit ? 0xA430 : 0x0;

			 PARRAY = is64Bit ? 0xA3F8 : 0x0;

			PFINITE = is64Bit ? 0xA438 : 0x0;
			PVECTOR = is64Bit ? 0xA448 : 0x0;
		}

		if (process.platform === "win32")
		{
			 PINT16 = is64Bit ? 0xAD820 : 0x84CC0;
			 PINT32 = is64Bit ? 0xAD824 : 0x84CC4;
			 PINT64 = is64Bit ? 0xAD828 : 0x84CC8;

			PREAL32 = is64Bit ? 0xAD830 : 0x84CD0;
			PREAL64 = is64Bit ? 0xAD838 : 0x84CD8;

			 PPTR16 = is64Bit ? 0xAD840 : 0x84CD4;
			 PPTR32 = is64Bit ? 0xAD848 : 0x84CE0;
			 PPTR64 = is64Bit ? 0xAD850 : 0x84CE4;

			 PARRAY = is64Bit ? 0xAD858 : 0x84CE8;

			PFINITE = is64Bit ? 0xAD860 : 0x84CF0;
			PVECTOR = is64Bit ? 0xAD870 : 0x84D00;
		}

		//----------------------------------------------------------------------------//

		var vInt16  = 0;
		var vInt32  = 0;
		var vInt64  = 0;

		var vReal32 = 0;
		var vReal64 = 0;

		var vPtr1   = 0;
		var vPtr2   = 0;
		var vPtr3   = 0;

		var vArray  = [0, 0, 0, 0];
		var vVector = [0, 0, 0, 0];

		//----------------------------------------------------------------------------//

		assert ((vInt16  = mem.readInt16  (module + PINT16 )) === 100);
		assert ((vInt32  = mem.readInt32  (module + PINT32 )) === 200);
		assert ((vInt64  = mem.readInt64  (module + PINT64 )) === 300);

		assert ((vReal32 = mem.readReal32 (module + PREAL32)) === 400);
		assert ((vReal64 = mem.readReal64 (module + PREAL64)) === 500);

		assert ((vPtr1   = mem.readPtr    (module + PPTR16 )) === module + PINT16);
		assert ((vPtr2   = mem.readPtr    (module + PPTR32 )) === module + PINT32);
		assert ((vPtr3   = mem.readPtr    (module + PPTR64 )) === module + PINT64);

		assert ((vInt16  = mem.readInt16  (vPtr1)) === 100);
		assert ((vInt32  = mem.readInt32  (vPtr2)) === 200);
		assert ((vInt64  = mem.readInt64  (vPtr3)) === 300);

		assert ( vPtr1   = mem.readPtr    (module + PARRAY));
		assert ( vArray  = mem.readInt32  (vPtr1, 4       ));
		assert ( vArray instanceof Array);
		assert (vArray[0] === 0); assert  (vArray[1] === 1);
		assert (vArray[2] === 2); assert  (vArray[3] === 3);

		assert ( vArray  = mem.readInt32  (module + PFINITE, 4));
		assert ( vArray instanceof Array);
		assert (vArray[0] === 10); assert (vArray[1] === 20);
		assert (vArray[2] === 30); assert (vArray[3] ===  0);

		assert ( vVector = mem.readReal32 (module + PVECTOR, 4));
		assert ( vVector instanceof Array);
		assert (vVector[0] === 1.75); assert (vVector[1] === 2.75);
		assert (vVector[2] === 3.75); assert (vVector[3] === 4.75);

		//----------------------------------------------------------------------------//

		vReal32 = 1.5;
		vReal64 = 2.5;

		vPtr2 = module + PFINITE;

		vArray[0] = 123;
		vArray[1] = 456;
		vArray[2] = 789;
		vArray[3] =   0;

		assert (mem.writeReal32 (module + PREAL32, vReal32));
		assert (mem.writeReal64 (module + PREAL64, vReal64));
		assert (mem.writePtr    (module +  PPTR32, vPtr2  ));
		assert (mem.writeInt32  (module + PFINITE +  0, vArray[0]));
		assert (mem.writeInt32  (module + PFINITE +  4, vArray[1]));
		assert (mem.writeInt32  (module + PFINITE +  8, vArray[2]));
		assert (mem.writeInt32  (module + PFINITE + 12, vArray[3]));

		log ("Verify Peon values and press enter"); getline();

		//----------------------------------------------------------------------------//

		vReal32 = 0;
		vReal64 = 0;
		vPtr2   = 0;

		vArray[0] = 0;
		vArray[1] = 0;
		vArray[2] = 0;
		vArray[3] = 0;

		mem.clearCache();
		assert ((vReal32 = mem.readReal32 (module + PREAL32)) === 1.5);
		assert ((vReal64 = mem.readReal64 (module + PREAL64)) === 2.5);
		assert ((vPtr2   = mem.readPtr    (module +  PPTR32)) === module + PFINITE);

		assert ( vArray  = mem.readInt32  (vPtr2, 4));
		assert ( vArray instanceof Array);
		assert (vArray[0] === 123); assert (vArray[1] === 456);
		assert (vArray[2] === 789); assert (vArray[3] ===   0);

		log ("Reset  Peon values and press enter"); getline();

		//----------------------------------------------------------------------------//

		if (!mem.isCaching())
		{
			var stats1 = mem.getStats();
			assert (stats1.systemReads  !== 0);
			assert (stats1.cachedReads  === 0);
			assert (stats1.systemWrites !== 0);
			assert (stats1.accessWrites === 0);
			assert (stats1.readErrors   === 0);
			assert (stats1.writeErrors  === 0);

			var stats2 = mem.getStats (true);
			assert (stats2.systemReads  !== 0);
			assert (stats2.cachedReads  === 0);
			assert (stats2.systemWrites !== 0);
			assert (stats2.accessWrites === 0);
			assert (stats2.readErrors   === 0);
			assert (stats2.writeErrors  === 0);

			var stats3 = mem.getStats();
			assert (stats3.systemReads  === 0);
			assert (stats3.cachedReads  === 0);
			assert (stats3.systemWrites === 0);
			assert (stats3.accessWrites === 0);
			assert (stats3.readErrors   === 0);
			assert (stats3.writeErrors  === 0);
			assert (!m.getCacheSize());
		}

		log ("\n");
		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testCache (p)
	{
		var m = Memory (p);
		// Create 8K cache with 8K reads and 16K Enlarge
		assert (m.createCache (4096, 4096, 8192, 16384));
		assert (m.isCaching());

		// Call ReadWrite test from before
		if (!testRW (p, m)) return false;

		var stats1 = m.getStats (true);
		assert (stats1.systemReads  !== 0);
		assert (stats1.cachedReads  !== 0);
		assert (stats1.systemWrites !== 0);
		assert (stats1.accessWrites === 0);
		assert (stats1.readErrors   === 0);
		assert (stats1.writeErrors  === 0);
		assert (m.getCacheSize() === 24576);

		// No more cache
		m.deleteCache();
		assert (!m.isCaching   ());
		assert (!m.getCacheSize());

		// Call ReadWrite test from before
		if (!testRW (p, m)) return false;

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testFlags (p)
	{
		var m = Memory (p);

		var test1 = false; // R Zero
		var test2 = false; // W Zero
		var test3 = false; // R Auto
		var test4 = false; // W Auto
		var test5 = false; // R Auto + Fail
		var test6 = false; // W Auto + Fail
		var test7 = false; // R Auto (Alt)
		var test8 = false; // W Auto (Alt)

		if (process.platform === "linux")
		{
			test3 = true;
			test4 = true;
			test7 = true;
			test8 = true;
		}

		// Returns the type of data contained within the array
		// 0 = All zeroes | 1 = All ones | 2 = Just random data
		var getType = function (data, idx, size)
		{
			var average = data[idx];
			// Iterate through the entire array
			for (var i = idx + 1; i < size; ++i)
			{
				if (data[i] === 0 && average === 0) continue;
				if (data[i] === 1 && average === 1) continue;
				return 2;
			}

			return average;
		};

		var size = 1048576;
		// Allocate a single MB
		var data = Buffer (size);

		var list = m.getRegions();
		// Try and find a good series of regions
		for (var i = 0; i < list.length; ++i)
		{
			// Reached end of list
			if (i+1 >= list.length)
			{
				if (!test1)
					log ("Warning: Flags test 1 was not completed!\n");
				if (!test2)
					log ("Warning: Flags test 2 was not completed!\n");
				if (!test3 && !test7)
					log ("Warning: Flags test 3 was not completed!\n");
				if (!test4 && !test8)
					log ("Warning: Flags test 4 was not completed!\n");
				if (!test5)
					log ("Warning: Flags test 5 was not completed!\n");
				if (!test6)
					log ("Warning: Flags test 6 was not completed!\n");
				break;
			}

			var r1 = list[i + 0];
			var r2 = list[i + 1];
			var len = r1.size + r2.size;

			// Keep sizes under 64 MB
			if (r1.size > 67108864 ||
				r2.size > 67108864)
				continue;

			if (size < len)
			{
				// Multiply by two until
				// the length is reached
				while ((size *= 2) < len);

				// Reallocate buffer
				data = Buffer (size);
			}

			// Do flagged memory read tests
			if ( r1.readable &&  r1.writable && !r1.guarded &&
				!r2.readable && !r2.writable && !r2.guarded)
			{
				// Check if tested
				if (test1 === false)
				{
					data.fill (1);
					assert (m.readData (r1.start, data, len, Memory.SKIP_ERRORS) === len);
					if (getType (data,       0, r1.size) === 2 &&
						getType (data, r1.size, r2.size) === 0)
						test1 = true;
				}

				// Skip if test already done
				if (test3 && test5) continue;

				// Attempt to set access of the region
				if (m.setAccess (r2, true, false, false))
				{
					// Restore previous access
					m.setAccess (r2, r2.access);

					// Skip if already succeeded
					if (test3 === true) continue;

					data.fill (1);
					assert (m.readData (r1.start, data, len, Memory.AUTO_ACCESS) === len);
					if (getType (data,       0, r1.size) === 2 &&
						getType (data, r1.size, r2.size) === 2)
						test3 = true;
				}

				else
				{
					// Skip if already succeeded
					if (test5 === true) continue;

					data.fill (1);
					assert (m.readData (r1.start, data, len, Memory.AUTO_ACCESS) === len);
					if (getType (data,       0, r1.size) === 2 &&
						getType (data, r1.size, r2.size) === 0)
						test5 = true;
				}
			}

			// Do flagged memory write tests
			if (r1.readable &&  r1.writable && !r1.guarded &&
				r2.readable && !r2.writable && !r2.guarded)
			{
				// Check if tested
				if (test2 === false)
				{
					var value = Buffer ([ 0xDD, 0xCC, 0xBB, 0xAA ]);
					assert (m.writeData (r2.start-2, value, 4, Memory.SKIP_ERRORS) === 4);
					assert (m. readData (r2.start-2, value, 4, Memory.SKIP_ERRORS) === 4);
					value = value.readUInt32LE (0);
					assert ((value & 0x0000FFFF) === 0x0000CCDD);
					assert ((value & 0xFFFFFFFF) !== 0xAABBCCDD);
					test2 = true;
				}

				// Skip if test already done
				if (test4 && test6) continue;

				// Attempt to set access of the region
				if (m.setAccess (r2, true, true, false))
				{
					// Restore previous access
					m.setAccess (r2, r2.access);

					// Skip if already succeeded
					if (test4 === true) continue;

					var value = Buffer ([ 0xDD, 0xCC, 0xBB, 0xAA ]);
					assert (m.writeData (r2.start-2, value, 4, Memory.AUTO_ACCESS) === 4);
					assert (m. readData (r2.start-2, value, 4, Memory.AUTO_ACCESS) === 4);
					assert (value.readUInt32LE (0) === 0xAABBCCDD);
					test4 = true;
				}

				else
				{
					// Skip if already succeeded
					if (test6 === true) continue;

					var value = Buffer ([ 0xDD, 0xCC, 0xBB, 0xAA ]);
					assert (m.writeData (r2.start-2, value, 4, Memory.AUTO_ACCESS) === 4);
					assert (m. readData (r2.start-2, value, 4, Memory.AUTO_ACCESS) === 4);
					value = value.readUInt32LE (0);
					assert ((value & 0x0000FFFF) === 0x0000CCDD);
					assert ((value & 0xFFFFFFFF) !== 0xAABBCCDD);
					test6 = true;
				}
			}

			// Do flagged memory access test
			if (r1.readable && r1.writable && !r1.guarded &&
				r2.readable && r2.writable && !r2.guarded)
			{
				// Attempt to set access of the region if not tested
				if (!test7 && m.setAccess (r2, false, false, false))
				{
					data.fill (1);
					assert (m.readData (r1.start, data, len, Memory.AUTO_ACCESS) === len);
					if (getType (data,       0, r1.size) === 2 &&
						getType (data, r1.size, r2.size) === 2)
						test7 = true;

					// Restore previous access
					m.setAccess (r2, r2.access);
				}

				// Attempt to set access of the region if not tested
				if (!test8 && m.setAccess (r2, true, false, false))
				{
					var value = Buffer ([ 0xDD, 0xCC, 0xBB, 0xAA ]);
					assert (m.writeData (r2.start-2, value, 4, Memory.AUTO_ACCESS) === 4);
					assert (m. readData (r2.start-2, value, 4, Memory.AUTO_ACCESS) === 4);
					assert (value.readUInt32LE (0) === 0xAABBCCDD);
					test8 = true;

					// Restore previous access
					m.setAccess (r2, r2.access);
				}
			}
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testFind (p)
	{
		// Attempt to retrieve the main module
		var list = p.getModules (".*peon.*");
		assert (list.length === 1);

		var module;
		if (process.platform === "darwin" ||
			process.platform === "win32")
			module = list[0].getBase();

		if (process.platform === "linux")
			module = 0;

		var is64Bit = p.is64Bit();
		var l = is64Bit ? 8 : 4;
		var m = Memory (p);
		assert (l === m.getPtrSize());

		var finder = function (list, value)
		{
			var i;
			for (i = 0; i < list.length; ++i)
				if (list[i] === value) break;
			return i < list.length;
		};

		var sorter = function (a, b)
		{
			return a - b;
		}

		//----------------------------------------------------------------------------//

		var PPAT1, PPAT2, PPAT3, PPAT4, PPAT5, PPAT6;

		if (process.platform === "linux")
		{
			PPAT1 = is64Bit ? 0x402E40 : 0x804B0A0;
			PPAT2 = is64Bit ? 0x402E60 : 0x804B0C0;
			PPAT3 = is64Bit ? 0x604260 : 0x804D160;
			PPAT4 = is64Bit ? 0x604268 : 0x804D164;
			PPAT5 = is64Bit ? 0x402E80 : 0x804B0E0;
			PPAT6 = is64Bit ? 0x402EA0 : 0x804B100;
		}

		if (process.platform === "darwin")
		{
			PPAT1 = is64Bit ? 0x9880 : 0x0;
			PPAT2 = is64Bit ? 0x98A0 : 0x0;
			PPAT3 = is64Bit ? 0xA3E8 : 0x0;
			PPAT4 = is64Bit ? 0xA3F0 : 0x0;
			PPAT5 = is64Bit ? 0x9840 : 0x0;
			PPAT6 = is64Bit ? 0x9860 : 0x0;
		}

		if (process.platform === "win32")
		{
			PPAT1 = is64Bit ? 0x89120 : 0x70380;
			PPAT2 = is64Bit ? 0x89140 : 0x703A0;
			PPAT3 = is64Bit ? 0xAD880 : 0x84CEC;
			PPAT4 = is64Bit ? 0xAD888 : 0x84D10;
			PPAT5 = is64Bit ? 0x8A308 : 0x70968;
			PPAT6 = is64Bit ? 0x8A330 : 0x70990;
		}

		//----------------------------------------------------------------------------//

		var vPat3 = 0; assert (vPat3 = m.readPtr (module + PPAT3));
		var vPat4 = 0; assert (vPat4 = m.readPtr (module + PPAT4));

		var pat   = [ ];
		var list1 = [ ];
		var list2 = [ ];
		pat.push (module + PPAT1);
		pat.push (module + PPAT2);
		pat.push (module + PPAT5);
		pat.push (module + PPAT6);
		pat.push (vPat3);
		pat.push (vPat4);
		pat.sort (sorter);

		//----------------------------------------------------------------------------//

		list1 = m.find ("04 08 15 16 23 42");
		list2 = m.find ("040815     162342");
		assert (list1.toString() === list2.toString());
		list1.sort (sorter);

		if (process.platform === "linux")
		{
			assert (list1.length >= 6);
			assert (list2.length >= 6);

			assert (finder (list1, pat[0] + 0x00));
			assert (finder (list1, pat[1] + 0x12));
			assert (finder (list1, pat[2] + 0x00));
			assert (finder (list1, pat[3] + 0x12));
			assert (finder (list1, pat[4] + 0x00));
			assert (finder (list1, pat[5] + 0x12));
		}

		else
		{
			assert (list1.length === 6);
			assert (list2.length === 6);

			assert (list1[0] === pat[0] + 0x00);
			assert (list1[1] === pat[1] + 0x12);
			assert (list1[2] === pat[2] + 0x00);
			assert (list1[3] === pat[3] + 0x12);
			assert (list1[4] === pat[4] + 0x00);
			assert (list1[5] === pat[5] + 0x12);
		}

		list1 = m.find ("0408  0F10  172A");
		list2 = m.find ("04  080f1017  2a");
		assert (list1.toString() === list2.toString());
		list1.sort (sorter);

		if (process.platform === "linux")
		{
			assert (list1.length >= 6);
			assert (list2.length >= 6);

			assert (finder (list1, pat[0] + 0x12));
			assert (finder (list1, pat[1] + 0x00));
			assert (finder (list1, pat[2] + 0x12));
			assert (finder (list1, pat[3] + 0x00));
			assert (finder (list1, pat[4] + 0x12));
			assert (finder (list1, pat[5] + 0x00));
		}

		else
		{
			assert (list1.length === 6);
			assert (list2.length === 6);

			assert (list1[0] === pat[0] + 0x12);
			assert (list1[1] === pat[1] + 0x00);
			assert (list1[2] === pat[2] + 0x12);
			assert (list1[3] === pat[3] + 0x00);
			assert (list1[4] === pat[4] + 0x12);
			assert (list1[5] === pat[5] + 0x00);
		}

		//----------------------------------------------------------------------------//

		list1 = m.find ("04 08  ? 16 23 42");
		list2 = m.find ("04 08 15  ? 23 42");
		assert (list1.toString() === list2.toString());
		list1.sort (sorter);

		if (process.platform === "linux")
		{
			assert (list1.length >= 6);
			assert (list2.length >= 6);

			assert (finder (list1, pat[0] + 0x00));
			assert (finder (list1, pat[1] + 0x12));
			assert (finder (list1, pat[2] + 0x00));
			assert (finder (list1, pat[3] + 0x12));
			assert (finder (list1, pat[4] + 0x00));
			assert (finder (list1, pat[5] + 0x12));
		}

		else
		{
			assert (list1.length === 6);
			assert (list2.length === 6);

			assert (list1[0] === pat[0] + 0x00);
			assert (list1[1] === pat[1] + 0x12);
			assert (list1[2] === pat[2] + 0x00);
			assert (list1[3] === pat[3] + 0x12);
			assert (list1[4] === pat[4] + 0x00);
			assert (list1[5] === pat[5] + 0x12);
		}

		list1 = m.find ("04  ? 0F 10 17 2A");
		list2 = m.find ("04 08 0f 10  ? 2a");
		assert (list1.toString() === list2.toString());
		list1.sort (sorter);

		if (process.platform === "linux")
		{
			assert (list1.length >= 6);
			assert (list2.length >= 6);

			assert (finder (list1, pat[0] + 0x12));
			assert (finder (list1, pat[1] + 0x00));
			assert (finder (list1, pat[2] + 0x12));
			assert (finder (list1, pat[3] + 0x00));
			assert (finder (list1, pat[4] + 0x12));
			assert (finder (list1, pat[5] + 0x00));
		}

		else
		{
			assert (list1.length === 6);
			assert (list2.length === 6);

			assert (list1[0] === pat[0] + 0x12);
			assert (list1[1] === pat[1] + 0x00);
			assert (list1[2] === pat[2] + 0x12);
			assert (list1[3] === pat[3] + 0x00);
			assert (list1[4] === pat[4] + 0x12);
			assert (list1[5] === pat[5] + 0x00);
		}

		//----------------------------------------------------------------------------//

		list1 = m.find ("04 08 ? ? ? ? DE AD");
		list2 = m.find ("04 08 ? ? ? ?  ?  ?");
		assert (list1.toString() !== list2.toString());
		list1.sort (sorter);

		if (process.platform === "linux")
		{
			assert (list1.length >=  6);
			assert (list2.length >  12);

			assert (finder (list1, pat[0] + 0x00));
			assert (finder (list1, pat[1] + 0x00));
			assert (finder (list1, pat[2] + 0x00));
			assert (finder (list1, pat[3] + 0x00));
			assert (finder (list1, pat[4] + 0x00));
			assert (finder (list1, pat[5] + 0x00));
		}

		else
		{
			assert (list1.length === 6);
			assert (list2.length >  12);

			assert (list1[0] === pat[0] + 0x00);
			assert (list1[1] === pat[1] + 0x00);
			assert (list1[2] === pat[2] + 0x00);
			assert (list1[3] === pat[3] + 0x00);
			assert (list1[4] === pat[4] + 0x00);
			assert (list1[5] === pat[5] + 0x00);
		}

		//----------------------------------------------------------------------------//

		list1 = m.find ("04 08 15 16 23 42", 0, -1, 8, "w"); assert (list1.length ===  2);
		list1 = m.find ("04 08",             0, -1, 12    ); assert (list1.length === 12);
		list2 = m.find ("04 08",             0, -1, 12, ""); assert (list2.length === 12);
		assert (list1.toString() === list2.toString());

		if (process.platform === "linux" ||
			process.platform === "win32")
		{
			var mS = list[0].getBase();
			var mT = list[0].getBase() +
					 list[0].getSize();
		}

		if (process.platform === "darwin")
		{
			var segs = list[0].getSegments();
			assert (segs.length >= 2);
			var mS = segs[1].base;
			var mT = segs[1].base +
					 segs[1].size;
		}

		list1 = m.find ("00", mS, mT);
		assert (list1.length !== 0); list1.sort (sorter);
		assert (list1[0]                >= mS);
		assert (list1[list1.length - 1] <= mT);

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////
	// This section can be used to write miscellaneous tests on other applications.

	function testMisc()
	{
		return true;
	}



	//----------------------------------------------------------------------------//
	// Main                                                                       //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	return function()
	{
		log ("BEGIN MEMORY TESTING\n------------------------------\n");

		log ("Warning: Some set of tests cannot be automated\n"  );
		log ("         Please execute the following commands\n\n");

		var p1 = Process.getCurrent(), p2 = Process();
		log ("Open a program and input PID: "); var input = getline();
		var pid = parseInt (input); assert (pid > 0); assert (p2.open (pid));
		assert (p1.isValid()); assert (!p1.hasExited());
		assert (p2.isValid()); assert (!p2.hasExited()); log ("\n");

		if (process.arch === "ia32")
			assert (!p2.is64Bit()); // We don't support 64-Bit targets through 32-Bit

		if (!testInvalid (  )) { log (">> Invalid Failed   \n\n"); return false; }
		if (!testEquals  (  )) { log (">> Equals Failed    \n\n"); return false; }
		if (!testParams  (  )) { log (">> Params Failed    \n\n"); return false; }
		if (!testArgs    (  )) { log (">> Args Failed      \n\n"); return false; }
		if (!testDebug   (p1)) { log (">> Debug p1 Failed  \n\n"); return false; }
		if (!testDebug   (p2)) { log (">> Debug p2 Failed  \n\n"); return false; }
		if (!testRegion  (p1)) { log (">> Region p1 Failed \n\n"); return false; }
		if (!testRegion  (p2)) { log (">> Region p2 Failed \n\n"); return false; }
		if (!testModules (p1)) { log (">> Modules p1 Failed\n\n"); return false; }
		if (!testModules (p2)) { log (">> Modules p2 Failed\n\n"); return false; }
		if (!testStress  (  )) { log (">> Modules p2 Failed\n\n"); return false; }

		if (p2.getName().substr (0, 4) !== "Peon")
		{
			log ("Open peon app and input PID: "); var input = getline();
			var pid = parseInt (input); assert (pid > 0); assert (p2.open (pid));
			assert (p2.isValid()); assert (!p2.hasExited());
			assert (p2.getName().substr (0, 4) === "Peon"); log ("\n");
		}

		if (process.arch === "ia32")
			assert (!p2.is64Bit()); // We don't support 64-Bit targets through 32-Bit

		if (!testRW    (p2)) { log (">> RW Failed   \n\n"); return false; }
		if (!testCache (p2)) { log (">> Cache Failed\n\n"); return false; }
		if (!testFlags (p2)) { log (">> Flags Failed\n\n"); return false; }
		if (!testFind  (p2)) { log (">> Find Failed \n\n"); return false; }
		if (!testMisc  (  )) { log (">> Misc Failed \n\n"); return false; }

		log (">> Success\n\n"); return true;
	};
};
