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

#include "NodeWindow.h"
#include "NodeProcess.h"
DEFINE_ROBOT_TYPE (Window);



//----------------------------------------------------------------------------//
// Functions                                                       WindowWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsValid (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	RETURN_BOOL (mWindow->IsValid());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::Close (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	mWindow->Close();
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsTopMost (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	RETURN_BOOL (mWindow->IsTopMost());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsBorderless (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	RETURN_BOOL (mWindow->IsBorderless());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsMinimized (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	RETURN_BOOL (mWindow->IsMinimized());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsMaximized (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	RETURN_BOOL (mWindow->IsMaximized());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetTopMost (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	if (!args[0]->IsBoolean())
		THROW (Type, "Invalid arguments");

	mWindow->SetTopMost
		  (args[0]->BooleanValue());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetBorderless (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	if (!args[0]->IsBoolean())
		THROW (Type, "Invalid arguments");

	mWindow->SetBorderless
		  (args[0]->BooleanValue());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetMinimized (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	if (!args[0]->IsBoolean())
		THROW (Type, "Invalid arguments");

	mWindow->SetMinimized
		  (args[0]->BooleanValue());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetMaximized (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	if (!args[0]->IsBoolean())
		THROW (Type, "Invalid arguments");

	mWindow->SetMaximized
		  (args[0]->BooleanValue());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetProcess (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	auto ctor = NEW_CTOR (Process);

	// Create a new instance of wrapper
	auto instance = ctor->NewInstance();
	UNWRAP (Process, instance);

	auto process = mWindow->GetProcess();
	// Make wrapper use a new process
	mProcessWrap->mProcess = process;
	RETURN (instance);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetPID (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	RETURN_INT (mWindow->GetPID());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetHandle (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	RETURN_INT ((uint32) mWindow->GetHandle());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetHandle (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	// Check for valid args
	if (!args[0]->IsNumber())
		THROW (Type, "Invalid arguments");

	// Attempt to set new win handle
	RETURN_BOOL (mWindow->SetHandle
		((uintptr) args[0]->NumberValue()));
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetTitle (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	RETURN_STR (mWindow->GetTitle().data());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetTitle (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	// Check for valid args
	if (!args[0]->IsString())
		THROW (Type, "Invalid arguments");

	String::Utf8Value value (args[0]);
	auto title = *value ? *value : "";
	mWindow->SetTitle (title);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetBounds (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	// Retrieve the current window bounds
	Bounds bounds = mWindow->GetBounds();
	RETURN_BOUNDS (bounds.X, bounds.Y,
				   bounds.W, bounds.H);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetBounds (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	mWindow->SetBounds
		(args[0]->Int32Value(),
		 args[1]->Int32Value(),
		 args[2]->Int32Value(),
		 args[3]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetClient (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	// Retrieve the current window bounds
	Bounds bounds = mWindow->GetClient();
	RETURN_BOUNDS (bounds.X, bounds.Y,
				   bounds.W, bounds.H);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetClient (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());

	mWindow->SetClient
		(args[0]->Int32Value(),
		 args[1]->Int32Value(),
		 args[2]->Int32Value(),
		 args[3]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::MapToClient (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	Point position (args[0]->Int32Value(),
					args[1]->Int32Value());

	// Convert the screen point to client point
	position = mWindow->MapToClient (position);
	RETURN_POINT (position.X, position.Y);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::MapToScreen (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	Point position (args[0]->Int32Value(),
					args[1]->Int32Value());

	// Convert the client point to screen point
	position = mWindow->MapToScreen (position);
	RETURN_POINT (position.X, position.Y);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::Equals (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args.Holder());
	WindowWrap* wrapper = nullptr;
	if ((wrapper = UnwrapRobot<WindowWrap> (args[0])))
		RETURN_BOOL (*mWindow == wrapper->mWindow);
		RETURN_BOOL (*mWindow == args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::GetList (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
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
		res->Set (i, instance);
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
	// Make wrapper use new window
	mWindowWrap->mWindow = window;
	RETURN (instance);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::SetActive (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Window, args[0]->ToObject());
	Window::SetActive (mWindowWrap->mWindow);
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::IsAxEnabled (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Check for valid arguments
	if (!args[0]->IsBoolean() &&
		!args[0]->IsUndefined())
		THROW (Type, "Invalid arguments");

	bool options = args[0]->IsBoolean() ?
		 args[0]->BooleanValue() : false;
	RETURN_BOOL (Window::IsAxEnabled (options));
}

////////////////////////////////////////////////////////////////////////////////

void WindowWrap::New (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Whether called using new
	if (args.IsConstructCall())
	{
		// Check if args are valid
		if (!args[0]->IsNumber() &&
			!args[0]->IsUndefined())
			THROW (Type, "Invalid arguments");

		auto wrapper = new WindowWrap( );
		auto window  = &wrapper->mWindow;
		wrapper->Wrap (args.This());

		if (args[0]->IsNumber())
		{
			window->SetHandle
				// Set the handle if arg available
				((uintptr) args[0]->NumberValue());
		}

		REGISTER_ROBOT_TYPE;
		RETURN (args.This());
	}

	else
	{
		auto ctor = NEW_CTOR (Window);
		// Return as a new instance
		RETURN (ctor->NewInstance (1,
			   (_jsArgs[0] = args[0], _jsArgs)));
	}
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

	NODE_SET_PROTOTYPE_METHOD (tpl,  "isValid",       IsValid      );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "close",         Close        );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "isTopMost",     IsTopMost    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "isBorderless",  IsBorderless );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "isMinimized",   IsMinimized  );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "isMaximized",   IsMaximized  );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "setTopMost",    SetTopMost   );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "setBorderless", SetBorderless);
	NODE_SET_PROTOTYPE_METHOD (tpl,  "setMinimized",  SetMinimized );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "setMaximized",  SetMaximized );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "getProcess",    GetProcess   );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getPID",        GetPID       );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getHandle",     GetHandle    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "setHandle",     SetHandle    );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "getTitle",      GetTitle     );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "setTitle",      SetTitle     );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "getBounds",     GetBounds    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_setBounds",     SetBounds    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getClient",     GetClient    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_setClient",     SetClient    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_mapToClient",   MapToClient  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_mapToScreen",   MapToScreen  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_equals",        Equals       );

	NODE_SET_METHOD ((Local<Template>) tpl,  "getList",     GetList    );
	NODE_SET_METHOD ((Local<Template>) tpl,  "getActive",   GetActive  );
	NODE_SET_METHOD ((Local<Template>) tpl, "_setActive",   SetActive  );
	NODE_SET_METHOD ((Local<Template>) tpl,  "isAxEnabled", IsAxEnabled);

	// Assign function template to our class creator
	constructor.Reset (isolate, tpl->GetFunction());
	exports->Set
		   (NEW_STR ("Window"), tpl->GetFunction());
}
