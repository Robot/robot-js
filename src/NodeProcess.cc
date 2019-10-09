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

#include "NodeProcess.h"
#include "NodeWindow.h"
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
	RETURN_BOOL (mProcess->Open
		(INT32_VALUE (args[0])));
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Close (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	mProcess->Close();
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::IsValid (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	RETURN_BOOL (mProcess->IsValid());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Is64Bit (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	RETURN_BOOL (mProcess->Is64Bit());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::IsDebugged (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	RETURN_BOOL (mProcess->IsDebugged());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetPID (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	RETURN_INT (mProcess->GetPID());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetName (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	RETURN_STR (mProcess->GetName().data());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetPath (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	RETURN_STR (mProcess->GetPath().data());
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
	ISOWRAP (Process, args.Holder());
	auto ctor = Local<Function>::
		 New (isolate, JsModule);

	// Check for valid arguments
	if (!args[0]->IsString() &&
		!args[0]->IsUndefined())
		THROW (Type, "Invalid arguments");

	const char* regex = 0;
	UTF8_VAR (value, args[0]);
	// Retrieve regex value
	if (args[0]->IsString())
		regex = *value ? *value : "";

	// Retrieve a list of all process modules
	auto list = mProcess->GetModules (regex);

	int length = (int) list.size();
	auto res = NEW_ARR (length);
	// Loop array and add to result
	for (int i = 0; i < length; ++i)
	{
		// Avoid always getting value
		const auto& current = list[i];

		// Create a new module instance
		auto obj = NEW_INSTANCE (ctor, 0, NULL);

		OBJECT_SET (obj, NEW_STR ("_valid"), NEW_BOOL (current.IsValid()));
		OBJECT_SET (obj, NEW_STR ("_name" ), NEW_STR  (current.GetName().data()));
		OBJECT_SET (obj, NEW_STR ("_path" ), NEW_STR  (current.GetPath().data()));
		OBJECT_SET (obj, NEW_STR ("_base" ), NEW_NUM  ((double) current.GetBase()));
		OBJECT_SET (obj, NEW_STR ("_size" ), NEW_NUM  ((double) current.GetSize()));
		OBJECT_SET (obj, NEW_STR ("_proc" ), args.Holder());
		OBJECT_SET (res, i, obj);
	}

	RETURN (res);
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
	UTF8_VAR (value, args[0]);
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
		auto instance = NEW_INSTANCE (ctor, 0, NULL);
		UNWRAP (Window, instance);

		// Make wrapper use new window
		mWindowWrap->mWindow = list[i];
		OBJECT_SET (res, i, instance);
	}

	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Equals (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, args.Holder());
	ProcessWrap* wrapper = nullptr;
	if ((wrapper = UnwrapRobot<ProcessWrap> (args[0])))
		RETURN_BOOL (*mProcess == wrapper->mProcess);
		RETURN_BOOL (*mProcess == INT32_VALUE (args[0]));
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
	UTF8_VAR (value, args[0]);
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
		auto instance = NEW_INSTANCE (ctor, 0, NULL);
		UNWRAP (Process, instance);

		// Make wrapper use new process
		mProcessWrap->mProcess = list[i];
		OBJECT_SET (res, i, instance);
	}

	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetCurrent (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	auto ctor = NEW_CTOR (Process);

	// Create a new instance of wrapper
	auto instance = NEW_INSTANCE (ctor, 0, NULL);
	UNWRAP (Process, instance);

	auto process = Process::GetCurrent();
	// Make wrapper use a new process
	mProcessWrap->mProcess = process;
	RETURN (instance);
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::IsSys64Bit (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; RETURN_BOOL (Process::IsSys64Bit());
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::GetSegments (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Process, TO_OBJECT (args[0]));
	auto ctor = Local<Function>::
		 New (isolate, JsSegment);

	// Create new module
	Robot::Module module
		(*mProcess, "", "", (uintptr)
		 NUMBER_VALUE (args[1]), 0);

	// Retrieve the list of segments
	auto list = module.GetSegments();

	int length = (int) list.size();
	auto res = NEW_ARR (length);
	// Loop array and add to result
	for (int i = 0; i < length; ++i)
	{
		// Avoid always getting value
		const auto& current = list[i];

		// Create a new module instance
		auto obj = NEW_INSTANCE (ctor, 0, NULL);

		OBJECT_SET (obj, NEW_STR ("valid"), NEW_BOOL (         current.Valid));
		OBJECT_SET (obj, NEW_STR ("base" ), NEW_NUM  ((double) current.Base ));
		OBJECT_SET (obj, NEW_STR ("size" ), NEW_NUM  ((double) current.Size ));
		OBJECT_SET (obj, NEW_STR ("name" ), NEW_STR  (         current.Name ));
		OBJECT_SET (res, i, obj);
	}

	RETURN (res);
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
			process->Open (INT32_VALUE (args[0]));

		REGISTER_ROBOT_TYPE;
		RETURN (args.This());
	}

	else
	{
		auto ctor = NEW_CTOR (Process);
		// Return as a new instance
		RETURN (NEW_INSTANCE (ctor, 1,
			   (_jsArgs[0] = args[0], _jsArgs)));
	}
}

////////////////////////////////////////////////////////////////////////////////

void ProcessWrap::Initialize (Local<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Associate the new function with new template
	auto tpl = FunctionTemplate::New (isolate, New);
	tpl->InstanceTemplate()->SetInternalFieldCount (1);
	tpl->SetClassName (NEW_STR ("Process"));

	NODE_SET_PROTOTYPE_METHOD (tpl,  "open",       Open      );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "close",      Close     );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "isValid",    IsValid   );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "is64Bit",    Is64Bit   );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "isDebugged", IsDebugged);

	NODE_SET_PROTOTYPE_METHOD (tpl,  "getPID",     GetPID    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getName",    GetName   );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getPath",    GetPath   );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "exit",       Exit      );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "kill",       Kill      );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "hasExited",  HasExited );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "getModules", GetModules);
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getWindows", GetWindows);
	NODE_SET_PROTOTYPE_METHOD (tpl, "_equals",     Equals    );

	NODE_SET_METHOD ((Local<Template>) tpl,  "getList",     GetList    );
	NODE_SET_METHOD ((Local<Template>) tpl,  "getCurrent",  GetCurrent );
	NODE_SET_METHOD ((Local<Template>) tpl, "_isSys64Bit",  IsSys64Bit );
	NODE_SET_METHOD ((Local<Template>) tpl, "_getSegments", GetSegments);

	// Assign function template to our class creator
	constructor.Reset (isolate, GET_FUNCTION (tpl));
	OBJECT_SET (exports, NEW_STR ("Process"), GET_FUNCTION (tpl));
}
