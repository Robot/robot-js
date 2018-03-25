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

class ClipboardWrap : public ObjectWrap
{
private:
	static void		Clear			(const FunctionCallbackInfo<Value>& args);

	static void		HasText			(const FunctionCallbackInfo<Value>& args);
	static void		GetText			(const FunctionCallbackInfo<Value>& args);
	static void		SetText			(const FunctionCallbackInfo<Value>& args);

	static void		HasImage		(const FunctionCallbackInfo<Value>& args);
	static void		GetImage		(const FunctionCallbackInfo<Value>& args);
	static void		SetImage		(const FunctionCallbackInfo<Value>& args);

	static void		GetSequence		(const FunctionCallbackInfo<Value>& args);

public:
	static void		Initialize		(Handle<Object> exports);
};
