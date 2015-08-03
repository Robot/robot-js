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
SET_WRAP (Mouse);



//----------------------------------------------------------------------------//
// Functions                                                        MouseWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Click (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Mouse, args.Holder());

	mMouse->AutoDelay.Min = args[1]->Int32Value();
	mMouse->AutoDelay.Max = args[2]->Int32Value();
	mMouse->Click ((Button) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Press (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Mouse, args.Holder());

	mMouse->AutoDelay.Min = args[1]->Int32Value();
	mMouse->AutoDelay.Max = args[2]->Int32Value();
	mMouse->Press ((Button) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Release (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Mouse, args.Holder());

	mMouse->AutoDelay.Min   = args[1]->Int32Value();
	mMouse->AutoDelay.Max   = args[2]->Int32Value();
	mMouse->Release ((Button) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::ScrollH (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Mouse, args.Holder());

	mMouse->AutoDelay.Min = args[1]->Int32Value();
	mMouse->AutoDelay.Max = args[2]->Int32Value();
	mMouse->ScrollH (args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::ScrollV (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Mouse, args.Holder());

	mMouse->AutoDelay.Min = args[1]->Int32Value();
	mMouse->AutoDelay.Max = args[2]->Int32Value();
	mMouse->ScrollV (args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::GetPos (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Get the mouse position
	Point p = Mouse::GetPos();

	auto res = NEW_OBJ;
	res->Set (NEW_STR ("x"), NEW_INT (p.X));
	res->Set (NEW_STR ("y"), NEW_INT (p.Y));
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::SetPos (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	Mouse::SetPos (args[0]->Int32Value(),
				   args[1]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::GetState (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	if (args[0]->IsUndefined())
	{
		auto res = NEW_OBJ;
		ButtonState state;
		// Retrieve all button states
		if (Mouse::GetState (state))
		{
			// Loop every state and add it to resulting object
			for (auto i = state.begin(); i != state.end(); ++i)
				res->Set (NEW_INT (i->first), NEW_BOOL (i->second));
		}

		RETURN (res);
	}

	RETURN_BOOL (Mouse::GetState
		// Get info about a single button
		((Button) args[0]->Int32Value()));
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::New (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Create new class instance and wrap it
	(new MouseWrap())  ->Wrap (args.This());
	args.GetReturnValue().Set (args.This());
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Initialize (Handle<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Associate the new function with new template
	auto tpl = FunctionTemplate::New (isolate, New);
	tpl->InstanceTemplate()->SetInternalFieldCount (1);
	tpl->SetClassName (NEW_STR ("Mouse"));

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
			(NEW_STR ("Mouse"), tpl->GetFunction());
}
