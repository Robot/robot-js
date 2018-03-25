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

class ImageWrap : public ObjectWrap
{
	DECLARE_ROBOT_TYPE (Image);

private:
	static void		IsValid			(const FunctionCallbackInfo<Value>& args);

	static void		Create			(const FunctionCallbackInfo<Value>& args);
	static void		Destroy			(const FunctionCallbackInfo<Value>& args);

	static void		GetWidth		(const FunctionCallbackInfo<Value>& args);
	static void		GetHeight		(const FunctionCallbackInfo<Value>& args);
	static void		GetLength		(const FunctionCallbackInfo<Value>& args);
	static void		GetData			(const FunctionCallbackInfo<Value>& args);
	static void		GetLimit		(const FunctionCallbackInfo<Value>& args);

	static void		GetPixel		(const FunctionCallbackInfo<Value>& args);
	static void		SetPixel		(const FunctionCallbackInfo<Value>& args);

	static void		Fill			(const FunctionCallbackInfo<Value>& args);
	static void		Swap			(const FunctionCallbackInfo<Value>& args);
	static void		Flip			(const FunctionCallbackInfo<Value>& args);
	static void		Equals			(const FunctionCallbackInfo<Value>& args);

	static void		New				(const FunctionCallbackInfo<Value>& args);

public:
	static void		Initialize		(Handle<Object> exports);

public:
	Image mImage;
};
