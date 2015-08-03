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

#ifndef ADDON_COMMON_H
#define ADDON_COMMON_H

#include <node.h>
#include <node_object_wrap.h>
#include "../Robot/Robot.h"

using namespace v8;
using namespace node;
ROBOT_NS_USE_ALL;



//----------------------------------------------------------------------------//
// Macros                                                                     //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////
/// Common macro for wrapper definition

#define SET_WRAP( name )									\
	Persistent<Function> name ## Wrap::constructor;			\
	name ## Wrap:: name ## Wrap (void) { }					\
	name ## Wrap::~name ## Wrap (void) { }

////////////////////////////////////////////////////////////////////////////////
/// Create scope using current isolation

#define ISOLATE												\
	Isolate* isolate = Isolate::GetCurrent();				\
	HandleScope scope (isolate);

////////////////////////////////////////////////////////////////////////////////
/// Get the associated class wrapper

#define UNWRAP( type, target )								\
	auto* m ## type ## Wrap = ObjectWrap::					\
			Unwrap<type ## Wrap> (target);					\
	auto* m ## type = &m ## type ## Wrap->m ## type;

////////////////////////////////////////////////////////////////////////////////
/// Various JavaScript type creators

#define NEW_INT( value )									\
	Integer::New (isolate, value)

#define NEW_NUM( value )									\
	Number::New (isolate, value)

#define NEW_BOOL( value )									\
	Boolean::New (isolate, value)

#define NEW_STR( value )									\
	String::NewFromUtf8 (isolate, value)

#define NEW_OBJ												\
	Object::New (isolate)

#define NEW_ARR( length )									\
	Array::New (isolate, length)

#define NEW_CTOR( type )									\
	Local<Function>::New (isolate,							\
		type ## Wrap::constructor);

////////////////////////////////////////////////////////////////////////////////
/// Simulate simple value returns

#define RETURN( value )										\
	args.GetReturnValue().Set (value); return;

#define RETURN_INT( value )									\
	RETURN (NEW_INT (value)); return;

#define RETURN_NUM( value )									\
	RETURN (NEW_NUM (value)); return;

#define RETURN_BOOL( value )								\
	RETURN (NEW_BOOL (value)); return;

#define RETURN_STR( value )									\
	RETURN (NEW_STR (value)); return;

#define RETURN_OBJ											\
	RETURN (NEW_OBJ); return;

#define RETURN_ARR											\
	RETURN (NEW_ARR (0)); return;

////////////////////////////////////////////////////////////////////////////////
/// Macros for reducing simple getters

#define FAST_VOID( type, target, function )					\
	ISOLATE; UNWRAP (type, target);							\
	m ## type->function; return;

#define FAST_INT( type, target, function )					\
	ISOLATE; UNWRAP (type, target);							\
	RETURN_INT (m ## type->function);

#define FAST_NUM( type, target, function )					\
	ISOLATE; UNWRAP (type, target);							\
	RETURN_NUM (m ## type->function);

#define FAST_BOOL( type, target, function )					\
	ISOLATE; UNWRAP (type, target);							\
	RETURN_BOOL (m ## type->function);

#define FAST_STR( type, target, function )					\
	ISOLATE; UNWRAP (type, target);							\
	RETURN_STR (m ## type->function);

#endif // ADDON_COMMON_H
