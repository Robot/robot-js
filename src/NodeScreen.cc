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

#include "NodeScreen.h"
#include "NodeWindow.h"
#include "NodeImage.h"

extern Persistent<Function> JsBounds;



//----------------------------------------------------------------------------//
// Functions                                                       ScreenWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void ScreenWrap::Synchronize (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Synchronize screens
	auto status = NEW_BOOL
		(Screen::Synchronize());

	// Retrieve a list of screens
	auto list = Screen::GetList();

	int length = (int) list.size();
	auto screens = NEW_ARR (length);
	// Loop array and add to result
	for (int i = 0; i < length; ++i)
	{
		auto obj = NEW_OBJ;
		Bounds b = list[i]->GetBounds();
		Bounds u = list[i]->GetUsable();
		OBJECT_SET (obj, NEW_STR ("bounds"), NEW_BOUNDS (b.X, b.Y, b.W, b.H));
		OBJECT_SET (obj, NEW_STR ("usable"), NEW_BOUNDS (u.X, u.Y, u.W, u.H));
		OBJECT_SET (screens, i, obj);
	}

	auto res = NEW_OBJ;
	Bounds b = Screen::GetTotalBounds();
	Bounds u = Screen::GetTotalUsable();
	OBJECT_SET (res, NEW_STR ("screens"), screens);
	OBJECT_SET (res, NEW_STR ("status" ), status );
	OBJECT_SET (res, NEW_STR ("totalBounds"), NEW_BOUNDS (b.X, b.Y, b.W, b.H));
	OBJECT_SET (res, NEW_STR ("totalUsable"), NEW_BOUNDS (u.X, u.Y, u.W, u.H));
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void ScreenWrap::GrabScreen (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	auto img = UnwrapRobot< ImageWrap> (args[0]);
	auto win = UnwrapRobot<WindowWrap> (args[5]);

	RETURN_BOOL (Screen::GrabScreen (img->mImage,
		INT32_VALUE (args[1]), INT32_VALUE (args[2]),
		INT32_VALUE (args[3]), INT32_VALUE (args[4]),
		win ? win->mWindow : Window()));
}

////////////////////////////////////////////////////////////////////////////////

void ScreenWrap::IsCompositing (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	RETURN_BOOL (Screen::IsCompositing());
}

////////////////////////////////////////////////////////////////////////////////

void ScreenWrap::SetCompositing (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Check for valid args
	if (!args[0]->IsBoolean())
		THROW (Type, "Invalid arguments");

	bool ec = BOOLEAN_VALUE (args[0]);
	Screen::SetCompositing (ec);
}

////////////////////////////////////////////////////////////////////////////////

void ScreenWrap::Initialize (Local<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Create the resulting object
	Local<Object> result = NEW_OBJ;

	NODE_SET_METHOD (result, "synchronize",    Synchronize   );
	NODE_SET_METHOD (result, "grabScreen",     GrabScreen    );

	NODE_SET_METHOD (result,  "isCompositing",  IsCompositing);
	NODE_SET_METHOD (result, "setCompositing", SetCompositing);

	// Export screen functions inside object
	OBJECT_SET (exports, NEW_STR ("Screen"), result);
}
