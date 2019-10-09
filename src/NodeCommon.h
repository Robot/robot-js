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

#if NODE_MODULE_VERSION >= 46

	#define NEW_INSTANCE( f, argc, argv ) f->NewInstance (v8::Context::New (isolate), argc, argv).ToLocalChecked()

#else

	#define NEW_INSTANCE( f, argc, argv ) f->NewInstance (argc, argv)

#endif

////////////////////////////////////////////////////////////////////////////////

#define NEW_INT( value ) Integer::New         (isolate, value )
#define NEW_NUM( value ) Number ::New         (isolate, value )
#define NEW_BOOL(value ) Boolean::New         (isolate, value )
#if NODE_MODULE_VERSION >= 67
#define NEW_STR( value ) String ::NewFromUtf8 (isolate, value, v8::NewStringType::kNormal).ToLocalChecked()
#else
#define NEW_STR( value ) String ::NewFromUtf8 (isolate, value )
#endif
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
		NEW_INSTANCE (Local<Function>::New (isolate, JsColor), 4, _jsArgs) \
	)

#define NEW_RANGE( min, max )								\
	(														\
		_jsArgs[0] = NEW_INT (min),							\
		_jsArgs[1] = NEW_INT (max),							\
		NEW_INSTANCE (Local<Function>::New (isolate, JsRange), 2, _jsArgs) \
	)

#define NEW_POINT( x, y )									\
	(														\
		_jsArgs[0] = NEW_INT (x),							\
		_jsArgs[1] = NEW_INT (y),							\
		NEW_INSTANCE (Local<Function>::New (isolate, JsPoint), 2, _jsArgs) \
	)

#define NEW_SIZE( w, h )									\
	(														\
		_jsArgs[0] = NEW_INT (w),							\
		_jsArgs[1] = NEW_INT (h),							\
		NEW_INSTANCE (Local<Function>::New (isolate, JsSize), 2, _jsArgs) \
	)

#define NEW_BOUNDS( x, y, w, h )							\
	(														\
		_jsArgs[0] = NEW_INT (x),							\
		_jsArgs[1] = NEW_INT (y),							\
		_jsArgs[2] = NEW_INT (w),							\
		_jsArgs[3] = NEW_INT (h),							\
		NEW_INSTANCE (Local<Function>::New (isolate, JsBounds), 4, _jsArgs) \
	)

#define NEW_MODULE  NEW_INSTANCE (Local<Function>::New (isolate, JsModule ), 0, NULL)
#define NEW_SEGMENT NEW_INSTANCE (Local<Function>::New (isolate, JsSegment), 0, NULL)
#define NEW_STATS   NEW_INSTANCE (Local<Function>::New (isolate, JsStats  ), 0, NULL)
#define NEW_REGION  NEW_INSTANCE (Local<Function>::New (isolate, JsRegion ), 0, NULL)

////////////////////////////////////////////////////////////////////////////////

#if NODE_MODULE_VERSION >= 70
#define BOOLEAN_VALUE( value ) (value->BooleanValue (isolate))
#define UTF8_VAR( var, value ) String::Utf8Value var (isolate, value)
#else
#define BOOLEAN_VALUE( value ) (value->BooleanValue())
#define UTF8_VAR( var, value ) String::Utf8Value var (value)
#endif

#if NODE_MODULE_VERSION >= 67
#define TO_OBJECT( value ) (value->ToObject (isolate->GetCurrentContext()).ToLocalChecked())
#define NUMBER_VALUE( value ) (value->NumberValue (isolate->GetCurrentContext()).ToChecked())
#define INT32_VALUE( value ) (value->Int32Value (isolate->GetCurrentContext()).ToChecked())
#define UINT32_VALUE( value ) (value->Uint32Value (isolate->GetCurrentContext()).ToChecked())
#define OBJECT_GET( map, key ) (map->Get (isolate->GetCurrentContext(), key).ToLocalChecked())
#define OBJECT_SET( map, key, value ) (map->Set (isolate->GetCurrentContext(), key, value).ToChecked())
#define GET_FUNCTION( tpl ) (tpl->GetFunction (isolate->GetCurrentContext()).ToLocalChecked())
#else
#define TO_OBJECT( value ) (value->ToObject())
#define NUMBER_VALUE( value ) (value->NumberValue())
#define INT32_VALUE( value ) (value->Int32Value())
#define UINT32_VALUE( value ) (value->Uint32Value())
#define OBJECT_GET( map, key ) (map->Get (key))
#define OBJECT_SET( map, key, value ) (map->Set (key, value))
#define GET_FUNCTION( tpl ) (tpl->GetFunction())
#endif

#if NODE_MODULE_VERSION >= 48
#define GET_PRIVATE( obj, key ) ((obj->GetPrivate (isolate->GetCurrentContext(), Private::ForApi (isolate, NEW_STR (key)))).ToLocalChecked())
#else
#define GET_PRIVATE( obj, key ) (obj->GetHiddenValue (NEW_STR (key)))
#endif

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
inline T* UnwrapRobot (Local<Value> value)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Value needs to be at least an object
	if (!value->IsObject()) return nullptr;

	// Retrieve the local object
	auto obj = TO_OBJECT (value);

	// Convert and get hidden type
	auto type = GET_PRIVATE (obj, "_ROBOT_TYPE");

	// The value must contain a handle
	if (type.IsEmpty()) return nullptr;

	// Compare hidden type with class type
	if (INT32_VALUE (type) != T::ClassType)
		return nullptr;

	// Return the final unwrapped class
	return ObjectWrap::Unwrap<T> (obj);
}
