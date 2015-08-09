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

#ifndef ADDON_MOUSE_H
#define ADDON_MOUSE_H

#include "Common.h"



//----------------------------------------------------------------------------//
// Classes                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

class MouseWrap : public ObjectWrap
{
	DECLARE_ROBOT_TYPE (Mouse);

private:
	static void		Click			(const FunctionCallbackInfo<Value>& args);
	static void		Press			(const FunctionCallbackInfo<Value>& args);
	static void		Release			(const FunctionCallbackInfo<Value>& args);
	static void		ScrollH			(const FunctionCallbackInfo<Value>& args);
	static void		ScrollV			(const FunctionCallbackInfo<Value>& args);

	static void		GetPos			(const FunctionCallbackInfo<Value>& args);
	static void		SetPos			(const FunctionCallbackInfo<Value>& args);
	static void		GetState		(const FunctionCallbackInfo<Value>& args);

	static void		New				(const FunctionCallbackInfo<Value>& args);

public:
	static void		Initialize		(Handle<Object> exports);

public:
	Mouse mMouse;
};

#endif // ADDON_MOUSE_H
