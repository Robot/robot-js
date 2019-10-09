////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                       (C) 2010-2018 Robot Developers                       //
//                       See LICENSE for licensing info                       //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------//
// Prefaces                                                                   //
//----------------------------------------------------------------------------//

#include "NodeImage.h"

#include "NodeKeyboard.h"
#include "NodeMouse.h"

#include "NodeProcess.h"
#include "NodeMemory.h"

#include "NodeWindow.h"
#include "NodeScreen.h"
#include "NodeClipboard.h"

Persistent<Function> JsColor;
Persistent<Function> JsRange;
Persistent<Function> JsPoint;
Persistent<Function> JsSize;
Persistent<Function> JsBounds;

Persistent<Function> JsModule;
Persistent<Function> JsSegment;
Persistent<Function> JsStats;
Persistent<Function> JsRegion;



//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

static void Prepare (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; auto jsRobot = TO_OBJECT (args[0]);
	OBJECT_SET (jsRobot, NEW_STR ("ROBOT_VERSION"    ), NEW_INT (ROBOT_VERSION    ));
	OBJECT_SET (jsRobot, NEW_STR ("ROBOT_VERSION_STR"), NEW_STR (ROBOT_VERSION_STR));

	auto color   = Local<Function>::Cast (OBJECT_GET (jsRobot, NEW_STR ("Color"  )));
	auto range   = Local<Function>::Cast (OBJECT_GET (jsRobot, NEW_STR ("Range"  )));
	auto point   = Local<Function>::Cast (OBJECT_GET (jsRobot, NEW_STR ("Point"  )));
	auto size    = Local<Function>::Cast (OBJECT_GET (jsRobot, NEW_STR ("Size"   )));
	auto bounds  = Local<Function>::Cast (OBJECT_GET (jsRobot, NEW_STR ("Bounds" )));

	auto module  = Local<Function>::Cast (OBJECT_GET (jsRobot, NEW_STR ("Module" )));
	auto memory  = Local<Function>::Cast (OBJECT_GET (jsRobot, NEW_STR ("Memory" )));
	auto segment = Local<Function>::Cast (OBJECT_GET (module,  NEW_STR ("Segment")));
	auto stats   = Local<Function>::Cast (OBJECT_GET (memory,  NEW_STR ("Stats"  )));
	auto region  = Local<Function>::Cast (OBJECT_GET (memory,  NEW_STR ("Region" )));

	JsColor  .Reset (isolate, color  );
	JsRange  .Reset (isolate, range  );
	JsPoint  .Reset (isolate, point  );
	JsSize   .Reset (isolate, size   );
	JsBounds .Reset (isolate, bounds );

	JsModule .Reset (isolate, module );
	JsSegment.Reset (isolate, segment);
	JsStats  .Reset (isolate, stats  );
	JsRegion .Reset (isolate, region );



	//----------------------------------------------------------------------------//
	// Key                                                                        //
	//----------------------------------------------------------------------------//

	OBJECT_SET (jsRobot, NEW_STR ("KEY_SPACE"		), NEW_INT (KeySpace		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_ESCAPE"		), NEW_INT (KeyEscape		));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_TAB"		), NEW_INT (KeyTab			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_ALT"		), NEW_INT (KeyAlt			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_LALT"		), NEW_INT (KeyLAlt			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_RALT"		), NEW_INT (KeyRAlt			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_CONTROL"	), NEW_INT (KeyControl		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_LCONTROL"	), NEW_INT (KeyLControl		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_RCONTROL"	), NEW_INT (KeyRControl		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_SHIFT"		), NEW_INT (KeyShift		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_LSHIFT"		), NEW_INT (KeyLShift		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_RSHIFT"		), NEW_INT (KeyRShift		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_SYSTEM"		), NEW_INT (KeySystem		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_LSYSTEM"	), NEW_INT (KeyLSystem		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_RSYSTEM"	), NEW_INT (KeyRSystem		));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_F1"			), NEW_INT (KeyF1			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F2"			), NEW_INT (KeyF2			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F3"			), NEW_INT (KeyF3			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F4"			), NEW_INT (KeyF4			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F5"			), NEW_INT (KeyF5			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F6"			), NEW_INT (KeyF6			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F7"			), NEW_INT (KeyF7			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F8"			), NEW_INT (KeyF8			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F9"			), NEW_INT (KeyF9			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F10"		), NEW_INT (KeyF10			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F11"		), NEW_INT (KeyF11			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F12"		), NEW_INT (KeyF12			));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_0"			), NEW_INT (Key0			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_1"			), NEW_INT (Key1			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_2"			), NEW_INT (Key2			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_3"			), NEW_INT (Key3			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_4"			), NEW_INT (Key4			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_5"			), NEW_INT (Key5			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_6"			), NEW_INT (Key6			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_7"			), NEW_INT (Key7			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_8"			), NEW_INT (Key8			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_9"			), NEW_INT (Key9			));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_A"			), NEW_INT (KeyA			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_B"			), NEW_INT (KeyB			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_C"			), NEW_INT (KeyC			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_D"			), NEW_INT (KeyD			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_E"			), NEW_INT (KeyE			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_F"			), NEW_INT (KeyF			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_G"			), NEW_INT (KeyG			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_H"			), NEW_INT (KeyH			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_I"			), NEW_INT (KeyI			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_J"			), NEW_INT (KeyJ			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_K"			), NEW_INT (KeyK			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_L"			), NEW_INT (KeyL			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_M"			), NEW_INT (KeyM			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_N"			), NEW_INT (KeyN			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_O"			), NEW_INT (KeyO			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_P"			), NEW_INT (KeyP			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_Q"			), NEW_INT (KeyQ			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_R"			), NEW_INT (KeyR			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_S"			), NEW_INT (KeyS			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_T"			), NEW_INT (KeyT			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_U"			), NEW_INT (KeyU			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_V"			), NEW_INT (KeyV			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_W"			), NEW_INT (KeyW			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_X"			), NEW_INT (KeyX			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_Y"			), NEW_INT (KeyY			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_Z"			), NEW_INT (KeyZ			));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_GRAVE"		), NEW_INT (KeyGrave		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_MINUS"		), NEW_INT (KeyMinus		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_EQUAL"		), NEW_INT (KeyEqual		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_BACKSPACE"	), NEW_INT (KeyBackspace	));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_LBRACKET"	), NEW_INT (KeyLBracket		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_RBRACKET"	), NEW_INT (KeyRBracket		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_BACKSLASH"	), NEW_INT (KeyBackslash	));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_SEMICOLON"	), NEW_INT (KeySemicolon	));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_QUOTE"		), NEW_INT (KeyQuote		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_RETURN"		), NEW_INT (KeyReturn		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_COMMA"		), NEW_INT (KeyComma		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_PERIOD"		), NEW_INT (KeyPeriod		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_SLASH"		), NEW_INT (KeySlash		));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_LEFT"		), NEW_INT (KeyLeft			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_UP"			), NEW_INT (KeyUp			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_RIGHT"		), NEW_INT (KeyRight		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_DOWN"		), NEW_INT (KeyDown			));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_PRINT"		), NEW_INT (KeyPrint		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_PAUSE"		), NEW_INT (KeyPause		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_INSERT"		), NEW_INT (KeyInsert		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_DELETE"		), NEW_INT (KeyDelete		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_HOME"		), NEW_INT (KeyHome			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_END"		), NEW_INT (KeyEnd			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_PAGE_UP"	), NEW_INT (KeyPageUp		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_PAGE_DOWN"	), NEW_INT (KeyPageDown		));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_ADD"		), NEW_INT (KeyAdd			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_SUBTRACT"	), NEW_INT (KeySubtract		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_MULTIPLY"	), NEW_INT (KeyMultiply		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_DIVIDE"		), NEW_INT (KeyDivide		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_DECIMAL"	), NEW_INT (KeyDecimal		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_ENTER"		), NEW_INT (KeyEnter		));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM0"		), NEW_INT (KeyNum0			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM1"		), NEW_INT (KeyNum1			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM2"		), NEW_INT (KeyNum2			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM3"		), NEW_INT (KeyNum3			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM4"		), NEW_INT (KeyNum4			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM5"		), NEW_INT (KeyNum5			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM6"		), NEW_INT (KeyNum6			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM7"		), NEW_INT (KeyNum7			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM8"		), NEW_INT (KeyNum8			));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM9"		), NEW_INT (KeyNum9			));

	OBJECT_SET (jsRobot, NEW_STR ("KEY_CAPS_LOCK"	), NEW_INT (KeyCapsLock		));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_SCROLL_LOCK"), NEW_INT (KeyScrollLock	));
	OBJECT_SET (jsRobot, NEW_STR ("KEY_NUM_LOCK"	), NEW_INT (KeyNumLock		));



	//----------------------------------------------------------------------------//
	// Button                                                                     //
	//----------------------------------------------------------------------------//

	OBJECT_SET (jsRobot, NEW_STR ("BUTTON_LEFT"	), NEW_INT (ButtonLeft		));
	OBJECT_SET (jsRobot, NEW_STR ("BUTTON_MID"		), NEW_INT (ButtonMid		));
	OBJECT_SET (jsRobot, NEW_STR ("BUTTON_MIDDLE"	), NEW_INT (ButtonMiddle	));
	OBJECT_SET (jsRobot, NEW_STR ("BUTTON_RIGHT"	), NEW_INT (ButtonRight		));
	OBJECT_SET (jsRobot, NEW_STR ("BUTTON_X1"		), NEW_INT (ButtonX1		));
	OBJECT_SET (jsRobot, NEW_STR ("BUTTON_X2"		), NEW_INT (ButtonX2		));
}

////////////////////////////////////////////////////////////////////////////////

static void Sleep (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; Timer::Sleep (UINT32_VALUE (args[0]));
}

////////////////////////////////////////////////////////////////////////////////

static void Clock (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; RETURN_NUM ((double) Timer::GetCpuTime());
}



//----------------------------------------------------------------------------//
// Main                                                                       //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

static void Initialize (Local<Object> exports)
{
	NODE_SET_METHOD (exports, "prepare", Prepare);
	NODE_SET_METHOD (exports, "sleep",   Sleep  );
	NODE_SET_METHOD (exports, "clock",   Clock  );

	    ImageWrap::Initialize (exports);

	 KeyboardWrap::Initialize (exports);
	    MouseWrap::Initialize (exports);

	  ProcessWrap::Initialize (exports);
	   MemoryWrap::Initialize (exports);

	   WindowWrap::Initialize (exports);
	   ScreenWrap::Initialize (exports);
	ClipboardWrap::Initialize (exports);
}

////////////////////////////////////////////////////////////////////////////////

NODE_MODULE (robot, Initialize);
