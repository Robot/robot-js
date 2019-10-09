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
	auto instance = NEW_INSTANCE (ctor, 0, NULL);
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
		 BOOLEAN_VALUE (args[0]) : false;
	auto stats = mMemory->GetStats (reset);

	auto res = NEW_STATS;
	OBJECT_SET (res, NEW_STR ("systemReads" ), NEW_INT (stats.SystemReads ));
	OBJECT_SET (res, NEW_STR ("cachedReads" ), NEW_INT (stats.CachedReads ));
	OBJECT_SET (res, NEW_STR ("systemWrites"), NEW_INT (stats.SystemWrites));
	OBJECT_SET (res, NEW_STR ("accessWrites"), NEW_INT (stats.AccessWrites));

	OBJECT_SET (res, NEW_STR ( "readErrors" ), NEW_INT (stats. ReadErrors ));
	OBJECT_SET (res, NEW_STR ("writeErrors" ), NEW_INT (stats.WriteErrors ));
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
		((uintptr) NUMBER_VALUE (args[0]));

	auto res = NEW_REGION;
	OBJECT_SET (res, NEW_STR ("valid"     ), NEW_BOOL (         region.Valid     ));
	OBJECT_SET (res, NEW_STR ("bound"     ), NEW_BOOL (         region.Bound     ));

	OBJECT_SET (res, NEW_STR ("start"     ), NEW_NUM  ((double) region.Start     ));
	OBJECT_SET (res, NEW_STR ("stop"      ), NEW_NUM  ((double) region.Stop      ));
	OBJECT_SET (res, NEW_STR ("size"      ), NEW_NUM  ((double) region.Size      ));

	OBJECT_SET (res, NEW_STR ("readable"  ), NEW_BOOL (         region.Readable  ));
	OBJECT_SET (res, NEW_STR ("writable"  ), NEW_BOOL (         region.Writable  ));
	OBJECT_SET (res, NEW_STR ("executable"), NEW_BOOL (         region.Executable));
	OBJECT_SET (res, NEW_STR ("access"    ), NEW_INT  (( int32) region.Access    ));

	OBJECT_SET (res, NEW_STR ("private"   ), NEW_BOOL (         region.Private   ));
	OBJECT_SET (res, NEW_STR ("guarded"   ), NEW_BOOL (         region.Guarded   ));
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
		start = (uintptr) NUMBER_VALUE (args[0]);
	if (args[1]->IsNumber())
		stop  = (uintptr) NUMBER_VALUE (args[1]);

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
		auto obj = NEW_INSTANCE (ctor, 0, NULL);

		OBJECT_SET (obj, NEW_STR ("valid"     ), NEW_BOOL (         current.Valid     ));
		OBJECT_SET (obj, NEW_STR ("bound"     ), NEW_BOOL (         current.Bound     ));

		OBJECT_SET (obj, NEW_STR ("start"     ), NEW_NUM  ((double) current.Start     ));
		OBJECT_SET (obj, NEW_STR ("stop"      ), NEW_NUM  ((double) current.Stop      ));
		OBJECT_SET (obj, NEW_STR ("size"      ), NEW_NUM  ((double) current.Size      ));

		OBJECT_SET (obj, NEW_STR ("readable"  ), NEW_BOOL (         current.Readable  ));
		OBJECT_SET (obj, NEW_STR ("writable"  ), NEW_BOOL (         current.Writable  ));
		OBJECT_SET (obj, NEW_STR ("executable"), NEW_BOOL (         current.Executable));
		OBJECT_SET (obj, NEW_STR ("access"    ), NEW_INT  (( int32) current.Access    ));

		OBJECT_SET (obj, NEW_STR ("private"   ), NEW_BOOL (         current.Private   ));
		OBJECT_SET (obj, NEW_STR ("guarded"   ), NEW_BOOL (         current.Guarded   ));
		OBJECT_SET (res, i, obj);
	}

	RETURN (res);
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::SetAccess (const FunctionCallbackInfo<Value>& args)
{
	ISOWRAP (Memory, args.Holder());

	// Synthesize a region
	Memory::Region region;
	region.Valid =           BOOLEAN_VALUE (args[0]);
	region.Bound =           BOOLEAN_VALUE (args[1]);
	region.Start = (uintptr) NUMBER_VALUE  (args[2]);
	region.Size  = (uintptr) NUMBER_VALUE  (args[3]);

	if (args[4]->IsBoolean() &&
		args[5]->IsBoolean() &&
		args[6]->IsBoolean())
	{
		RETURN_BOOL (mMemory->SetAccess
		(region, BOOLEAN_VALUE (args[4]),
				 BOOLEAN_VALUE (args[5]),
				 BOOLEAN_VALUE (args[6])));
	}

	if (args[4]->IsUint32())
	{
		RETURN_BOOL (mMemory->SetAccess
			(region, UINT32_VALUE (args[4])));
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
		start = (uintptr) NUMBER_VALUE (args[1]);
	if (args[2]->IsNumber())
		stop  = (uintptr) NUMBER_VALUE (args[2]);
	if (args[3]->IsNumber())
		limit = (uintptr) NUMBER_VALUE (args[3]);

	UTF8_VAR (jsPattern, args[0]);
	UTF8_VAR (jsFlags,   args[4]);

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
		OBJECT_SET (res, i, NEW_NUM ((double) list[i]));
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
		enlargeSize = (uintptr) NUMBER_VALUE (args[3]);
	if (args[4]->IsNumber())
		maximumSize = (uintptr) NUMBER_VALUE (args[4]);

	// Attempt to create memory cache
	RETURN_BOOL (mMemory->CreateCache
		((uintptr) NUMBER_VALUE (args[0]),
		 (uintptr) NUMBER_VALUE (args[1]),
		 (uintptr) NUMBER_VALUE (args[2]),
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

	auto address = (uintptr) NUMBER_VALUE (args[0]);
	auto length  = (uintptr) NUMBER_VALUE (args[2]);
	auto flags   = Memory::Default;

	if (args[3]->IsUint32())
		flags = (Memory::Flags) UINT32_VALUE (args[3]);

	auto buffer = TO_OBJECT (args[1]);
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

	auto address = (uintptr) NUMBER_VALUE (args[0]);
	auto length  = (uintptr) NUMBER_VALUE (args[2]);
	auto flags   = Memory::Default;

	if (args[3]->IsUint32())
		flags = (Memory::Flags) UINT32_VALUE (args[3]);

	auto buffer = TO_OBJECT (args[1]);
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

	auto address = (uintptr ) NUMBER_VALUE (args[0]);
	auto type    = (DataType) UINT32_VALUE (args[1]);
	auto length  = (uint32  ) UINT32_VALUE (args[2]);
	auto count   = (uint32  ) 1;
	auto stride  = (uint32  ) 0;

	if (args[3]->IsUint32())
		count  = (uint32) UINT32_VALUE (args[3]);
	if (args[4]->IsUint32())
		stride = (uint32) UINT32_VALUE (args[4]);

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
			case TypeInt8  : OBJECT_SET (res, i, NEW_INT  ((int32 ) *(int8  *) offset)); continue;
			case TypeInt16 : OBJECT_SET (res, i, NEW_INT  ((int32 ) *(int16 *) offset)); continue;
			case TypeInt32 : OBJECT_SET (res, i, NEW_INT  ((int32 ) *(int32 *) offset)); continue;
			case TypeInt64 : OBJECT_SET (res, i, NEW_NUM  ((double) *(int64 *) offset)); continue;
			case TypeReal32: OBJECT_SET (res, i, NEW_NUM  ((double) *(real32*) offset)); continue;
			case TypeReal64: OBJECT_SET (res, i, NEW_NUM  ((double) *(real64*) offset)); continue;
			case TypeBool  : OBJECT_SET (res, i, NEW_BOOL ((bool  ) *(bool  *) offset)); continue;
			default: assert (false);
		}

		OBJECT_SET (res, i, NEW_STR (std::string (offset, length).data()));
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

	auto address = (uintptr ) NUMBER_VALUE (args[0]);
	auto type    = (DataType) UINT32_VALUE (args[2]);
	auto length  = (uint32  ) UINT32_VALUE (args[3]);

	if (type == TypeString)
	{
		// Check for valid args
		if (!args[1]->IsString())
			THROW (Type, "Invalid arguments");

		UTF8_VAR (value, args[1]);
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
			case TypeInt8  : *(int8  *) &data = (int8  ) INT32_VALUE   (args[1]); break;
			case TypeInt16 : *(int16 *) &data = (int16 ) INT32_VALUE   (args[1]); break;
			case TypeInt32 : *(int32 *) &data = (int32 ) INT32_VALUE   (args[1]); break;
			case TypeInt64 : *(int64 *) &data = (int64 ) NUMBER_VALUE  (args[1]); break;
			case TypeReal32: *(real32*) &data = (real32) NUMBER_VALUE  (args[1]); break;
			case TypeReal64: *(real64*) &data = (real64) NUMBER_VALUE  (args[1]); break;
			case TypeBool  : *(bool  *) &data = (bool  ) BOOLEAN_VALUE (args[1]); break;
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
		OBJECT_SET (args.This(), NEW_STR ("_ptrSize"   ), NEW_NUM ((double) m->GetPtrSize   ()));
		OBJECT_SET (args.This(), NEW_STR ("_minAddress"), NEW_NUM ((double) m->GetMinAddress()));
		OBJECT_SET (args.This(), NEW_STR ("_maxAddress"), NEW_NUM ((double) m->GetMaxAddress()));
		OBJECT_SET (args.This(), NEW_STR ("_pageSize"  ), NEW_NUM ((double) m->GetPageSize  ()));

		REGISTER_ROBOT_TYPE;
		RETURN (args.This());
	}

	else
	{
		auto ctor = NEW_CTOR (Memory);
		// Return as a new instance
		RETURN (NEW_INSTANCE (ctor, 1,
			   (_jsArgs[0] = args[0], _jsArgs)));
	}
}

////////////////////////////////////////////////////////////////////////////////

void MemoryWrap::Initialize (Local<Object> exports)
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
	constructor.Reset (isolate, GET_FUNCTION (tpl));
	OBJECT_SET (exports, NEW_STR ("Memory"), GET_FUNCTION (tpl));
}
