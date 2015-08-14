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

#ifndef ADDON_SCREEN_H
#define ADDON_SCREEN_H

#include "Common.h"



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

#endif // ADDON_SCREEN_H
