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
	// Constants                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	// Check if the platform is Linux
	if (process.platform === "linux")
	{
		robot.KEY_SPACE			= 0x0020;
		robot.KEY_ESCAPE		= 0xFF1B;

		robot.KEY_TAB			= 0xFF09;
		robot.KEY_ALT			= 0xFFE9;
		robot.KEY_LALT			= 0xFFE9;
		robot.KEY_RALT			= 0xFFEA;
		robot.KEY_CONTROL		= 0xFFE3;
		robot.KEY_LCONTROL		= 0xFFE3;
		robot.KEY_RCONTROL		= 0xFFE4;
		robot.KEY_SHIFT			= 0xFFE1;
		robot.KEY_LSHIFT		= 0xFFE1;
		robot.KEY_RSHIFT		= 0xFFE2;
		robot.KEY_SYSTEM		= 0xFFEB;
		robot.KEY_LSYSTEM		= 0xFFEB;
		robot.KEY_RSYSTEM		= 0xFFEC;

		robot.KEY_F1			= 0xFFBE;
		robot.KEY_F2			= 0xFFBF;
		robot.KEY_F3			= 0xFFC0;
		robot.KEY_F4			= 0xFFC1;
		robot.KEY_F5			= 0xFFC2;
		robot.KEY_F6			= 0xFFC3;
		robot.KEY_F7			= 0xFFC4;
		robot.KEY_F8			= 0xFFC5;
		robot.KEY_F9			= 0xFFC6;
		robot.KEY_F10			= 0xFFC7;
		robot.KEY_F11			= 0xFFC8;
		robot.KEY_F12			= 0xFFC9;

		robot.KEY_0				= 0x0030;
		robot.KEY_1				= 0x0031;
		robot.KEY_2				= 0x0032;
		robot.KEY_3				= 0x0033;
		robot.KEY_4				= 0x0034;
		robot.KEY_5				= 0x0035;
		robot.KEY_6				= 0x0036;
		robot.KEY_7				= 0x0037;
		robot.KEY_8				= 0x0038;
		robot.KEY_9				= 0x0039;

		robot.KEY_A				= 0x0061;
		robot.KEY_B				= 0x0062;
		robot.KEY_C				= 0x0063;
		robot.KEY_D				= 0x0064;
		robot.KEY_E				= 0x0065;
		robot.KEY_F				= 0x0066;
		robot.KEY_G				= 0x0067;
		robot.KEY_H				= 0x0068;
		robot.KEY_I				= 0x0069;
		robot.KEY_J				= 0x006A;
		robot.KEY_K				= 0x006B;
		robot.KEY_L				= 0x006C;
		robot.KEY_M				= 0x006D;
		robot.KEY_N				= 0x006E;
		robot.KEY_O				= 0x006F;
		robot.KEY_P				= 0x0070;
		robot.KEY_Q				= 0x0071;
		robot.KEY_R				= 0x0072;
		robot.KEY_S				= 0x0073;
		robot.KEY_T				= 0x0074;
		robot.KEY_U				= 0x0075;
		robot.KEY_V				= 0x0076;
		robot.KEY_W				= 0x0077;
		robot.KEY_X				= 0x0078;
		robot.KEY_Y				= 0x0079;
		robot.KEY_Z				= 0x007A;

		robot.KEY_GRAVE			= 0x0060;
		robot.KEY_MINUS			= 0x002D;
		robot.KEY_EQUAL			= 0x003D;
		robot.KEY_BACKSPACE		= 0xFF08;
		robot.KEY_LBRACKET		= 0x005B;
		robot.KEY_RBRACKET		= 0x005D;
		robot.KEY_BACKSLASH		= 0x005C;
		robot.KEY_SEMICOLON		= 0x003B;
		robot.KEY_QUOTE			= 0x0027;
		robot.KEY_RETURN		= 0xFF0D;
		robot.KEY_COMMA			= 0x002C;
		robot.KEY_PERIOD		= 0x002E;
		robot.KEY_SLASH			= 0x002F;

		robot.KEY_LEFT			= 0xFF51;
		robot.KEY_UP			= 0xFF52;
		robot.KEY_RIGHT			= 0xFF53;
		robot.KEY_DOWN			= 0xFF54;

		robot.KEY_PRINT			= 0xFF61;
		robot.KEY_PAUSE			= 0xFF13;
		robot.KEY_INSERT		= 0xFF63;
		robot.KEY_DELETE		= 0xFFFF;
		robot.KEY_HOME			= 0xFF50;
		robot.KEY_END			= 0xFF57;
		robot.KEY_PAGE_UP		= 0xFF55;
		robot.KEY_PAGE_DOWN		= 0xFF56;

		robot.KEY_ADD			= 0xFFAB;
		robot.KEY_SUBTRACT		= 0xFFAD;
		robot.KEY_MULTIPLY		= 0xFFAA;
		robot.KEY_DIVIDE		= 0xFFAF;
		robot.KEY_DECIMAL		= 0xFFAE;
		robot.KEY_ENTER			= 0xFF8D;

		robot.KEY_NUM0			= 0xFFB0;
		robot.KEY_NUM1			= 0xFFB1;
		robot.KEY_NUM2			= 0xFFB2;
		robot.KEY_NUM3			= 0xFFB3;
		robot.KEY_NUM4			= 0xFFB4;
		robot.KEY_NUM5			= 0xFFB5;
		robot.KEY_NUM6			= 0xFFB6;
		robot.KEY_NUM7			= 0xFFB7;
		robot.KEY_NUM8			= 0xFFB8;
		robot.KEY_NUM9			= 0xFFB9;

		robot.KEY_CAPS_LOCK		= 0xFFE5;
		robot.KEY_SCROLL_LOCK	= 0xFF14;
		robot.KEY_NUM_LOCK		= 0xFF7F;
	}

	// Check if the platform is Mac
	if (process.platform === "darwin")
	{
		robot.KEY_SPACE			= 0x31;
		robot.KEY_ESCAPE		= 0x35;

		robot.KEY_TAB			= 0x30;
		robot.KEY_ALT			= 0x3A;
		robot.KEY_LALT			= 0x3A;
		robot.KEY_RALT			= 0x3D;
		robot.KEY_CONTROL		= 0x3B;
		robot.KEY_LCONTROL		= 0x3B;
		robot.KEY_RCONTROL		= 0x3E;
		robot.KEY_SHIFT			= 0x38;
		robot.KEY_LSHIFT		= 0x38;
		robot.KEY_RSHIFT		= 0x3C;
		robot.KEY_SYSTEM		= 0x37;
		robot.KEY_LSYSTEM		= 0x37;
		robot.KEY_RSYSTEM		= 0x36;

		robot.KEY_F1			= 0x7A;
		robot.KEY_F2			= 0x78;
		robot.KEY_F3			= 0x63;
		robot.KEY_F4			= 0x76;
		robot.KEY_F5			= 0x60;
		robot.KEY_F6			= 0x61;
		robot.KEY_F7			= 0x62;
		robot.KEY_F8			= 0x64;
		robot.KEY_F9			= 0x65;
		robot.KEY_F10			= 0x6D;
		robot.KEY_F11			= 0x67;
		robot.KEY_F12			= 0x6F;

		robot.KEY_0				= 0x1D;
		robot.KEY_1				= 0x12;
		robot.KEY_2				= 0x13;
		robot.KEY_3				= 0x14;
		robot.KEY_4				= 0x15;
		robot.KEY_5				= 0x17;
		robot.KEY_6				= 0x16;
		robot.KEY_7				= 0x1A;
		robot.KEY_8				= 0x1C;
		robot.KEY_9				= 0x19;

		robot.KEY_A				= 0x00;
		robot.KEY_B				= 0x0B;
		robot.KEY_C				= 0x08;
		robot.KEY_D				= 0x02;
		robot.KEY_E				= 0x0E;
		robot.KEY_F				= 0x03;
		robot.KEY_G				= 0x05;
		robot.KEY_H				= 0x04;
		robot.KEY_I				= 0x22;
		robot.KEY_J				= 0x26;
		robot.KEY_K				= 0x28;
		robot.KEY_L				= 0x25;
		robot.KEY_M				= 0x2E;
		robot.KEY_N				= 0x2D;
		robot.KEY_O				= 0x1F;
		robot.KEY_P				= 0x23;
		robot.KEY_Q				= 0x0C;
		robot.KEY_R				= 0x0F;
		robot.KEY_S				= 0x01;
		robot.KEY_T				= 0x11;
		robot.KEY_U				= 0x20;
		robot.KEY_V				= 0x09;
		robot.KEY_W				= 0x0D;
		robot.KEY_X				= 0x07;
		robot.KEY_Y				= 0x10;
		robot.KEY_Z				= 0x06;

		robot.KEY_GRAVE			= 0x32;
		robot.KEY_MINUS			= 0x1B;
		robot.KEY_EQUAL			= 0x18;
		robot.KEY_BACKSPACE		= 0x33;
		robot.KEY_LBRACKET		= 0x21;
		robot.KEY_RBRACKET		= 0x1E;
		robot.KEY_BACKSLASH		= 0x2A;
		robot.KEY_SEMICOLON		= 0x29;
		robot.KEY_QUOTE			= 0x27;
		robot.KEY_RETURN		= 0x24;
		robot.KEY_COMMA			= 0x2B;
		robot.KEY_PERIOD		= 0x2F;
		robot.KEY_SLASH			= 0x2C;

		robot.KEY_LEFT			= 0x7B;
		robot.KEY_UP			= 0x7E;
		robot.KEY_RIGHT			= 0x7C;
		robot.KEY_DOWN			= 0x7D;

		robot.KEY_PRINT			= 0x69;
		robot.KEY_PAUSE			= 0x71;
		robot.KEY_INSERT		= 0x72;
		robot.KEY_DELETE		= 0x75;
		robot.KEY_HOME			= 0x73;
		robot.KEY_END			= 0x77;
		robot.KEY_PAGE_UP		= 0x74;
		robot.KEY_PAGE_DOWN		= 0x79;

		robot.KEY_ADD			= 0x45;
		robot.KEY_SUBTRACT		= 0x4E;
		robot.KEY_MULTIPLY		= 0x43;
		robot.KEY_DIVIDE		= 0x4B;
		robot.KEY_DECIMAL		= 0x41;
		robot.KEY_ENTER			= 0x4C;

		robot.KEY_NUM0			= 0x52;
		robot.KEY_NUM1			= 0x53;
		robot.KEY_NUM2			= 0x54;
		robot.KEY_NUM3			= 0x55;
		robot.KEY_NUM4			= 0x56;
		robot.KEY_NUM5			= 0x57;
		robot.KEY_NUM6			= 0x58;
		robot.KEY_NUM7			= 0x59;
		robot.KEY_NUM8			= 0x5B;
		robot.KEY_NUM9			= 0x5C;

		robot.KEY_CAPS_LOCK		= 0x39;
		robot.KEY_SCROLL_LOCK	= 0x6B;
		robot.KEY_NUM_LOCK		= 0x47;
	}

	// Check if the platform is Win
	if (process.platform === "win32")
	{
		robot.KEY_SPACE			= 0x20;
		robot.KEY_ESCAPE		= 0x1B;

		robot.KEY_TAB			= 0x09;
		robot.KEY_ALT			= 0x12;
		robot.KEY_LALT			= 0xA4;
		robot.KEY_RALT			= 0xA5;
		robot.KEY_CONTROL		= 0x11;
		robot.KEY_LCONTROL		= 0xA2;
		robot.KEY_RCONTROL		= 0xA3;
		robot.KEY_SHIFT			= 0x10;
		robot.KEY_LSHIFT		= 0xA0;
		robot.KEY_RSHIFT		= 0xA1;
		robot.KEY_SYSTEM		= 0x5B;
		robot.KEY_LSYSTEM		= 0x5B;
		robot.KEY_RSYSTEM		= 0x5C;

		robot.KEY_F1			= 0x70;
		robot.KEY_F2			= 0x71;
		robot.KEY_F3			= 0x72;
		robot.KEY_F4			= 0x73;
		robot.KEY_F5			= 0x74;
		robot.KEY_F6			= 0x75;
		robot.KEY_F7			= 0x76;
		robot.KEY_F8			= 0x77;
		robot.KEY_F9			= 0x78;
		robot.KEY_F10			= 0x79;
		robot.KEY_F11			= 0x7A;
		robot.KEY_F12			= 0x7B;

		robot.KEY_0				= 0x30;
		robot.KEY_1				= 0x31;
		robot.KEY_2				= 0x32;
		robot.KEY_3				= 0x33;
		robot.KEY_4				= 0x34;
		robot.KEY_5				= 0x35;
		robot.KEY_6				= 0x36;
		robot.KEY_7				= 0x37;
		robot.KEY_8				= 0x38;
		robot.KEY_9				= 0x39;

		robot.KEY_A				= 0x41;
		robot.KEY_B				= 0x42;
		robot.KEY_C				= 0x43;
		robot.KEY_D				= 0x44;
		robot.KEY_E				= 0x45;
		robot.KEY_F				= 0x46;
		robot.KEY_G				= 0x47;
		robot.KEY_H				= 0x48;
		robot.KEY_I				= 0x49;
		robot.KEY_J				= 0x4A;
		robot.KEY_K				= 0x4B;
		robot.KEY_L				= 0x4C;
		robot.KEY_M				= 0x4D;
		robot.KEY_N				= 0x4E;
		robot.KEY_O				= 0x4F;
		robot.KEY_P				= 0x50;
		robot.KEY_Q				= 0x51;
		robot.KEY_R				= 0x52;
		robot.KEY_S				= 0x53;
		robot.KEY_T				= 0x54;
		robot.KEY_U				= 0x55;
		robot.KEY_V				= 0x56;
		robot.KEY_W				= 0x57;
		robot.KEY_X				= 0x58;
		robot.KEY_Y				= 0x59;
		robot.KEY_Z				= 0x5A;

		robot.KEY_GRAVE			= 0xC0;
		robot.KEY_MINUS			= 0xBD;
		robot.KEY_EQUAL			= 0xBB;
		robot.KEY_BACKSPACE		= 0x08;
		robot.KEY_LBRACKET		= 0xDB;
		robot.KEY_RBRACKET		= 0xDD;
		robot.KEY_BACKSLASH		= 0xDC;
		robot.KEY_SEMICOLON		= 0xBA;
		robot.KEY_QUOTE			= 0xDE;
		robot.KEY_RETURN		= 0x0D;
		robot.KEY_COMMA			= 0xBC;
		robot.KEY_PERIOD		= 0xBE;
		robot.KEY_SLASH			= 0xBF;

		robot.KEY_LEFT			= 0x25;
		robot.KEY_UP			= 0x26;
		robot.KEY_RIGHT			= 0x27;
		robot.KEY_DOWN			= 0x28;

		robot.KEY_PRINT			= 0x2C;
		robot.KEY_PAUSE			= 0x13;
		robot.KEY_INSERT		= 0x2D;
		robot.KEY_DELETE		= 0x2E;
		robot.KEY_HOME			= 0x24;
		robot.KEY_END			= 0x23;
		robot.KEY_PAGE_UP		= 0x21;
		robot.KEY_PAGE_DOWN		= 0x22;

		robot.KEY_ADD			= 0x6B;
		robot.KEY_SUBTRACT		= 0x6D;
		robot.KEY_MULTIPLY		= 0x6A;
		robot.KEY_DIVIDE		= 0x6F;
		robot.KEY_DECIMAL		= 0x6E;
		robot.KEY_ENTER			= 0x0D;

		robot.KEY_NUM0			= 0x60;
		robot.KEY_NUM1			= 0x61;
		robot.KEY_NUM2			= 0x62;
		robot.KEY_NUM3			= 0x63;
		robot.KEY_NUM4			= 0x64;
		robot.KEY_NUM5			= 0x65;
		robot.KEY_NUM6			= 0x66;
		robot.KEY_NUM7			= 0x67;
		robot.KEY_NUM8			= 0x68;
		robot.KEY_NUM9			= 0x69;

		robot.KEY_CAPS_LOCK		= 0x14;
		robot.KEY_SCROLL_LOCK	= 0x91;
		robot.KEY_NUM_LOCK		= 0x90;
	}



	//----------------------------------------------------------------------------//
	// Constructor                                                       Keyboard //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function Keyboard()
	{
		// Auto instantiate the Keyboard
		if (!(this instanceof Keyboard))
			return new Keyboard();

		// Setup the initial auto delay range
		this.autoDelay = robot.Range (40, 90);
		this._keyboard = new native.Keyboard();
	}



	//----------------------------------------------------------------------------//
	// Functions                                                         Keyboard //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Keyboard.prototype.click = function (keycode)
	{
		// Verify that keycode is valid
		if (typeof keycode !== "number" &&
			typeof keycode !== "string")
			throw new TypeError ("Invalid arguments");

		return this._keyboard.click (keycode,
						  this.autoDelay.min,
						  this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	Keyboard.prototype.press = function (keycode)
	{
		// Verify that keycode is valid
		if (typeof keycode !== "number")
			throw new TypeError ("Invalid arguments");

		this._keyboard.press (keycode,
				   this.autoDelay.min,
				   this.autoDelay.max);
	};

	////////////////////////////////////////////////////////////////////////////////

	Keyboard.prototype.release = function (keycode)
	{
		// Verify that keycode is valid
		if (typeof keycode !== "number")
			throw new TypeError ("Invalid arguments");

		this._keyboard.release (keycode,
					 this.autoDelay.min,
					 this.autoDelay.max);
	};



	//----------------------------------------------------------------------------//
	// Static                                                            Keyboard //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	Keyboard.compile = function (keys)
	{
		// Verify that keys is valid
		if (typeof keys !== "string")
			throw new TypeError ("Invalid arguments");

		return native.Keyboard.compile (keys);
	};

	////////////////////////////////////////////////////////////////////////////////

	Keyboard.getState = function (keycode)
	{
		// Verify that keycode is valid
		if (keycode !== undefined &&
			typeof keycode !== "number")
			throw new TypeError ("Invalid arguments");

		return native.Keyboard.getState (keycode);
	};

	////////////////////////////////////////////////////////////////////////////////

	return Keyboard;
};
