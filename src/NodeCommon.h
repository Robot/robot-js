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

#include <node_buffer.h>
#include <node_object_wrap.h>
#include "Robot.h"

using namespace v8;
using namespace node;
ROBOT_NS_USE_ALL;



//----------------------------------------------------------------------------//
// Macros                                                                     //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

#define ISOLATE												\
	Isolate* isolate = Isolate::GetCurrent();				\
	HandleScope scope (isolate);							\
	Local<Value> _jsArgs[4];

////////////////////////////////////////////////////////////////////////////////

#define UNWRAP( type, target )								\
	auto* m ## type ## Wrap = ObjectWrap::					\
			Unwrap<type ## Wrap> (target);					\
	auto* m ## type = &m ## type ## Wrap->m ## type;

////////////////////////////////////////////////////////////////////////////////

#define ISOWRAP( type, target ) ISOLATE; UNWRAP (type, target);

////////////////////////////////////////////////////////////////////////////////

#define NEW_INT( value ) Integer::New         (isolate, value )
#define NEW_NUM( value ) Number ::New         (isolate, value )
#define NEW_BOOL(value ) Boolean::New         (isolate, value )
#define NEW_STR( value ) String ::NewFromUtf8 (isolate, value )
#define NEW_OBJ          Object ::New         (isolate        )
#define NEW_ARR( length) Array  ::New         (isolate, length)
#define NEW_NULL         Null                 (isolate        )

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

#define NEW_MODULE  Local<Function>::New (isolate, JsModule )->NewInstance()
#define NEW_SEGMENT Local<Function>::New (isolate, JsSegment)->NewInstance()
#define NEW_STATS   Local<Function>::New (isolate, JsStats  )->NewInstance()
#define NEW_REGION  Local<Function>::New (isolate, JsRegion )->NewInstance()

////////////////////////////////////////////////////////////////////////////////

#define RETURN( value ) { args.GetReturnValue().Set (value); return; }

#define RETURN_INT( value ) RETURN (NEW_INT  (value));
#define RETURN_NUM( value ) RETURN (NEW_NUM  (value));
#define RETURN_BOOL(value ) RETURN (NEW_BOOL (value));
#define RETURN_STR( value ) RETURN (NEW_STR  (value));
#define RETURN_OBJ          RETURN (NEW_OBJ         );
#define RETURN_ARR          RETURN (NEW_ARR  (0    ));
#define RETURN_NULL         RETURN (NEW_NULL        );
#define RETURN_TRUE			RETURN (NEW_BOOL (true ));
#define RETURN_FALSE		RETURN (NEW_BOOL (false));

#define  RETURN_COLOR( r, g, b, a )							\
	RETURN (NEW_COLOR (r, g, b, a));

#define  RETURN_RANGE( min, max )							\
	RETURN (NEW_RANGE (min, max));

#define  RETURN_POINT( x, y )								\
	RETURN (NEW_POINT (x, y));

#define  RETURN_SIZE( w, h )								\
	RETURN (NEW_SIZE (w, h));

#define  RETURN_BOUNDS( x, y, w, h )						\
	RETURN (NEW_BOUNDS (x, y, w, h));

////////////////////////////////////////////////////////////////////////////////

#define THROW( type, error )								\
	RETURN (isolate->ThrowException (Exception				\
			::type ##Error (NEW_STR (error))));



//----------------------------------------------------------------------------//
// Wrappers                                                                   //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

enum RobotType
{
	TypeImage		= 0x100,
	TypeKeyboard	= 0x200,
	TypeMouse		= 0x300,
	TypeProcess		= 0x400,
	TypeMemory		= 0x500,
	TypeWindow		= 0x600,
};

////////////////////////////////////////////////////////////////////////////////

#define DECLARE_ROBOT_TYPE( type )							\
	public:													\
		static Persistent<Function> constructor;			\
		static const int ClassType = Type ## type;			\
	private:												\
		 type ## Wrap (void);								\
		~type ## Wrap (void);

////////////////////////////////////////////////////////////////////////////////

#define DEFINE_ROBOT_TYPE( type )							\
	Persistent<Function> type ## Wrap::constructor;			\
	type ## Wrap:: type ## Wrap (void) { }					\
	type ## Wrap::~type ## Wrap (void) { }					\
	extern Persistent<Function> JsColor;					\
	extern Persistent<Function> JsRange;					\
	extern Persistent<Function> JsPoint;					\
	extern Persistent<Function> JsSize;						\
	extern Persistent<Function> JsBounds;					\
															\
	extern Persistent<Function> JsModule;					\
	extern Persistent<Function> JsSegment;					\
	extern Persistent<Function> JsStats;					\
	extern Persistent<Function> JsRegion;

////////////////////////////////////////////////////////////////////////////////

#if NODE_MODULE_VERSION >= 48

	#define REGISTER_ROBOT_TYPE								\
	{														\
		auto context = isolate->GetCurrentContext();		\
		auto privateKeyValue = Private::ForApi				\
			(isolate, NEW_STR ("_ROBOT_TYPE"));				\
															\
		args.This()->SetPrivate (context,					\
			privateKeyValue, NEW_INT (ClassType));			\
	}

#else

	#define REGISTER_ROBOT_TYPE								\
		args.This()->SetHiddenValue (NEW_STR				\
		("_ROBOT_TYPE"), NEW_INT (ClassType));

#endif

////////////////////////////////////////////////////////////////////////////////

template <class T>
inline T* UnwrapRobot (Handle<Value> value)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Value needs to be at least an object
	if (!value->IsObject()) return nullptr;

	// Retrieve the local object
	auto obj = value->ToObject();

#if NODE_MODULE_VERSION >= 48

	auto context = isolate->GetCurrentContext();
	auto privateKeyValue = Private::ForApi
		(isolate, NEW_STR ("_ROBOT_TYPE"));

	auto type = obj->GetPrivate (context,
		privateKeyValue).ToLocalChecked();

#else

	// Convert and get hidden type
	auto type = obj->GetHiddenValue
		  (NEW_STR ("_ROBOT_TYPE"));

#endif

	// The value must contain a handle
	if (type.IsEmpty()) return nullptr;

	// Compare hidden type with class type
	if (type->Int32Value() != T::ClassType)
		return nullptr;

	// Return the final unwrapped class
	return ObjectWrap::Unwrap<T> (obj);
}
