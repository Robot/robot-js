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

class ScreenWrap : public ObjectWrap
{
private:
	static void		Synchronize		(const FunctionCallbackInfo<Value>& args);
	static void		GrabScreen		(const FunctionCallbackInfo<Value>& args);

	static void		 IsCompositing	(const FunctionCallbackInfo<Value>& args);
	static void		SetCompositing	(const FunctionCallbackInfo<Value>& args);

public:
	static void		Initialize		(Handle<Object> exports);
};
