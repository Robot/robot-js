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

#include <node.h>
using namespace v8;

#include <Robot.h>
using namespace Robot;



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
	NODE_SET_METHOD (exports, "timerSleep" , TimerSleep );
	NODE_SET_METHOD (exports, "timerGetCpu", TimerGetCpu);
}

////////////////////////////////////////////////////////////////////////////////

NODE_MODULE (robot, Initialize);
