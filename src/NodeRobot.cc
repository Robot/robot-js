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
	ISOLATE; auto jsRobot = args[0]->ToObject();
	jsRobot->Set (NEW_STR ("ROBOT_VERSION"    ), NEW_INT (ROBOT_VERSION    ));
	jsRobot->Set (NEW_STR ("ROBOT_VERSION_STR"), NEW_STR (ROBOT_VERSION_STR));

	auto color   = Local<Function>::Cast (jsRobot->Get (NEW_STR ("Color"  )));
	auto range   = Local<Function>::Cast (jsRobot->Get (NEW_STR ("Range"  )));
	auto point   = Local<Function>::Cast (jsRobot->Get (NEW_STR ("Point"  )));
	auto size    = Local<Function>::Cast (jsRobot->Get (NEW_STR ("Size"   )));
	auto bounds  = Local<Function>::Cast (jsRobot->Get (NEW_STR ("Bounds" )));

	auto module  = Local<Function>::Cast (jsRobot->Get (NEW_STR ("Module" )));
	auto memory  = Local<Function>::Cast (jsRobot->Get (NEW_STR ("Memory" )));
	auto segment = Local<Function>::Cast ( module->Get (NEW_STR ("Segment")));
	auto stats   = Local<Function>::Cast ( memory->Get (NEW_STR ("Stats"  )));
	auto region  = Local<Function>::Cast ( memory->Get (NEW_STR ("Region" )));

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

	jsRobot->Set (NEW_STR ("KEY_SPACE"		), NEW_INT (KeySpace		));
	jsRobot->Set (NEW_STR ("KEY_ESCAPE"		), NEW_INT (KeyEscape		));

	jsRobot->Set (NEW_STR ("KEY_TAB"		), NEW_INT (KeyTab			));
	jsRobot->Set (NEW_STR ("KEY_ALT"		), NEW_INT (KeyAlt			));
	jsRobot->Set (NEW_STR ("KEY_LALT"		), NEW_INT (KeyLAlt			));
	jsRobot->Set (NEW_STR ("KEY_RALT"		), NEW_INT (KeyRAlt			));
	jsRobot->Set (NEW_STR ("KEY_CONTROL"	), NEW_INT (KeyControl		));
	jsRobot->Set (NEW_STR ("KEY_LCONTROL"	), NEW_INT (KeyLControl		));
	jsRobot->Set (NEW_STR ("KEY_RCONTROL"	), NEW_INT (KeyRControl		));
	jsRobot->Set (NEW_STR ("KEY_SHIFT"		), NEW_INT (KeyShift		));
	jsRobot->Set (NEW_STR ("KEY_LSHIFT"		), NEW_INT (KeyLShift		));
	jsRobot->Set (NEW_STR ("KEY_RSHIFT"		), NEW_INT (KeyRShift		));
	jsRobot->Set (NEW_STR ("KEY_SYSTEM"		), NEW_INT (KeySystem		));
	jsRobot->Set (NEW_STR ("KEY_LSYSTEM"	), NEW_INT (KeyLSystem		));
	jsRobot->Set (NEW_STR ("KEY_RSYSTEM"	), NEW_INT (KeyRSystem		));

	jsRobot->Set (NEW_STR ("KEY_F1"			), NEW_INT (KeyF1			));
	jsRobot->Set (NEW_STR ("KEY_F2"			), NEW_INT (KeyF2			));
	jsRobot->Set (NEW_STR ("KEY_F3"			), NEW_INT (KeyF3			));
	jsRobot->Set (NEW_STR ("KEY_F4"			), NEW_INT (KeyF4			));
	jsRobot->Set (NEW_STR ("KEY_F5"			), NEW_INT (KeyF5			));
	jsRobot->Set (NEW_STR ("KEY_F6"			), NEW_INT (KeyF6			));
	jsRobot->Set (NEW_STR ("KEY_F7"			), NEW_INT (KeyF7			));
	jsRobot->Set (NEW_STR ("KEY_F8"			), NEW_INT (KeyF8			));
	jsRobot->Set (NEW_STR ("KEY_F9"			), NEW_INT (KeyF9			));
	jsRobot->Set (NEW_STR ("KEY_F10"		), NEW_INT (KeyF10			));
	jsRobot->Set (NEW_STR ("KEY_F11"		), NEW_INT (KeyF11			));
	jsRobot->Set (NEW_STR ("KEY_F12"		), NEW_INT (KeyF12			));

	jsRobot->Set (NEW_STR ("KEY_0"			), NEW_INT (Key0			));
	jsRobot->Set (NEW_STR ("KEY_1"			), NEW_INT (Key1			));
	jsRobot->Set (NEW_STR ("KEY_2"			), NEW_INT (Key2			));
	jsRobot->Set (NEW_STR ("KEY_3"			), NEW_INT (Key3			));
	jsRobot->Set (NEW_STR ("KEY_4"			), NEW_INT (Key4			));
	jsRobot->Set (NEW_STR ("KEY_5"			), NEW_INT (Key5			));
	jsRobot->Set (NEW_STR ("KEY_6"			), NEW_INT (Key6			));
	jsRobot->Set (NEW_STR ("KEY_7"			), NEW_INT (Key7			));
	jsRobot->Set (NEW_STR ("KEY_8"			), NEW_INT (Key8			));
	jsRobot->Set (NEW_STR ("KEY_9"			), NEW_INT (Key9			));

	jsRobot->Set (NEW_STR ("KEY_A"			), NEW_INT (KeyA			));
	jsRobot->Set (NEW_STR ("KEY_B"			), NEW_INT (KeyB			));
	jsRobot->Set (NEW_STR ("KEY_C"			), NEW_INT (KeyC			));
	jsRobot->Set (NEW_STR ("KEY_D"			), NEW_INT (KeyD			));
	jsRobot->Set (NEW_STR ("KEY_E"			), NEW_INT (KeyE			));
	jsRobot->Set (NEW_STR ("KEY_F"			), NEW_INT (KeyF			));
	jsRobot->Set (NEW_STR ("KEY_G"			), NEW_INT (KeyG			));
	jsRobot->Set (NEW_STR ("KEY_H"			), NEW_INT (KeyH			));
	jsRobot->Set (NEW_STR ("KEY_I"			), NEW_INT (KeyI			));
	jsRobot->Set (NEW_STR ("KEY_J"			), NEW_INT (KeyJ			));
	jsRobot->Set (NEW_STR ("KEY_K"			), NEW_INT (KeyK			));
	jsRobot->Set (NEW_STR ("KEY_L"			), NEW_INT (KeyL			));
	jsRobot->Set (NEW_STR ("KEY_M"			), NEW_INT (KeyM			));
	jsRobot->Set (NEW_STR ("KEY_N"			), NEW_INT (KeyN			));
	jsRobot->Set (NEW_STR ("KEY_O"			), NEW_INT (KeyO			));
	jsRobot->Set (NEW_STR ("KEY_P"			), NEW_INT (KeyP			));
	jsRobot->Set (NEW_STR ("KEY_Q"			), NEW_INT (KeyQ			));
	jsRobot->Set (NEW_STR ("KEY_R"			), NEW_INT (KeyR			));
	jsRobot->Set (NEW_STR ("KEY_S"			), NEW_INT (KeyS			));
	jsRobot->Set (NEW_STR ("KEY_T"			), NEW_INT (KeyT			));
	jsRobot->Set (NEW_STR ("KEY_U"			), NEW_INT (KeyU			));
	jsRobot->Set (NEW_STR ("KEY_V"			), NEW_INT (KeyV			));
	jsRobot->Set (NEW_STR ("KEY_W"			), NEW_INT (KeyW			));
	jsRobot->Set (NEW_STR ("KEY_X"			), NEW_INT (KeyX			));
	jsRobot->Set (NEW_STR ("KEY_Y"			), NEW_INT (KeyY			));
	jsRobot->Set (NEW_STR ("KEY_Z"			), NEW_INT (KeyZ			));

	jsRobot->Set (NEW_STR ("KEY_GRAVE"		), NEW_INT (KeyGrave		));
	jsRobot->Set (NEW_STR ("KEY_MINUS"		), NEW_INT (KeyMinus		));
	jsRobot->Set (NEW_STR ("KEY_EQUAL"		), NEW_INT (KeyEqual		));
	jsRobot->Set (NEW_STR ("KEY_BACKSPACE"	), NEW_INT (KeyBackspace	));
	jsRobot->Set (NEW_STR ("KEY_LBRACKET"	), NEW_INT (KeyLBracket		));
	jsRobot->Set (NEW_STR ("KEY_RBRACKET"	), NEW_INT (KeyRBracket		));
	jsRobot->Set (NEW_STR ("KEY_BACKSLASH"	), NEW_INT (KeyBackslash	));
	jsRobot->Set (NEW_STR ("KEY_SEMICOLON"	), NEW_INT (KeySemicolon	));
	jsRobot->Set (NEW_STR ("KEY_QUOTE"		), NEW_INT (KeyQuote		));
	jsRobot->Set (NEW_STR ("KEY_RETURN"		), NEW_INT (KeyReturn		));
	jsRobot->Set (NEW_STR ("KEY_COMMA"		), NEW_INT (KeyComma		));
	jsRobot->Set (NEW_STR ("KEY_PERIOD"		), NEW_INT (KeyPeriod		));
	jsRobot->Set (NEW_STR ("KEY_SLASH"		), NEW_INT (KeySlash		));

	jsRobot->Set (NEW_STR ("KEY_LEFT"		), NEW_INT (KeyLeft			));
	jsRobot->Set (NEW_STR ("KEY_UP"			), NEW_INT (KeyUp			));
	jsRobot->Set (NEW_STR ("KEY_RIGHT"		), NEW_INT (KeyRight		));
	jsRobot->Set (NEW_STR ("KEY_DOWN"		), NEW_INT (KeyDown			));

	jsRobot->Set (NEW_STR ("KEY_PRINT"		), NEW_INT (KeyPrint		));
	jsRobot->Set (NEW_STR ("KEY_PAUSE"		), NEW_INT (KeyPause		));
	jsRobot->Set (NEW_STR ("KEY_INSERT"		), NEW_INT (KeyInsert		));
	jsRobot->Set (NEW_STR ("KEY_DELETE"		), NEW_INT (KeyDelete		));
	jsRobot->Set (NEW_STR ("KEY_HOME"		), NEW_INT (KeyHome			));
	jsRobot->Set (NEW_STR ("KEY_END"		), NEW_INT (KeyEnd			));
	jsRobot->Set (NEW_STR ("KEY_PAGE_UP"	), NEW_INT (KeyPageUp		));
	jsRobot->Set (NEW_STR ("KEY_PAGE_DOWN"	), NEW_INT (KeyPageDown		));

	jsRobot->Set (NEW_STR ("KEY_ADD"		), NEW_INT (KeyAdd			));
	jsRobot->Set (NEW_STR ("KEY_SUBTRACT"	), NEW_INT (KeySubtract		));
	jsRobot->Set (NEW_STR ("KEY_MULTIPLY"	), NEW_INT (KeyMultiply		));
	jsRobot->Set (NEW_STR ("KEY_DIVIDE"		), NEW_INT (KeyDivide		));
	jsRobot->Set (NEW_STR ("KEY_DECIMAL"	), NEW_INT (KeyDecimal		));
	jsRobot->Set (NEW_STR ("KEY_ENTER"		), NEW_INT (KeyEnter		));

	jsRobot->Set (NEW_STR ("KEY_NUM0"		), NEW_INT (KeyNum0			));
	jsRobot->Set (NEW_STR ("KEY_NUM1"		), NEW_INT (KeyNum1			));
	jsRobot->Set (NEW_STR ("KEY_NUM2"		), NEW_INT (KeyNum2			));
	jsRobot->Set (NEW_STR ("KEY_NUM3"		), NEW_INT (KeyNum3			));
	jsRobot->Set (NEW_STR ("KEY_NUM4"		), NEW_INT (KeyNum4			));
	jsRobot->Set (NEW_STR ("KEY_NUM5"		), NEW_INT (KeyNum5			));
	jsRobot->Set (NEW_STR ("KEY_NUM6"		), NEW_INT (KeyNum6			));
	jsRobot->Set (NEW_STR ("KEY_NUM7"		), NEW_INT (KeyNum7			));
	jsRobot->Set (NEW_STR ("KEY_NUM8"		), NEW_INT (KeyNum8			));
	jsRobot->Set (NEW_STR ("KEY_NUM9"		), NEW_INT (KeyNum9			));

	jsRobot->Set (NEW_STR ("KEY_CAPS_LOCK"	), NEW_INT (KeyCapsLock		));
	jsRobot->Set (NEW_STR ("KEY_SCROLL_LOCK"), NEW_INT (KeyScrollLock	));
	jsRobot->Set (NEW_STR ("KEY_NUM_LOCK"	), NEW_INT (KeyNumLock		));



	//----------------------------------------------------------------------------//
	// Button                                                                     //
	//----------------------------------------------------------------------------//

	jsRobot->Set (NEW_STR ("BUTTON_LEFT"	), NEW_INT (ButtonLeft		));
	jsRobot->Set (NEW_STR ("BUTTON_MID"		), NEW_INT (ButtonMid		));
	jsRobot->Set (NEW_STR ("BUTTON_MIDDLE"	), NEW_INT (ButtonMiddle	));
	jsRobot->Set (NEW_STR ("BUTTON_RIGHT"	), NEW_INT (ButtonRight		));
	jsRobot->Set (NEW_STR ("BUTTON_X1"		), NEW_INT (ButtonX1		));
	jsRobot->Set (NEW_STR ("BUTTON_X2"		), NEW_INT (ButtonX2		));
}

////////////////////////////////////////////////////////////////////////////////

static void Sleep (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; Timer::Sleep (args[0]->Uint32Value());
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

static void Initialize (Handle<Object> exports)
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
