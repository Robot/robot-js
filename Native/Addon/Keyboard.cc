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



//----------------------------------------------------------------------------//
// Fields                                                        KeyboardWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

Persistent<Function> KeyboardWrap::constructor;



//----------------------------------------------------------------------------//
// Constructors                                                  KeyboardWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

KeyboardWrap:: KeyboardWrap (void) { }
KeyboardWrap::~KeyboardWrap (void) { }



//----------------------------------------------------------------------------//
// Functions                                                     KeyboardWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Click (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Get the associated keyboard wrapper
	KeyboardWrap* keyboardWrap = ObjectWrap::
		Unwrap<KeyboardWrap> (args.Holder());

	// Update the auto delay range and perform native key action
	keyboardWrap->mKeyboard.AutoDelay.Min = args[1]->Int32Value();
	keyboardWrap->mKeyboard.AutoDelay.Max = args[2]->Int32Value();
	if (args[0]->IsNumber())
		keyboardWrap->mKeyboard.Click ((Key) args[0]->Int32Value());

	else
	{
		// Perform series of key actions
		String::Utf8Value value (args[0]);
		auto keys = *value ? *value : "";
		bool res = keyboardWrap->mKeyboard.Click (keys);

		args.GetReturnValue().Set
			// Return the resulting value
			(Boolean::New (isolate, res));
	}
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Press (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Get the associated keyboard wrapper
	KeyboardWrap* keyboardWrap = ObjectWrap::
		Unwrap<KeyboardWrap> (args.Holder());

	// Update the auto delay range and perform native key action
	keyboardWrap->mKeyboard.AutoDelay.Min = args[1]->Int32Value();
	keyboardWrap->mKeyboard.AutoDelay.Max = args[2]->Int32Value();
	keyboardWrap->mKeyboard.Press ((Key) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Release (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Get the associated keyboard wrapper
	KeyboardWrap* keyboardWrap = ObjectWrap::
		Unwrap<KeyboardWrap> (args.Holder());

	// Update the auto delay range and perform native key action
	keyboardWrap->mKeyboard.AutoDelay.Min = args[1]->Int32Value();
	keyboardWrap->mKeyboard.AutoDelay.Max = args[2]->Int32Value();
	keyboardWrap->mKeyboard.Release ((Key) args[0]->Int32Value());
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Compile (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	String::Utf8Value value (args[0]);
	auto keys = *value ? *value : "";

	KeyList list;
	// Attempt to compile the key list
	if (Keyboard::Compile (keys, list))
	{
		int length = (int) list.size();
		auto res = Array::New (isolate, length);

		// Loop array and add to result
		for (int i = 0; i < length; ++i)
		{
			auto obj = Object::New (isolate);
			obj->Set ( String::NewFromUtf8 (isolate, "down"),
					  Boolean::New (isolate, list[i].first ));
			obj->Set ( String::NewFromUtf8 (isolate, "key" ),
					   Number::New (isolate, list[i].second));

			res->Set (i, obj);
		}

		args.GetReturnValue().Set (res);
	}

	else
	{
		// Return an empty array
		args.GetReturnValue().Set
			(Array::New (isolate));
	}
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::GetState (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Check for undefined arg
	if (args[0]->IsUndefined())
	{
		auto res = Object::New (isolate);

		KeyState state;
		// Retrieve all keycode states
		if (Keyboard::GetState (state))
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
		bool res = Keyboard::GetState
			// Get info about a single key
			((Key) args[0]->Int32Value());

		args.GetReturnValue().Set
			// Return the resulting value
			(Boolean::New (isolate, res));
	}
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::New (const FunctionCallbackInfo<Value>& args)
{
	// Create scope using current isolation
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope (isolate);

	// Create new class instance and wrap it
	(new KeyboardWrap())->Wrap (args.This());
	args.GetReturnValue() .Set (args.This());
}

////////////////////////////////////////////////////////////////////////////////

void KeyboardWrap::Initialize (Handle<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Instantiate a new function template for our class creator
	auto tpl = FunctionTemplate::New (isolate, KeyboardWrap::New);
	tpl->SetClassName (String::NewFromUtf8 (isolate, "Keyboard"));
	tpl->InstanceTemplate()->SetInternalFieldCount (1);

	NODE_SET_PROTOTYPE_METHOD (tpl, "click",   Click  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "press",   Press  );
	NODE_SET_PROTOTYPE_METHOD (tpl, "release", Release);

	NODE_SET_METHOD (tpl, "compile",  Compile );
	NODE_SET_METHOD (tpl, "getState", GetState);

	// Assign function template to our class creator
	constructor.Reset (isolate, tpl->GetFunction());
	exports->Set
		(String::NewFromUtf8 (isolate,
		"Keyboard"), tpl->GetFunction());
}
