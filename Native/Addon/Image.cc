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

#include "Image.h"
DEFINE_ROBOT_TYPE (Image);



//----------------------------------------------------------------------------//
// Functions                                                        ImageWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::Create (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Image, args.Holder());

	mImage->Create
		((uint16) args[0]->Int32Value(),
		 (uint16) args[1]->Int32Value());

	args.This()->Set (NEW_STR ("_valid" ), NEW_BOOL (mImage->IsValid  ()));
	args.This()->Set (NEW_STR ("_width" ), NEW_INT  (mImage->GetWidth ()));
	args.This()->Set (NEW_STR ("_height"), NEW_INT  (mImage->GetHeight()));
	args.This()->Set (NEW_STR ("_length"), NEW_INT  (mImage->GetLength()));
	args.This()->Set (NEW_STR ("_limit" ), NEW_INT  (mImage->GetLimit ()));
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::Destroy (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Image, args.Holder()); mImage->Destroy();
	args.This()->Set (NEW_STR ("_valid" ), NEW_BOOL (0));
	args.This()->Set (NEW_STR ("_width" ), NEW_INT  (0));
	args.This()->Set (NEW_STR ("_height"), NEW_INT  (0));
	args.This()->Set (NEW_STR ("_length"), NEW_INT  (0));
	args.This()->Set (NEW_STR ("_limit" ), NEW_INT  (0));
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::GetData (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Image, args.Holder());

	// Check if image is currently valid
	if (!mImage->IsValid()) RETURN_NULL;

	// Get pointers to the image data
	uint32* data = mImage->GetData  ();
	uint32  size = mImage->GetLength();

	// Bind reference and return view
	auto b = ArrayBuffer::New (isolate,
		 data, size * sizeof (uint32));

	RETURN (Uint32Array::New (b, 0, size));
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::GetPixel (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Image, args.Holder());

	Color color = mImage->GetPixel
		((uint16) args[0]->Int32Value(),
		 (uint16) args[1]->Int32Value());

	RETURN_COLOR (color.R, color.G,
				  color.B, color.A);
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::SetPixel (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Image, args.Holder());

	mImage->SetPixel
		  ((uint16) args[0]->Int32Value(),
		   (uint16) args[1]->Int32Value(),
	Color ((uint8 ) args[2]->Int32Value(),
		   (uint8 ) args[3]->Int32Value(),
		   (uint8 ) args[4]->Int32Value(),
		   (uint8 ) args[5]->Int32Value()));
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::Fill (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Image, args.Holder());

	RETURN_BOOL (mImage->Fill (Color
		((uint8) args[0]->Int32Value(),
		 (uint8) args[1]->Int32Value(),
		 (uint8) args[2]->Int32Value(),
		 (uint8) args[3]->Int32Value())));
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::Swap (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Image, args.Holder());

	// Check for valid args
	if (!args[0]->IsString())
		THROW (Type, "Invalid arguments");

	String::Utf8Value value (args[0]);
	auto swap = *value ? *value : "";
	RETURN_BOOL (mImage->Swap (swap));
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::Flip (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Image, args.Holder());

	// Check for valid arguments
	if ((!args[0]->IsBoolean() &&
		 !args[0]->IsUndefined()) ||
		(!args[1]->IsBoolean() &&
		 !args[1]->IsUndefined()))
		THROW (Type, "Invalid arguments");

	bool h = args[0]->BooleanValue();
	bool v = args[1]->BooleanValue();
	RETURN_BOOL (mImage->Flip (h, v));
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::Equals (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	auto* wrapper1 = ObjectWrap::Unwrap<ImageWrap> (args      .Holder());
	auto* wrapper2 = ObjectWrap::Unwrap<ImageWrap> (args[0]->ToObject());
	RETURN_BOOL (wrapper1->mImage == wrapper2->mImage);
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::New (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Whether called using new
	if (args.IsConstructCall())
	{
		auto wrapper = new ImageWrap();
		wrapper->Wrap (args.This());

		// Check whether the argument is another image
		auto other = UnwrapRobot<ImageWrap> (args[0]);
		if  (other)  wrapper->mImage = other->mImage;

		else
		{
			// Normalize the size argument
			auto s = Local<Function>::New
				(isolate, JsSize)->NewInstance
				(2, (_jsArgs[0] = args[0],
					 _jsArgs[1] = args[1], _jsArgs));

			wrapper->mImage.Create
				((uint16) s->Get (NEW_STR ("w"))->Int32Value(),
				 (uint16) s->Get (NEW_STR ("h"))->Int32Value());
		}

		auto image = &wrapper->mImage;
		args.This()->Set (NEW_STR ("_valid" ), NEW_BOOL (image->IsValid  ()));
		args.This()->Set (NEW_STR ("_width" ), NEW_INT  (image->GetWidth ()));
		args.This()->Set (NEW_STR ("_height"), NEW_INT  (image->GetHeight()));
		args.This()->Set (NEW_STR ("_length"), NEW_INT  (image->GetLength()));
		args.This()->Set (NEW_STR ("_limit" ), NEW_INT  (image->GetLimit ()));

		REGISTER_ROBOT_TYPE;
		RETURN (args.This());
	}

	else
	{
		auto ctor = NEW_CTOR (Image);
		// Return as a new instance
		RETURN (ctor->NewInstance (2,
			   (_jsArgs[0] = args[0],
				_jsArgs[1] = args[1], _jsArgs)));
	}
}

////////////////////////////////////////////////////////////////////////////////

void ImageWrap::Initialize (Handle<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Associate the new function with new template
	auto tpl = FunctionTemplate::New (isolate, New);
	tpl->InstanceTemplate()->SetInternalFieldCount (1);
	tpl->SetClassName (NEW_STR ("Image"));

	NODE_SET_PROTOTYPE_METHOD (tpl, "_create",   Create  );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "destroy",  Destroy );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "getData",  GetData );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_getPixel", GetPixel);
	NODE_SET_PROTOTYPE_METHOD (tpl, "_setPixel", SetPixel);

	NODE_SET_PROTOTYPE_METHOD (tpl, "_fill",     Fill    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "swap",     Swap    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "flip",     Flip    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_equals",   Equals  );

	// Assign function template to our class creator
	constructor.Reset (isolate, tpl->GetFunction());
	exports->Set
			(NEW_STR ("Image"), tpl->GetFunction());
}
