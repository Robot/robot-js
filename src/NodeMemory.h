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

class MemoryWrap : public ObjectWrap
{
	DECLARE_ROBOT_TYPE (Memory);

private:
	static void		IsValid			(const FunctionCallbackInfo<Value>& args);
	static void		GetProcess		(const FunctionCallbackInfo<Value>& args);
	static void		GetStats		(const FunctionCallbackInfo<Value>& args);

	static void		GetRegion		(const FunctionCallbackInfo<Value>& args);
	static void		GetRegions		(const FunctionCallbackInfo<Value>& args);
	static void		SetAccess		(const FunctionCallbackInfo<Value>& args);

	static void		Find			(const FunctionCallbackInfo<Value>& args);

	static void		CreateCache		(const FunctionCallbackInfo<Value>& args);
	static void		 ClearCache		(const FunctionCallbackInfo<Value>& args);
	static void		DeleteCache		(const FunctionCallbackInfo<Value>& args);
	static void		IsCaching		(const FunctionCallbackInfo<Value>& args);
	static void		GetCacheSize	(const FunctionCallbackInfo<Value>& args);

	static void		 ReadData		(const FunctionCallbackInfo<Value>& args);
	static void		WriteData		(const FunctionCallbackInfo<Value>& args);
	static void		 ReadType		(const FunctionCallbackInfo<Value>& args);
	static void		WriteType		(const FunctionCallbackInfo<Value>& args);

	static void		New				(const FunctionCallbackInfo<Value>& args);

public:
	static void		Initialize		(Handle<Object> exports);

public:
	Memory mMemory;
};
