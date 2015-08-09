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

#include "Process.h"
#include "Window.h"
DEFINE_ROBOT_TYPE (Process);



//----------------------------------------------------------------------------//
// Functions                                                      ProcessWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Open (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());

	// Check for valid args
	if (!args[0]->IsInt32())
		THROW (Type, "Invalid arguments");

	// Try and open the process
	bool status = mProcess->Open
		(args[0]->Int32Value());

	args.This()->Set (NEW_STR ("_procID" ), NEW_INT  (mProcess->GetPID ()));
	args.This()->Set (NEW_STR ("_is64Bit"), NEW_BOOL (mProcess->Is64Bit()));
	args.This()->Set (NEW_STR ("_name"   ), NEW_STR  (mProcess->GetName().data()));
	args.This()->Set (NEW_STR ("_path"   ), NEW_STR  (mProcess->GetPath().data()));
	RETURN_BOOL (status);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Close (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder()); mProcess->Close();

	args.This()->Set (NEW_STR ("_procID" ), NEW_INT  (0 ));
	args.This()->Set (NEW_STR ("_is64Bit"), NEW_BOOL (0 ));
	args.This()->Set (NEW_STR ("_name"   ), NEW_STR  (""));
	args.This()->Set (NEW_STR ("_path"   ), NEW_STR  (""));
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::IsValid (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	RETURN_BOOL (mProcess->IsValid());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::IsDebugged (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	RETURN_BOOL (mProcess->IsDebugged());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Exit (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	mProcess->Exit();
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Kill (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	mProcess->Kill();
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::HasExited (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	RETURN_BOOL (mProcess->HasExited());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetModules (const FunctionCallbackInfo<Value>& args)
{
	// NYI: Not Yet Implemented
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetWindows (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	auto ctor = NEW_CTOR (Window);

	// Check for valid arguments
	if (!args[0]->IsString() &&
		!args[0]->IsUndefined())
		THROW (Type, "Invalid arguments");

	const char* regex = 0;
	String::Utf8Value value (args[0]);
	// Retrieve regex value
	if (args[0]->IsString())
		regex = *value ? *value : "";

	// Retrieve a list of all process windows
	auto list = mProcess->GetWindows (regex);

	int length = (int) list.size();
	auto res = NEW_ARR (length);
	// Loop array and add to result
	for (int i = 0; i < length; ++i)
	{
		// Create a new instance of wrapper
		auto instance = ctor->NewInstance();
		UNWRAP (Window, instance);

		// Make wrapper use new window
		mWindowWrap->mWindow = list[i];

		instance->Set (NEW_STR ("_handle"),
					   NEW_INT (( uint32 )
					   list[i].GetHandle()));

		res->Set (i, instance);
	}

	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetList (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	auto ctor = NEW_CTOR (Process);

	// Check for valid arguments
	if (!args[0]->IsString() &&
		!args[0]->IsUndefined())
		THROW (Type, "Invalid arguments");

	const char* regex = 0;
	String::Utf8Value value (args[0]);
	// Retrieve regex value
	if (args[0]->IsString())
		regex = *value ? *value : "";

	// Retrieve a list of all processes
	auto list = Process::GetList (regex);

	int length = (int) list.size();
	auto res = NEW_ARR (length);
	// Loop array and add to result
	for (int i = 0; i < length; ++i)
	{
		// Create a new instance of wrapper
		auto instance = ctor->NewInstance();
		UNWRAP (Process, instance);

		// Make wrapper use new process
		mProcessWrap->mProcess = list[i];

		instance->Set (NEW_STR ("_procID" ), NEW_INT  (list[i].GetPID ()));
		instance->Set (NEW_STR ("_is64Bit"), NEW_BOOL (list[i].Is64Bit()));
		instance->Set (NEW_STR ("_name"   ), NEW_STR  (list[i].GetName().data()));
		instance->Set (NEW_STR ("_path"   ), NEW_STR  (list[i].GetPath().data()));
		res->Set (i, instance);
	}

	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetCurrent (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	auto ctor = NEW_CTOR (Process);

	// Create a new instance of wrapper
	auto instance = ctor->NewInstance();
	UNWRAP (Process, instance);

	auto process = Process::GetCurrent();
	// Make wrapper use new process
	mProcessWrap->mProcess = process;

	instance->Set (NEW_STR ("_procID" ), NEW_INT  (process.GetPID ()));
	instance->Set (NEW_STR ("_is64Bit"), NEW_BOOL (process.Is64Bit()));
	instance->Set (NEW_STR ("_name"   ), NEW_STR  (process.GetName().data()));
	instance->Set (NEW_STR ("_path"   ), NEW_STR  (process.GetPath().data()));
	RETURN (instance);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::IsSys64Bit (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; RETURN_BOOL (Process::IsSys64Bit());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::New (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Whether called using new
	if (args.IsConstructCall())
	{
		// Check if args are valid
		if (!args[0]->IsInt32() &&
			!args[0]->IsUndefined())
			THROW (Type, "Invalid arguments");

		auto wrapper = new ProcessWrap( );
		auto process = &wrapper->mProcess;
		wrapper->Wrap (args.This());

		if (args[0]->IsInt32())
			// Open process if argument available
			process->Open (args[0]->Int32Value());

		args.This()->Set (NEW_STR ("_procID" ), NEW_INT  (process->GetPID ()));
		args.This()->Set (NEW_STR ("_is64Bit"), NEW_BOOL (process->Is64Bit()));
		args.This()->Set (NEW_STR ("_name"   ), NEW_STR  (process->GetName().data()));
		args.This()->Set (NEW_STR ("_path"   ), NEW_STR  (process->GetPath().data()));

		REGISTER_ROBOT_TYPE;
		RETURN (args.This());
	}

	else
	{
		auto ctor = NEW_CTOR (Process);
		// Return as a new instance, include args
		RETURN (ctor->NewInstance (1, &args[0]));
	}
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Initialize (Handle<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Associate the new function with new template
	auto tpl = FunctionTemplate::New (isolate, New);
	tpl->InstanceTemplate()->SetInternalFieldCount (1);
	tpl->SetClassName (NEW_STR ("Process"));

	NODE_SET_PROTOTYPE_METHOD (tpl, "open",       Open      );
	NODE_SET_PROTOTYPE_METHOD (tpl, "close",      Close     );

	NODE_SET_PROTOTYPE_METHOD (tpl, "isValid",    IsValid   );
	NODE_SET_PROTOTYPE_METHOD (tpl, "isDebugged", IsDebugged);

	NODE_SET_PROTOTYPE_METHOD (tpl, "exit",       Exit      );
	NODE_SET_PROTOTYPE_METHOD (tpl, "kill",       Kill      );
	NODE_SET_PROTOTYPE_METHOD (tpl, "hasExited",  HasExited );

	NODE_SET_PROTOTYPE_METHOD (tpl, "getModules", GetModules);
	NODE_SET_PROTOTYPE_METHOD (tpl, "getWindows", GetWindows);

	NODE_SET_METHOD (tpl,  "getList",    GetList   );
	NODE_SET_METHOD (tpl,  "getCurrent", GetCurrent);
	NODE_SET_METHOD (tpl, "_isSys64Bit", IsSys64Bit);

	// Assign function template to our class creator
	constructor.Reset (isolate, tpl->GetFunction());
	exports->Set
		  (NEW_STR ("Process"), tpl->GetFunction());
}
