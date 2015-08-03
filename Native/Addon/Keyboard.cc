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
SET_WRAP (Keyboard);



//----------------------------------------------------------------------------//
// Functions                                                     KeyboardWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Click (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Keyboard, args.Holder());

	mKeyboard->AutoDelay.Min = args[1]->Int32Value();
	mKeyboard->AutoDelay.Max = args[2]->Int32Value();
	if (args[0]->IsNumber())
		mKeyboard->Click ((Key) args[0]->Int32Value());

	else
	{
		String::Utf8Value value (args[0]);
		auto keys = *value ? *value : "";
		// Perform a series of keycode actions
		RETURN_BOOL (mKeyboard->Click (keys));
	}
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Press (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Keyboard, args.Holder());

	mKeyboard->AutoDelay.Min = args[1]->Int32Value();
	mKeyboard->AutoDelay.Max = args[2]->Int32Value();
	mKeyboard->Press ((Key) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Release (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE; UNWRAP (Keyboard, args.Holder());

	mKeyboard->AutoDelay.Min = args[1]->Int32Value();
	mKeyboard->AutoDelay.Max = args[2]->Int32Value();
	mKeyboard->Release ((Key) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Compile (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	String::Utf8Value value (args[0]);
	auto keys = *value ? *value : "";

	KeyList list;
	// Attempt to compile the key list
	if (Keyboard::Compile (keys, list))
	{
		int length = (int) list.size();
		auto res = NEW_ARR (length);
		// Loop array and add to result
		for (int i = 0; i < length; ++i)
		{
			auto obj = NEW_OBJ;
			obj->Set (NEW_STR ("down"), NEW_BOOL (list[i].first ));
			obj->Set (NEW_STR ("key" ), NEW_INT  (list[i].second));
			res->Set (i, obj);
		}

		RETURN (res);
	}

	RETURN_ARR;
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::GetState (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	if (args[0]->IsUndefined())
	{
		auto res = NEW_OBJ;
		KeyState state;
		// Retrieve all keycode states
		if (Keyboard::GetState (state))
		{
			// Loop every state and add it to resulting object
			for (auto i = state.begin(); i != state.end(); ++i)
				res->Set (NEW_INT (i->first), NEW_BOOL (i->second));
		}

		RETURN (res);
	}

	RETURN_BOOL (Keyboard::GetState
		// Get info about a single key
		((Key) args[0]->Int32Value()));
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::New (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Create new class instance and wrap it
	(new KeyboardWrap())->Wrap (args.This());
	args.GetReturnValue() .Set (args.This());
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Initialize (Handle<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Associate the new function with new template
	auto tpl = FunctionTemplate::New (isolate, New);
	tpl->InstanceTemplate()->SetInternalFieldCount (1);
	tpl->SetClassName (NEW_STR ("Keyboard"));

	NODE_SET_PROTOTYPE_METHOD (tpl, "click",   Click  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "press",   Press  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "release", Release);

	NODE_SET_METHOD (tpl, "compile",  Compile );
	NODE_SET_METHOD (tpl, "getState", GetState);

	// Assign function template to our class creator
	constructor.Reset (isolate, tpl->GetFunction());
	exports->Set
		 (NEW_STR ("Keyboard"), tpl->GetFunction());
}
