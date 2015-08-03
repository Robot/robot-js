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

#include "Window.h"
#include "Process.h"
SET_WRAP (Window);



//----------------------------------------------------------------------------//
// Functions                                                       WindowWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsValid (const FunctionCallbackInfo<Value>& args)
{
	FAST_BOOL (Window, args.Holder(), IsValid());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::Close (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Window, args.Holder(), Close());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsTopMost (const FunctionCallbackInfo<Value>& args)
{
	FAST_BOOL (Window, args.Holder(), IsTopMost());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsBorderless (const FunctionCallbackInfo<Value>& args)
{
	FAST_BOOL (Window, args.Holder(), IsBorderless());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsMinimized (const FunctionCallbackInfo<Value>& args)
{
	FAST_BOOL (Window, args.Holder(), IsMinimized());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsMaximized (const FunctionCallbackInfo<Value>& args)
{
	FAST_BOOL (Window, args.Holder(), IsMaximized());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetTopMost (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Window, args.Holder(), SetTopMost (args[0]->BooleanValue()));
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetBorderless (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Window, args.Holder(), SetBorderless (args[0]->BooleanValue()));
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetMinimized (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Window, args.Holder(), SetMinimized (args[0]->BooleanValue()));
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetMaximized (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Window, args.Holder(), SetMaximized (args[0]->BooleanValue()));
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetProcess (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	UNWRAP (Window, args.Holder());
	auto ctor = NEW_CTOR (Process);

	// Create a new instance of wrapper
	auto instance = ctor->NewInstance();
	UNWRAP (Process, instance);

	auto process = mWindow->GetProcess();
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

void WindowWrap::GetPID (const FunctionCallbackInfo<Value>& args)
{
	FAST_INT (Window, args.Holder(), GetPID());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetHandle (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Window, args.Holder());

	// Attempt to set new window handle
	auto status =  NEW_BOOL (mWindow->
		SetHandle ((uintptr) args[0]->
		NumberValue()));

	auto handle = NEW_NUM
		((double) mWindow->GetHandle());

	auto res = NEW_OBJ;
	res->Set (NEW_STR ("handle"), handle);
	res->Set (NEW_STR ("status"), status);
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetTitle (const FunctionCallbackInfo<Value>& args)
{
	FAST_STR (Window, args.Holder(), GetTitle().data());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetTitle (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Window, args.Holder());

	const char* title = 0;
	String::Utf8Value value (args[0]);
	// Retrieve title value
	if (args[0]->IsString())
		title = *value ? *value : "";

	mWindow->SetTitle (title);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetBounds (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Window, args.Holder());

	// Retrieve the current window bounds
	Bounds bounds = mWindow->GetBounds();

	auto res = NEW_OBJ;
	res->Set (NEW_STR ("x"), NEW_INT (bounds.X));
	res->Set (NEW_STR ("y"), NEW_INT (bounds.Y));
	res->Set (NEW_STR ("w"), NEW_INT (bounds.W));
	res->Set (NEW_STR ("h"), NEW_INT (bounds.H));
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetBounds (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Window, args.Holder(),
	SetBounds (args[0]->Int32Value(),
			   args[1]->Int32Value(),
			   args[2]->Int32Value(),
			   args[3]->Int32Value()));
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetClient (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Window, args.Holder());

	// Retrieve the current window bounds
	Bounds bounds = mWindow->GetClient();

	auto res = NEW_OBJ;
	res->Set (NEW_STR ("x"), NEW_INT (bounds.X));
	res->Set (NEW_STR ("y"), NEW_INT (bounds.Y));
	res->Set (NEW_STR ("w"), NEW_INT (bounds.W));
	res->Set (NEW_STR ("h"), NEW_INT (bounds.H));
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetClient (const FunctionCallbackInfo<Value>& args)
{
	FAST_VOID (Window, args.Holder(),
	SetClient (args[0]->Int32Value(),
			   args[1]->Int32Value(),
			   args[2]->Int32Value(),
			   args[3]->Int32Value()));
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::MapToClient (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Window, args.Holder());
	Point position (args[0]->Int32Value(),
					args[1]->Int32Value());

	// Convert the screen point to client point
	position = mWindow->MapToClient (position);

	auto res = NEW_OBJ;
	res->Set (NEW_STR ("x"), NEW_INT (position.X));
	res->Set (NEW_STR ("y"), NEW_INT (position.Y));
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::MapToScreen (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Window, args.Holder());
	Point position (args[0]->Int32Value(),
					args[1]->Int32Value());

	// Convert the client point to screen point
	position = mWindow->MapToScreen (position);

	auto res = NEW_OBJ;
	res->Set (NEW_STR ("x"), NEW_INT (position.X));
	res->Set (NEW_STR ("y"), NEW_INT (position.Y));
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetList (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	auto ctor = NEW_CTOR (Window);

	const char* regex = 0;
	String::Utf8Value value (args[0]);
	// Retrieve regex value
	if (args[0]->IsString())
		regex = *value ? *value : "";

	// Retrieve the list of all windows
	auto list = Window::GetList (regex);

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

void WindowWrap::GetActive (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	auto ctor = NEW_CTOR (Window);

	// Create a new instance of wrapper
	auto instance = ctor->NewInstance();
	UNWRAP (Window, instance);

	auto window = Window::GetActive();
	auto handle = NEW_NUM
		((double) window.GetHandle());

	// Make wrapper use new window
	mWindowWrap->mWindow = window;

	auto res = NEW_OBJ;
	res->Set (NEW_STR ("handle"), handle  );
	res->Set (NEW_STR ("window"), instance);
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetActive (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	UNWRAP (Window, args[0]->ToObject());
	Window::SetActive (mWindowWrap->mWindow);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsAxEnabled (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	RETURN_BOOL (Window::IsAxEnabled (args[0]->BooleanValue()));
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::New (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Create new class instance and wrap it
	(new WindowWrap()) ->Wrap (args.This());
	args.GetReturnValue().Set (args.This());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::Initialize (Handle<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Associate the new function with new template
	auto tpl = FunctionTemplate::New (isolate, New);
	tpl->InstanceTemplate()->SetInternalFieldCount (1);
	tpl->SetClassName (NEW_STR ("Window"));

	NODE_SET_PROTOTYPE_METHOD (tpl, "isValid",       IsValid      );
	NODE_SET_PROTOTYPE_METHOD (tpl, "close",         Close        );

	NODE_SET_PROTOTYPE_METHOD (tpl, "isTopMost",     IsTopMost    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "isBorderless",  IsBorderless );
	NODE_SET_PROTOTYPE_METHOD (tpl, "isMinimized",   IsMinimized  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "isMaximized",   IsMaximized  );

	NODE_SET_PROTOTYPE_METHOD (tpl, "setTopMost",    SetTopMost   );
	NODE_SET_PROTOTYPE_METHOD (tpl, "setBorderless", SetBorderless);
	NODE_SET_PROTOTYPE_METHOD (tpl, "setMinimized",  SetMinimized );
	NODE_SET_PROTOTYPE_METHOD (tpl, "setMaximized",  SetMaximized );

	NODE_SET_PROTOTYPE_METHOD (tpl, "getProcess",    GetProcess   );
	NODE_SET_PROTOTYPE_METHOD (tpl, "getPID",        GetPID       );
	NODE_SET_PROTOTYPE_METHOD (tpl, "setHandle",     SetHandle    );

	NODE_SET_PROTOTYPE_METHOD (tpl, "getTitle",      GetTitle     );
	NODE_SET_PROTOTYPE_METHOD (tpl, "setTitle",      SetTitle     );

	NODE_SET_PROTOTYPE_METHOD (tpl, "getBounds",     GetBounds    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "setBounds",     SetBounds    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "getClient",     GetClient    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "setClient",     SetClient    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "mapToClient",   MapToClient  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "mapToScreen",   MapToScreen  );

	NODE_SET_METHOD (tpl, "getList",     GetList    );
	NODE_SET_METHOD (tpl, "getActive",   GetActive  );
	NODE_SET_METHOD (tpl, "setActive",   SetActive  );
	NODE_SET_METHOD (tpl, "isAxEnabled", IsAxEnabled);

	// Assign function template to our class creator
	constructor.Reset (isolate, tpl->GetFunction());
	exports->Set
		   (NEW_STR ("Window"), tpl->GetFunction());
}
