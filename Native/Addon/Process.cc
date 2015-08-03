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
SET_WRAP (Process);



//----------------------------------------------------------------------------//
// Functions                                                      ProcessWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Open (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Process, args.Holder());

	// Try and open the process
	bool status = mProcess->Open
		(args[0]->Int32Value());

	auto res = NEW_OBJ;
	res->Set (NEW_STR ("procID" ), NEW_INT  (mProcess->GetPID ()));
	res->Set (NEW_STR ("is64Bit"), NEW_BOOL (mProcess->Is64Bit()));
	res->Set (NEW_STR ("name"   ), NEW_STR  (mProcess->GetName().data()));
	res->Set (NEW_STR ("path"   ), NEW_STR  (mProcess->GetPath().data()));
	res->Set (NEW_STR ("status" ), NEW_BOOL (status));
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Close (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Process, args.Holder(), Close());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::IsValid (const FunctionCallbackInfo<Value>& args)
{
	FAST_BOOL (Process, args.Holder(), IsValid());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::IsDebugged (const FunctionCallbackInfo<Value>& args)
{
	FAST_BOOL (Process, args.Holder(), IsDebugged());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Exit (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Process, args.Holder(), Exit());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Kill (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Process, args.Holder(), Kill());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::HasExited (const FunctionCallbackInfo<Value>& args)
{
	FAST_BOOL (Process, args.Holder(), HasExited());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetModules (const FunctionCallbackInfo<Value>& args)
{
	// NYI: Not Yet Implemented
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetWindows (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	UNWRAP (Process, args.Holder());
	auto ctor = NEW_CTOR (Window);

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

		auto obj = NEW_OBJ;
		auto handle = NEW_NUM ((double) list[i].GetHandle());
		obj->Set (NEW_STR ("handle"), handle  );
		obj->Set (NEW_STR ("window"), instance);
		res->Set (i, obj);
	}

	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetList (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	auto ctor = NEW_CTOR (Process);

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

		auto obj = NEW_OBJ;
		obj->Set (NEW_STR ("procID" ), NEW_INT  (list[i].GetPID ()));
		obj->Set (NEW_STR ("is64Bit"), NEW_BOOL (list[i].Is64Bit()));
		obj->Set (NEW_STR ("name"   ), NEW_STR  (list[i].GetName().data()));
		obj->Set (NEW_STR ("path"   ), NEW_STR  (list[i].GetPath().data()));
		obj->Set (NEW_STR ("process"), instance);
		res->Set (i, obj);
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

	auto res = NEW_OBJ;
	res->Set (NEW_STR ("procID" ), NEW_INT  (process.GetPID ()));
	res->Set (NEW_STR ("is64Bit"), NEW_BOOL (process.Is64Bit()));
	res->Set (NEW_STR ("name"   ), NEW_STR  (process.GetName().data()));
	res->Set (NEW_STR ("path"   ), NEW_STR  (process.GetPath().data()));
	res->Set (NEW_STR ("process"), instance);
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::IsSys64Bit (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	RETURN_BOOL (Process::IsSys64Bit());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::New (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Create new class instance and wrap it
	(new ProcessWrap())->Wrap (args.This());
	args.GetReturnValue().Set (args.This());
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

	NODE_SET_METHOD (tpl, "getList",    GetList   );
	NODE_SET_METHOD (tpl, "getCurrent", GetCurrent);
	NODE_SET_METHOD (tpl, "isSys64Bit", IsSys64Bit);

	// Assign function template to our class creator
	constructor.Reset (isolate, tpl->GetFunction());
	exports->Set
		  (NEW_STR ("Process"), tpl->GetFunction());
}
