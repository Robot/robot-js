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

#include "Mouse.h"



//----------------------------------------------------------------------------//
// Fields                                                           MouseWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

Persistent<Function> MouseWrap::constructor;



//----------------------------------------------------------------------------//
// Constructors                                                     MouseWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

MouseWrap:: MouseWrap (void) { }
MouseWrap::~MouseWrap (void) { }



//----------------------------------------------------------------------------//
// Functions                                                        MouseWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Click (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Get the associated mouse wrapper
	MouseWrap* mouseWrap = ObjectWrap::
		Unwrap<MouseWrap> (args.Holder());

	// Update the auto delay range and perform native action
	mouseWrap->mMouse.AutoDelay.Min = args[1]->Int32Value();
	mouseWrap->mMouse.AutoDelay.Max = args[2]->Int32Value();
	mouseWrap->mMouse.Click ((Button) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Press (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Get the associated mouse wrapper
	MouseWrap* mouseWrap = ObjectWrap::
		Unwrap<MouseWrap> (args.Holder());

	// Update the auto delay range and perform native action
	mouseWrap->mMouse.AutoDelay.Min = args[1]->Int32Value();
	mouseWrap->mMouse.AutoDelay.Max = args[2]->Int32Value();
	mouseWrap->mMouse.Press ((Button) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Release (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Get the associated mouse wrapper
	MouseWrap* mouseWrap = ObjectWrap::
		Unwrap<MouseWrap> (args.Holder());

	// Update the auto delay range and perform native action
	mouseWrap->mMouse.AutoDelay.Min = args[1]->Int32Value();
	mouseWrap->mMouse.AutoDelay.Max = args[2]->Int32Value();
	mouseWrap->mMouse.Release ((Button) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::ScrollH (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Get the associated mouse wrapper
	MouseWrap* mouseWrap = ObjectWrap::
		Unwrap<MouseWrap> (args.Holder());

	// Update the auto delay range and perform native action
	mouseWrap->mMouse.AutoDelay.Min = args[1]->Int32Value();
	mouseWrap->mMouse.AutoDelay.Max = args[2]->Int32Value();
	mouseWrap->mMouse.ScrollH (args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::ScrollV (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Get the associated mouse wrapper
	MouseWrap* mouseWrap = ObjectWrap::
		Unwrap<MouseWrap> (args.Holder());

	// Update the auto delay range and perform native action
	mouseWrap->mMouse.AutoDelay.Min = args[1]->Int32Value();
	mouseWrap->mMouse.AutoDelay.Max = args[2]->Int32Value();
	mouseWrap->mMouse.ScrollV (args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::GetPos (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Retrieve and set mouse position
	Point position = Mouse::GetPos();
	auto res = Object::New (isolate);
	res->Set ( String::NewFromUtf8 (isolate, "x"),
			   Number::New (isolate, position.X));
	res->Set ( String::NewFromUtf8 (isolate, "y"),
			   Number::New (isolate, position.Y));

	args.GetReturnValue().Set (res);
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::SetPos (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Simply set the new mouse position
	Mouse::SetPos (args[0]->Int32Value(),
				   args[1]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::GetState (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Check for undefined arg
	if (args[0]->IsUndefined())
	{
		auto res = Object::New (isolate);

		ButtonState state;
		// Retrieve all button states
		if (Mouse::GetState (state))
		{
			// Loop every state and add it to resulting object
			for (auto i = state.begin(); i != state.end(); ++i)
			{
				res->Set ( Number::New (isolate, i->first ),
						  Boolean::New (isolate, i->second));
			}
		}

		args.GetReturnValue().Set (res);
	}

	else
	{
		bool res = Mouse::GetState
			// Get info about a single button
			((Button) args[0]->Int32Value());

		args.GetReturnValue().Set
			// Return the resulting value
			(Boolean::New (isolate, res));
	}
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::New (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Create new class instance and wrap it
	(new MouseWrap())  ->Wrap (args.This());
	args.GetReturnValue().Set (args.This());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Initialize (Handle<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Instantiate new function template for our class creator
	auto tpl = FunctionTemplate::New (isolate, MouseWrap::New);
	tpl->SetClassName (String::NewFromUtf8 (isolate, "Mouse"));
	tpl->InstanceTemplate()->SetInternalFieldCount (1);

	NODE_SET_PROTOTYPE_METHOD (tpl, "click",   Click  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "press",   Press  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "release", Release);
	NODE_SET_PROTOTYPE_METHOD (tpl, "scrollH", ScrollH);
	NODE_SET_PROTOTYPE_METHOD (tpl, "scrollV", ScrollV);

	NODE_SET_METHOD (tpl, "getPos",   GetPos  );
	NODE_SET_METHOD (tpl, "setPos",   SetPos  );
	NODE_SET_METHOD (tpl, "getState", GetState);

	// Assign function template to our class creator
	constructor.Reset (isolate, tpl->GetFunction());
	exports->Set
		(String::NewFromUtf8 (isolate,
		"Mouse"), tpl->GetFunction());
}
