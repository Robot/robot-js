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

#include "NodeClipboard.h"
#include "NodeImage.h"



//----------------------------------------------------------------------------//
// Functions                                                    ClipboardWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void ClipboardWrap::Clear (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	RETURN_BOOL (Clipboard::Clear());
}

////////////////////////////////////////////////////////////////////////////////

void ClipboardWrap::HasText (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	RETURN_BOOL (Clipboard::HasText());
}

////////////////////////////////////////////////////////////////////////////////

void ClipboardWrap::GetText (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	RETURN_STR (Clipboard::GetText().data());
}

////////////////////////////////////////////////////////////////////////////////

void ClipboardWrap::SetText (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Check for valid args
	if (!args[0]->IsString())
		THROW (Type, "Invalid arguments");

	String::Utf8Value value (args[0]);
	auto text = *value ? *value : "";
	RETURN_BOOL (Clipboard::SetText (text));
}

////////////////////////////////////////////////////////////////////////////////

void ClipboardWrap::HasImage (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	RETURN_BOOL (Clipboard::HasImage());
}

////////////////////////////////////////////////////////////////////////////////

void ClipboardWrap::GetImage (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Attempt to unwrap into native image type
	auto wrap = UnwrapRobot<ImageWrap> (args[0]);
	if (!wrap) THROW (Type, "Invalid arguments");

	RETURN_BOOL (Clipboard::GetImage (wrap->mImage));
}

////////////////////////////////////////////////////////////////////////////////

void ClipboardWrap::SetImage (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Attempt to unwrap into native image type
	auto wrap = UnwrapRobot<ImageWrap> (args[0]);
	if (!wrap) THROW (Type, "Invalid arguments");

	RETURN_BOOL (Clipboard::SetImage (wrap->mImage));
}

////////////////////////////////////////////////////////////////////////////////

void ClipboardWrap::GetSequence (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	RETURN_NUM ((double) Clipboard::GetSequence());
}

////////////////////////////////////////////////////////////////////////////////

void ClipboardWrap::Initialize (Handle<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Create the resulting object
	Local<Object> result = NEW_OBJ;

	NODE_SET_METHOD (result, "clear",       Clear      );

	NODE_SET_METHOD (result, "hasText",     HasText    );
	NODE_SET_METHOD (result, "getText",     GetText    );
	NODE_SET_METHOD (result, "setText",     SetText    );

	NODE_SET_METHOD (result, "hasImage",    HasImage   );
	NODE_SET_METHOD (result, "getImage",    GetImage   );
	NODE_SET_METHOD (result, "setImage",    SetImage   );

	NODE_SET_METHOD (result, "getSequence", GetSequence);

	// Export clipboard functions inside object
	exports->Set (NEW_STR ("Clipboard"), result);
}
