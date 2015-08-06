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

#ifndef ADDON_KEYBOARD_H
#define ADDON_KEYBOARD_H

#include "Common.h"



//----------------------------------------------------------------------------//
// Classes                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

class KeyboardWrap : public ObjectWrap
{
private:
	 KeyboardWrap					(void);
	~KeyboardWrap					(void);

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

	// Function which defines class creator
	static Persistent<Function> constructor;
};

#endif // ADDON_KEYBOARD_H
