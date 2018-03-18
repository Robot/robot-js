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

#pragma once
#include "NodeCommon.h"



//----------------------------------------------------------------------------//
// Classes                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

class KeyboardWrap : public ObjectWrap
{
	DECLARE_ROBOT_TYPE (Keyboard);

private:
	static void		Click			(const FunctionCallbackInfo<Value>& args);
	static void		Press			(const FunctionCallbackInfo<Value>& args);
	static void		Release			(const FunctionCallbackInfo<Value>& args);

	static void		Compile			(const FunctionCallbackInfo<Value>& args);
	static void		GetState		(const FunctionCallbackInfo<Value>& args);

	static void		New				(const FunctionCallbackInfo<Value>& args);

public:
	static void		Initialize		(Handle<Object> exports);

public:
	Keyboard mKeyboard;
};
