////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                       (C) 2010-2015 Robot Developers                       //
//                       See LICENSE for licensing info                       //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------//
// Prefaces                                                                   //
//----------------------------------------------------------------------------//

#include "Keyboard.h"
#include "Mouse.h"

#include "Process.h"
#include "Module.h"
#include "Memory.h"

#include "Window.h"
#include "Screen.h"
#include "Clipboard.h"



//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

static void TimerSleep (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Perform a simple sleep function
	Timer::Sleep (args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

static void TimerGetCpu (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Retrieve and return current CPU time
	RETURN_NUM ((double) Timer::GetCpuTime());
}



//----------------------------------------------------------------------------//
// Main                                                                       //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

static void Initialize (Handle<Object> exports)
{
	 KeyboardWrap::Initialize (exports);
	    MouseWrap::Initialize (exports);

	  ProcessWrap::Initialize (exports);
//	   ModuleWrap::Initialize (exports);
//	   MemoryWrap::Initialize (exports);

	   WindowWrap::Initialize (exports);
//	   ScreenWrap::Initialize (exports);
//	ClipboardWrap::Initialize (exports);

	NODE_SET_METHOD (exports, "timerSleep" , TimerSleep );
	NODE_SET_METHOD (exports, "timerGetCpu", TimerGetCpu);
}

////////////////////////////////////////////////////////////////////////////////

NODE_MODULE (robot, Initialize);
