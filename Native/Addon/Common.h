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
/// Common macro for wrapper creation

#define SET_WRAP( name )									\
	Persistent<Function> name ## Wrap::constructor;			\
	name ## Wrap:: name ## Wrap (void) { }					\
	name ## Wrap::~name ## Wrap (void) { }					\
	extern Persistent<Function> JsColor;					\
	extern Persistent<Function> JsImage;					\
	extern Persistent<Function> JsRange;					\
	extern Persistent<Function> JsPoint;					\
	extern Persistent<Function> JsSize;						\
	extern Persistent<Function> JsBounds;

////////////////////////////////////////////////////////////////////////////////
/// Create scope using current isolation

#define ISOLATE												\
	Isolate* isolate = Isolate::GetCurrent();				\
	HandleScope scope (isolate);							\
	Local<Value> _jsArgs[4];

////////////////////////////////////////////////////////////////////////////////
/// Get the associated class wrapper

#define UNWRAP( type, target )								\
	auto* m ## type ## Wrap = ObjectWrap::					\
			Unwrap<type ## Wrap> (target);					\
	auto* m ## type = &m ## type ## Wrap->m ## type;

////////////////////////////////////////////////////////////////////////////////
/// Isolate and get the class wrapper

#define ISOWRAP( type, target ) ISOLATE; UNWRAP (type, target);

////////////////////////////////////////////////////////////////////////////////
/// Various JavaScript type creators

#define NEW_INT( value ) Integer::New         (isolate, value )
#define NEW_NUM( value ) Number ::New         (isolate, value )
#define NEW_BOOL(value ) Boolean::New         (isolate, value )
#define NEW_STR( value ) String ::NewFromUtf8 (isolate, value )
#define NEW_OBJ          Object ::New         (isolate        )
#define NEW_ARR( length) Array  ::New         (isolate, length)

#define NEW_CTOR( type ) Local<Function>::New				\
		(isolate, type ## Wrap::constructor)

#define NEW_COLOR( r, g, b, a )								\
	(														\
		_jsArgs[0] = NEW_INT (r),							\
		_jsArgs[1] = NEW_INT (g),							\
		_jsArgs[2] = NEW_INT (b),							\
		_jsArgs[3] = NEW_INT (a),							\
		Local<Function>::New								\
			(isolate, JsColor)->NewInstance (4, _jsArgs)	\
	)

#define NEW_IMAGE( w, h )									\
	(														\
		_jsArgs[0] = NEW_INT (w),							\
		_jsArgs[1] = NEW_INT (h),							\
		Local<Function>::New								\
			(isolate, JsImage)->NewInstance (2, _jsArgs)	\
	)

#define NEW_RANGE( min, max )								\
	(														\
		_jsArgs[0] = NEW_INT (min),							\
		_jsArgs[1] = NEW_INT (max),							\
		Local<Function>::New								\
			(isolate, JsRange)->NewInstance (2, _jsArgs)	\
	)

#define NEW_POINT( x, y )									\
	(														\
		_jsArgs[0] = NEW_INT (x),							\
		_jsArgs[1] = NEW_INT (y),							\
		Local<Function>::New								\
			(isolate, JsPoint)->NewInstance (2, _jsArgs)	\
	)

#define NEW_SIZE( w, h )									\
	(														\
		_jsArgs[0] = NEW_INT (w),							\
		_jsArgs[1] = NEW_INT (h),							\
		Local<Function>::New								\
			(isolate, JsSize)->NewInstance (2, _jsArgs)		\
	)

#define NEW_BOUNDS( x, y, w, h )							\
	(														\
		_jsArgs[0] = NEW_INT (x),							\
		_jsArgs[1] = NEW_INT (y),							\
		_jsArgs[2] = NEW_INT (w),							\
		_jsArgs[3] = NEW_INT (h),							\
		Local<Function>::New								\
			(isolate, JsBounds)->NewInstance (4, _jsArgs)	\
	)

////////////////////////////////////////////////////////////////////////////////
/// Simulate simple value returns

#define RETURN( value ) { args.GetReturnValue().Set (value); return; }

#define RETURN_INT( value ) RETURN (NEW_INT  (value));
#define RETURN_NUM( value ) RETURN (NEW_NUM  (value));
#define RETURN_BOOL(value ) RETURN (NEW_BOOL (value));
#define RETURN_STR( value ) RETURN (NEW_STR  (value));
#define RETURN_OBJ          RETURN (NEW_OBJ         );
#define RETURN_ARR          RETURN (NEW_ARR  (0    ));

#define  RETURN_COLOR( r, g, b, a )							\
	RETURN (NEW_COLOR (r, g, b, a));

#define  RETURN_IMAGE( w, h )								\
	RETURN (NEW_IMAGE (w, h));

#define  RETURN_RANGE( min, max )							\
	RETURN (NEW_RANGE (min, max));

#define  RETURN_POINT( x, y )								\
	RETURN (NEW_POINT (x, y));

#define  RETURN_SIZE( w, h )								\
	RETURN (NEW_SIZE (w, h));

#define  RETURN_BOUNDS( x, y, w, h )						\
	RETURN (NEW_BOUNDS (x, y, w, h));

////////////////////////////////////////////////////////////////////////////////
/// Cleaner way of throwing exceptions

#define THROW( type, error )								\
	RETURN (isolate->ThrowException (Exception				\
			::type ##Error (NEW_STR (error))));

#endif // ADDON_COMMON_H
