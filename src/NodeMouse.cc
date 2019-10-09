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

#include "NodeMouse.h"
DEFINE_ROBOT_TYPE (Mouse);



//----------------------------------------------------------------------------//
// Functions                                                        MouseWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Click (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Mouse, args.Holder());

	// Check for valid args
	if (!args[0]->IsInt32())
		THROW (Type, "Invalid arguments");

	mMouse->AutoDelay.Min = INT32_VALUE (args[1]);
	mMouse->AutoDelay.Max = INT32_VALUE (args[2]);
	mMouse->Click ((Button) INT32_VALUE (args[0]));
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Press (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Mouse, args.Holder());

	// Check for valid args
	if (!args[0]->IsInt32())
		THROW (Type, "Invalid arguments");

	mMouse->AutoDelay.Min = INT32_VALUE (args[1]);
	mMouse->AutoDelay.Max = INT32_VALUE (args[2]);
	mMouse->Press ((Button) INT32_VALUE (args[0]));
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Release (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Mouse, args.Holder());

	// Check for valid args
	if (!args[0]->IsInt32())
		THROW (Type, "Invalid arguments");

	mMouse->AutoDelay.Min = INT32_VALUE (args[1]);
	mMouse->AutoDelay.Max = INT32_VALUE (args[2]);
	mMouse->Release ((Button) INT32_VALUE (args[0]));
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::ScrollH (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Mouse, args.Holder());

	// Check for valid args
	if (!args[0]->IsInt32())
		THROW (Type, "Invalid arguments");

	mMouse->AutoDelay.Min = INT32_VALUE (args[1]);
	mMouse->AutoDelay.Max = INT32_VALUE (args[2]);
	mMouse->ScrollH (INT32_VALUE (args[0]));
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::ScrollV (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Mouse, args.Holder());

	// Check for valid args
	if (!args[0]->IsInt32())
		THROW (Type, "Invalid arguments");

	mMouse->AutoDelay.Min = INT32_VALUE (args[1]);
	mMouse->AutoDelay.Max = INT32_VALUE (args[2]);
	mMouse->ScrollV (INT32_VALUE (args[0]));
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::GetPos (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Get the mouse position
	Point p = Mouse::GetPos();
	RETURN_POINT (p.X, p.Y);
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::SetPos (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; Mouse::SetPos
		(INT32_VALUE (args[0]),
		 INT32_VALUE (args[1]));
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::GetState (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// No arguments were given
	if (args[0]->IsUndefined())
	{
		auto res = NEW_OBJ;
		ButtonState state;
		// Retrieve all button states
		if (Mouse::GetState (state))
		{
			// Loop every state and add it to resulting object
			for (auto i = state.begin(); i != state.end(); ++i)
				OBJECT_SET (res, NEW_INT (i->first), NEW_BOOL (i->second));
		}

		RETURN (res);
	}

	// A button was given
	if (args[0]->IsInt32())
	{
		RETURN_BOOL (Mouse::GetState
			// Get info about a single button
			((Button) INT32_VALUE (args[0])));
	}

	THROW (Type, "Invalid arguments");
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::New (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Whether called using new
	if (args.IsConstructCall())
	{
		(new MouseWrap())->Wrap (args.This());
		OBJECT_SET (args.This(), NEW_STR ("autoDelay"),
						  NEW_RANGE ( 40,  90));

		REGISTER_ROBOT_TYPE;
		RETURN (args.This());
	}

	else
	{
		auto ctor = NEW_CTOR (Mouse);
		// Return as a new instance
		RETURN (NEW_INSTANCE (ctor, 0, NULL));
	}
}

////////////////////////////////////////////////////////////////////////////////

void MouseWrap::Initialize (Local<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Associate the new function with new template
	auto tpl = FunctionTemplate::New (isolate, New);
	tpl->InstanceTemplate()->SetInternalFieldCount (1);
	tpl->SetClassName (NEW_STR ("Mouse"));

	NODE_SET_PROTOTYPE_METHOD (tpl, "_click",   Click  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_press",   Press  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_release", Release);
	NODE_SET_PROTOTYPE_METHOD (tpl, "_scrollH", ScrollH);
	NODE_SET_PROTOTYPE_METHOD (tpl, "_scrollV", ScrollV);

	NODE_SET_METHOD ((Local<Template>) tpl,  "getPos",   GetPos  );
	NODE_SET_METHOD ((Local<Template>) tpl, "_setPos",   SetPos  );
	NODE_SET_METHOD ((Local<Template>) tpl,  "getState", GetState);

	// Assign function template to our class creator
	constructor.Reset (isolate, GET_FUNCTION (tpl));
	OBJECT_SET (exports, NEW_STR ("Mouse"), GET_FUNCTION (tpl));
}
