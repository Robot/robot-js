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
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Perform a simple sleep function
	Timer::Sleep (args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

static void TimerGetCpu (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Retrieve and return the CPU time
	uint64 time = Timer::GetCpuTime();
	args.GetReturnValue().Set (Number::
		New (isolate, (double) time));
}



//----------------------------------------------------------------------------//
// Main                                                                       //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

static void Initialize (Handle<Object> exports)
{
	KeyboardWrap::Initialize (exports);
	   MouseWrap::Initialize (exports);

	NODE_SET_METHOD (exports, "timerSleep" , TimerSleep );
	NODE_SET_METHOD (exports, "timerGetCpu", TimerGetCpu);
}

////////////////////////////////////////////////////////////////////////////////

NODE_MODULE (robot, Initialize);
