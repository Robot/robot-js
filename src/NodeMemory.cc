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

#include "NodeMemory.h"
#include "NodeProcess.h"
DEFINE_ROBOT_TYPE (Memory);



//----------------------------------------------------------------------------//
// Locals                                                                     //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

enum DataType
{
	TypeInt8	= 1,
	TypeInt16	= 2,
	TypeInt32	= 3,
	TypeInt64	= 4,
	TypeReal32	= 5,
	TypeReal64	= 6,
	TypeBool	= 7,
	TypeString	= 8,
};



//----------------------------------------------------------------------------//
// Functions                                                       MemoryWrap //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::IsValid (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());
	RETURN_BOOL (mMemory->IsValid());
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::GetProcess (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());
	auto ctor = NEW_CTOR (Process);

	// Create a new instance of wrapper
	auto instance = ctor->NewInstance();
	UNWRAP (Process, instance);

	auto process = mMemory->GetProcess();
	// Make wrapper use a new process
	mProcessWrap->mProcess = process;
	RETURN (instance);
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::GetStats (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Check for valid arguments
	if (!args[0]->IsBoolean() &&
		!args[0]->IsUndefined())
		THROW (Type, "Invalid arguments");

	// Retrieve memory statistics value
	bool reset = args[0]->IsBoolean() ?
		 args[0]->BooleanValue() : false;
	auto stats = mMemory->GetStats (reset);

	auto res = NEW_STATS;
	res->Set (NEW_STR ("systemReads" ), NEW_INT (stats.SystemReads ));
	res->Set (NEW_STR ("cachedReads" ), NEW_INT (stats.CachedReads ));
	res->Set (NEW_STR ("systemWrites"), NEW_INT (stats.SystemWrites));
	res->Set (NEW_STR ("accessWrites"), NEW_INT (stats.AccessWrites));

	res->Set (NEW_STR ( "readErrors" ), NEW_INT (stats. ReadErrors ));
	res->Set (NEW_STR ("writeErrors" ), NEW_INT (stats.WriteErrors ));
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::GetRegion (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Check for valid args
	if (!args[0]->IsNumber())
		THROW (Type, "Invalid arguments");

	// Get memory region information
	auto region = mMemory->GetRegion
		((uintptr) args[0]->NumberValue());

	auto res = NEW_REGION;
	res->Set (NEW_STR ("valid"     ), NEW_BOOL (         region.Valid     ));
	res->Set (NEW_STR ("bound"     ), NEW_BOOL (         region.Bound     ));

	res->Set (NEW_STR ("start"     ), NEW_NUM  ((double) region.Start     ));
	res->Set (NEW_STR ("stop"      ), NEW_NUM  ((double) region.Stop      ));
	res->Set (NEW_STR ("size"      ), NEW_NUM  ((double) region.Size      ));

	res->Set (NEW_STR ("readable"  ), NEW_BOOL (         region.Readable  ));
	res->Set (NEW_STR ("writable"  ), NEW_BOOL (         region.Writable  ));
	res->Set (NEW_STR ("executable"), NEW_BOOL (         region.Executable));
	res->Set (NEW_STR ("access"    ), NEW_INT  (( int32) region.Access    ));

	res->Set (NEW_STR ("private"   ), NEW_BOOL (         region.Private   ));
	res->Set (NEW_STR ("guarded"   ), NEW_BOOL (         region.Guarded   ));
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::GetRegions (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());
	auto ctor = Local<Function>::
		 New (isolate, JsRegion);

	// Check for valid arguments
	if ((!args[0]->IsNumber() &&
		 !args[0]->IsUndefined()) ||
		(!args[1]->IsNumber() &&
		 !args[1]->IsUndefined()))
		THROW (Type, "Invalid arguments");

	auto start = (uintptr)  0;
	auto stop  = (uintptr) -1;

	if (args[0]->IsNumber())
		start = (uintptr) args[0]->NumberValue();
	if (args[1]->IsNumber())
		stop  = (uintptr) args[1]->NumberValue();

	// Get a region list with the specified range
	auto list = mMemory->GetRegions (start, stop);

	int length = (int) list.size();
	auto res = NEW_ARR (length);
	// Loop array and add to result
	for (int i = 0; i < length; ++i)
	{
		// Avoid always getting value
		const auto& current = list[i];

		// Create a new region instance
		auto obj = ctor->NewInstance();

		obj->Set (NEW_STR ("valid"     ), NEW_BOOL (         current.Valid     ));
		obj->Set (NEW_STR ("bound"     ), NEW_BOOL (         current.Bound     ));

		obj->Set (NEW_STR ("start"     ), NEW_NUM  ((double) current.Start     ));
		obj->Set (NEW_STR ("stop"      ), NEW_NUM  ((double) current.Stop      ));
		obj->Set (NEW_STR ("size"      ), NEW_NUM  ((double) current.Size      ));

		obj->Set (NEW_STR ("readable"  ), NEW_BOOL (         current.Readable  ));
		obj->Set (NEW_STR ("writable"  ), NEW_BOOL (         current.Writable  ));
		obj->Set (NEW_STR ("executable"), NEW_BOOL (         current.Executable));
		obj->Set (NEW_STR ("access"    ), NEW_INT  (( int32) current.Access    ));

		obj->Set (NEW_STR ("private"   ), NEW_BOOL (         current.Private   ));
		obj->Set (NEW_STR ("guarded"   ), NEW_BOOL (         current.Guarded   ));
		res->Set (i, obj);
	}

	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::SetAccess (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Synthesize a region
	Memory::Region region;
	region.Valid =           args[0]->BooleanValue();
	region.Bound =           args[1]->BooleanValue();
	region.Start = (uintptr) args[2]-> NumberValue();
	region.Size  = (uintptr) args[3]-> NumberValue();

	if (args[4]->IsBoolean() &&
		args[5]->IsBoolean() &&
		args[6]->IsBoolean())
	{
		RETURN_BOOL (mMemory->SetAccess
		(region, args[4]->BooleanValue(),
				 args[5]->BooleanValue(),
				 args[6]->BooleanValue()));
	}

	if (args[4]->IsUint32())
	{
		RETURN_BOOL (mMemory->SetAccess
			(region, args[4]->Uint32Value()));
	}

	THROW (Type, "Invalid arguments");
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::Find (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Check for valid arguments
	if (!args[0]->IsString() ||
	   (!args[1]->IsNumber() &&
		!args[1]->IsUndefined()) ||
	   (!args[2]->IsNumber() &&
		!args[2]->IsUndefined()) ||
	   (!args[3]->IsNumber() &&
		!args[3]->IsUndefined()) ||
	   (!args[4]->IsString() &&
		!args[4]->IsUndefined()))
		THROW (Type, "Invalid arguments");

	auto start = (uintptr)  0;
	auto stop  = (uintptr) -1;
	auto limit = (uintptr)  0;

	if (args[1]->IsNumber())
		start = (uintptr) args[1]->NumberValue();
	if (args[2]->IsNumber())
		stop  = (uintptr) args[2]->NumberValue();
	if (args[3]->IsNumber())
		limit = (uintptr) args[3]->NumberValue();

	String::Utf8Value jsPattern (args[0]);
	String::Utf8Value jsFlags   (args[4]);

	auto pattern = *jsPattern ? *jsPattern : "";
	auto flags   = *jsFlags   ? *jsFlags   : "";
	if (args[4]->IsUndefined()) flags = nullptr;

	// Commence native memory scanning
	auto list = mMemory->Find (pattern,
			start, stop, limit, flags);

	int length = (int) list.size();
	auto res = NEW_ARR (length);
	// Loop array and add to result
	for (int i = 0; i < length; ++i)
	{
		// The result is simply a list of numbers
		res->Set (i, NEW_NUM ((double) list[i]));
	}

	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::CreateCache (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Check for valid arguments
	if (!args[0]->IsNumber() ||
		!args[1]->IsNumber() ||
		!args[2]->IsNumber() ||
	   (!args[3]->IsNumber() &&
		!args[3]->IsUndefined()) ||
	   (!args[4]->IsNumber() &&
		!args[4]->IsUndefined()))
		THROW (Type, "Invalid arguments");

	auto enlargeSize = (uintptr) 0;
	auto maximumSize = (uintptr) 0;

	if (args[3]->IsNumber())
		enlargeSize = (uintptr) args[3]->NumberValue();
	if (args[4]->IsNumber())
		maximumSize = (uintptr) args[4]->NumberValue();

	// Attempt to create memory cache
	RETURN_BOOL (mMemory->CreateCache
		((uintptr) args[0]->NumberValue(),
		 (uintptr) args[1]->NumberValue(),
		 (uintptr) args[2]->NumberValue(),
		 enlargeSize, maximumSize));
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::ClearCache (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());
	mMemory->ClearCache();
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::DeleteCache (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());
	mMemory->DeleteCache();
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::IsCaching (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());
	RETURN_BOOL (mMemory->IsCaching());
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::GetCacheSize (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());
	RETURN_NUM ((double) mMemory->GetCacheSize());
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::ReadData (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Check for valid arguments
	if (!args[0]->IsNumber() ||
		!args[2]->IsNumber() ||
	   (!args[3]->IsUint32() &&
		!args[3]->IsUndefined()))
		THROW (Type, "Invalid arguments");

	// DataOutput must be a node buffer
	if (!Buffer::HasInstance (args[1]))
		THROW (Type, "Invalid arguments");

	auto address = (uintptr) args[0]->NumberValue();
	auto length  = (uintptr) args[2]->NumberValue();
	auto flags   = Memory::Default;

	if (args[3]->IsUint32())
		flags = (Memory::Flags) args[3]->Uint32Value();

	auto buffer = args[1]->ToObject();
	// Get data pointers from node buffer
	auto data = Buffer::Data   (buffer);
	auto size = Buffer::Length (buffer);

	if (size < length)
		THROW (Range, "Buffer is too small");

	// Do memory reading and return result
	RETURN_NUM ((double) mMemory->ReadData
			(address, data, length, flags));
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::WriteData (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Check for valid arguments
	if (!args[0]->IsNumber() ||
		!args[2]->IsNumber() ||
	   (!args[3]->IsUint32() &&
		!args[3]->IsUndefined()))
		THROW (Type, "Invalid arguments");

	// DataInput must be a node buffer
	if (!Buffer::HasInstance (args[1]))
		THROW (Type, "Invalid arguments");

	auto address = (uintptr) args[0]->NumberValue();
	auto length  = (uintptr) args[2]->NumberValue();
	auto flags   = Memory::Default;

	if (args[3]->IsUint32())
		flags = (Memory::Flags) args[3]->Uint32Value();

	auto buffer = args[1]->ToObject();
	// Get data pointers from node buffer
	auto data = Buffer::Data   (buffer);
	auto size = Buffer::Length (buffer);

	if (size < length)
		THROW (Range, "Buffer is too small");

	// Do memory reading and return result
	RETURN_NUM ((double) mMemory->WriteData
			(address, data, length, flags));
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::ReadType (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Check for valid arguments
	if (!args[0]->IsNumber() ||
		!args[2]->IsUint32() ||
	   (!args[3]->IsUint32() &&
		!args[3]->IsUndefined()) ||
	   (!args[4]->IsUint32() &&
		!args[4]->IsUndefined()))
		THROW (Type, "Invalid arguments");

	auto address = (uintptr ) args[0]->NumberValue();
	auto type    = (DataType) args[1]->Uint32Value();
	auto length  = (uint32  ) args[2]->Uint32Value();
	auto count   = (uint32  ) 1;
	auto stride  = (uint32  ) 0;

	if (args[3]->IsUint32())
		count  = (uint32) args[3]->Uint32Value();
	if (args[4]->IsUint32())
		stride = (uint32) args[4]->Uint32Value();

	// Return null if there is nothing to read
	if (count == 0 || length == 0) RETURN_NULL;

	if (count == 1)
	{
		if (type == TypeString)
		{
			auto data = new char[length];
			if (mMemory->ReadData (address, data, length) != length)
				{ delete[] data; RETURN_NULL; }

			auto res = NEW_STR (std::string (data, length).data());
			delete[] data; RETURN (res);
		}

		else
		{
			int64 data;
			if (mMemory->ReadData (address, &data, length) != length)
				RETURN_NULL;

			switch (type)
			{
				case TypeInt8  : RETURN_INT  ((int32 ) *(int8  *) &data);
				case TypeInt16 : RETURN_INT  ((int32 ) *(int16 *) &data);
				case TypeInt32 : RETURN_INT  ((int32 ) *(int32 *) &data);
				case TypeInt64 : RETURN_NUM  ((double) *(int64 *) &data);
				case TypeReal32: RETURN_NUM  ((double) *(real32*) &data);
				case TypeReal64: RETURN_NUM  ((double) *(real64*) &data);
				case TypeBool  : RETURN_BOOL ((bool  ) *(bool  *) &data);
				default: assert (false);
			}
		}
	}

	// Set a stride if using default
	if (stride == 0) stride = length;

	// Check the stride
	if (stride < length)
		THROW (Range, "Stride is too small");

	auto size   = count  * stride
				+ length - stride;
	auto data   = new char[size];
	auto offset = data;

	// Return undefined if could not read memory
	if (mMemory->ReadData (address, data, size)
		!= size) { delete[] data; RETURN_NULL; }

	auto res = NEW_ARR (count);
	for (uint32 i = 0; i < count; ++i, offset += stride)
	{
		switch (type)
		{
			case TypeInt8  : res->Set (i, NEW_INT  ((int32 ) *(int8  *) offset)); continue;
			case TypeInt16 : res->Set (i, NEW_INT  ((int32 ) *(int16 *) offset)); continue;
			case TypeInt32 : res->Set (i, NEW_INT  ((int32 ) *(int32 *) offset)); continue;
			case TypeInt64 : res->Set (i, NEW_NUM  ((double) *(int64 *) offset)); continue;
			case TypeReal32: res->Set (i, NEW_NUM  ((double) *(real32*) offset)); continue;
			case TypeReal64: res->Set (i, NEW_NUM  ((double) *(real64*) offset)); continue;
			case TypeBool  : res->Set (i, NEW_BOOL ((bool  ) *(bool  *) offset)); continue;
			default: assert (false);
		}

		res->Set (i, NEW_STR (std::string (offset, length).data()));
	}

	delete[] data;
	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::WriteType (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Check for valid arguments
	if (!args[0]->IsNumber() ||
	   (!args[3]->IsUint32() &&
		!args[3]->IsUndefined()))
		THROW (Type, "Invalid arguments");

	auto address = (uintptr ) args[0]->NumberValue();
	auto type    = (DataType) args[2]->Uint32Value();
	auto length  = (uint32  ) args[3]->Uint32Value();

	if (type == TypeString)
	{
		// Check for valid args
		if (!args[1]->IsString())
			THROW (Type, "Invalid arguments");

		String::Utf8Value value (args[1]);
		auto data = *value ? *value : "";

		// Set the required length
		if (args[3]->IsUndefined())
			length = value.length() + 1;

		if (length == 0) RETURN_TRUE;
		// Check for possible out of bounds error
		if (length > (uint32) value.length() + 1)
			THROW (Range, "Length is too large");

		RETURN_BOOL (mMemory->WriteData
			(address, data, length) == length);
	}

	else
	{
		// Check for valid args
		if ((type == TypeBool &&
			!args[1]->IsBoolean()) ||
			(type != TypeBool &&
			!args[1]->IsNumber ()))
			THROW (Type, "Invalid arguments");

		int64 data=0;
		switch (type)
		{
			case TypeInt8  : *(int8  *) &data = (int8  ) args[1]->  Int32Value(); break;
			case TypeInt16 : *(int16 *) &data = (int16 ) args[1]->  Int32Value(); break;
			case TypeInt32 : *(int32 *) &data = (int32 ) args[1]->  Int32Value(); break;
			case TypeInt64 : *(int64 *) &data = (int64 ) args[1]-> NumberValue(); break;
			case TypeReal32: *(real32*) &data = (real32) args[1]-> NumberValue(); break;
			case TypeReal64: *(real64*) &data = (real64) args[1]-> NumberValue(); break;
			case TypeBool  : *(bool  *) &data = (bool  ) args[1]->BooleanValue(); break;
			default: assert (false);
		}

		RETURN_BOOL (mMemory->WriteData (address, &data, length) == length);
	}
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::New (const FunctionCallbackInfo<Value>& args)
{
	ISOLATE;
	// Whether called using new
	if (args.IsConstructCall())
	{
		ProcessWrap* proc = nullptr;
		if (!args[0]->IsUndefined())
		{
			// Attempt to unwrap into a native process
			proc = UnwrapRobot<ProcessWrap> (args[0]);
			if (!proc) THROW (Type, "Invalid arguments");
		}

		auto memory = new MemoryWrap();
		if (proc) memory->mMemory =
			Memory (proc->mProcess);

		memory->Wrap (args.This());
		auto m = &memory->mMemory;
		args.This()->Set (NEW_STR ("_ptrSize"   ), NEW_NUM ((double) m->GetPtrSize   ()));
		args.This()->Set (NEW_STR ("_minAddress"), NEW_NUM ((double) m->GetMinAddress()));
		args.This()->Set (NEW_STR ("_maxAddress"), NEW_NUM ((double) m->GetMaxAddress()));
		args.This()->Set (NEW_STR ("_pageSize"  ), NEW_NUM ((double) m->GetPageSize  ()));

		REGISTER_ROBOT_TYPE;
		RETURN (args.This());
	}

	else
	{
		auto ctor = NEW_CTOR (Memory);
		// Return as a new instance
		RETURN (ctor->NewInstance (1,
			   (_jsArgs[0] = args[0], _jsArgs)));
	}
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::Initialize (Handle<Object> exports)
{
	// Get the current isolated V8 instance
	Isolate* isolate = Isolate::GetCurrent();

	// Associate the new function with new template
	auto tpl = FunctionTemplate::New (isolate, New);
	tpl->InstanceTemplate()->SetInternalFieldCount (1);
	tpl->SetClassName (NEW_STR ("Memory"));

	NODE_SET_PROTOTYPE_METHOD (tpl,  "isValid",       IsValid      );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getProcess",    GetProcess   );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getStats",      GetStats     );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "getRegion",     GetRegion    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getRegions",    GetRegions   );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_setAccess",     SetAccess    );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "find",          Find         );

	NODE_SET_PROTOTYPE_METHOD (tpl,  "createCache",   CreateCache  );
	NODE_SET_PROTOTYPE_METHOD (tpl,   "clearCache",    ClearCache  );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "deleteCache",   DeleteCache  );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "isCaching",     IsCaching    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "getCacheSize",  GetCacheSize );

	NODE_SET_PROTOTYPE_METHOD (tpl,   "readData",      ReadData    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "writeData",     WriteData    );
	NODE_SET_PROTOTYPE_METHOD (tpl,  "_readType",      ReadType    );
	NODE_SET_PROTOTYPE_METHOD (tpl, "_writeType",     WriteType    );

	tpl->Set (NEW_STR ("_TYPE_INT8"  ), NEW_INT (TypeInt8  ));
	tpl->Set (NEW_STR ("_TYPE_INT16" ), NEW_INT (TypeInt16 ));
	tpl->Set (NEW_STR ("_TYPE_INT32" ), NEW_INT (TypeInt32 ));
	tpl->Set (NEW_STR ("_TYPE_INT64" ), NEW_INT (TypeInt64 ));
	tpl->Set (NEW_STR ("_TYPE_REAL32"), NEW_INT (TypeReal32));
	tpl->Set (NEW_STR ("_TYPE_REAL64"), NEW_INT (TypeReal64));
	tpl->Set (NEW_STR ("_TYPE_BOOL"  ), NEW_INT (TypeBool  ));
	tpl->Set (NEW_STR ("_TYPE_STRING"), NEW_INT (TypeString));

	tpl->Set (NEW_STR ("DEFAULT"     ), NEW_INT (Memory::Default   ));
	tpl->Set (NEW_STR ("SKIP_ERRORS" ), NEW_INT (Memory::SkipErrors));
	tpl->Set (NEW_STR ("AUTO_ACCESS" ), NEW_INT (Memory::AutoAccess));

	// Assign function template to our class creator
	constructor.Reset (isolate, tpl->GetFunction());
	exports->Set
		   (NEW_STR ("Memory"), tpl->GetFunction());
}
