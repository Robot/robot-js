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

class ProcessWrap : public ObjectWrap
{
	DECLARE_ROBOT_TYPE (Process);

private:
	static void		 Open			(const FunctionCallbackInfo<Value>& args);
	static void		Close			(const FunctionCallbackInfo<Value>& args);

	static void		IsValid			(const FunctionCallbackInfo<Value>& args);
	static void		Is64Bit			(const FunctionCallbackInfo<Value>& args);
	static void		IsDebugged		(const FunctionCallbackInfo<Value>& args);

	static void		GetPID			(const FunctionCallbackInfo<Value>& args);
	static void		GetName			(const FunctionCallbackInfo<Value>& args);
	static void		GetPath			(const FunctionCallbackInfo<Value>& args);

	static void		Exit			(const FunctionCallbackInfo<Value>& args);
	static void		Kill			(const FunctionCallbackInfo<Value>& args);
	static void		HasExited		(const FunctionCallbackInfo<Value>& args);

	static void		GetModules		(const FunctionCallbackInfo<Value>& args);
	static void		GetWindows		(const FunctionCallbackInfo<Value>& args);
	static void		Equals			(const FunctionCallbackInfo<Value>& args);

	static void		GetList			(const FunctionCallbackInfo<Value>& args);
	static void		GetCurrent		(const FunctionCallbackInfo<Value>& args);
	static void		IsSys64Bit		(const FunctionCallbackInfo<Value>& args);
	static void		GetSegments		(const FunctionCallbackInfo<Value>& args);

	static void		New				(const FunctionCallbackInfo<Value>& args);

public:
	static void		Initialize		(Handle<Object> exports);

public:
	Process mProcess;
};
