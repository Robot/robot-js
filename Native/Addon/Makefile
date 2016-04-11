################################################################################
## -------------------------------------------------------------------------- ##
##                                                                            ##
##                       (C) 2010-2016 Robot Developers                       ##
##                       See LICENSE for licensing info                       ##
##                                                                            ##
## -------------------------------------------------------------------------- ##
################################################################################

makepp_no_builtin = 1

##----------------------------------------------------------------------------##
## Variables                                                                  ##
##----------------------------------------------------------------------------##

UNAME = $(shell uname -s)
LBITS = $(shell getconf LONG_BIT)

ifdef nodeVersion
	NODE_VERSION = $(nodeVersion)
else
	NODE_VERSION = 0.12.13
endif
ifdef nodeModules
	NODE_MODULES = $(nodeModules)
else
	NODE_MODULES = 14
endif

ifeq ($(UNAME), Darwin)
	CXX    = clang++
	OUTPUT = ../Binaries/Mac/
	BINARY = $(OUTPUT)darwin-x64-$(NODE_MODULES).node

	INCLUDES = \
		-I/Users/$(USER)/.node-gyp/$(NODE_VERSION)/include/node

else
	CXX    = g++
	OUTPUT = ../Binaries/Linux/

	ifeq ($(LBITS), 64)
		BINARY = $(OUTPUT)linux-x64-$(NODE_MODULES).node
	else
		BINARY = $(OUTPUT)linux-ia32-$(NODE_MODULES).node
	endif

	INCLUDES = \
		-I/home/$(USER)/.node-gyp/$(NODE_VERSION)/include/node

endif

ifeq ($(mode), debug)
	OBJECT   = $(OUTPUT)Addond/
	CXXFLAGS = -std=c++11 -fno-rtti -O0 -g -DDEBUG
	 LDFLAGS = -L$(OUTPUT) -lRobotd

	ifeq ($(UNAME), Darwin)
		CXXFLAGS += -stdlib=libc++
		 LDFLAGS += -framework ApplicationServices -framework AppKit \
					-bundle -undefined dynamic_lookup -Wl,-search_paths_first
	else
		CXXFLAGS += -pthread -fPIC
		 LDFLAGS += -lrt -lX11 -lXtst -lXinerama -shared
	endif

else
	OBJECT   = $(OUTPUT)Addon/
	CXXFLAGS = -std=c++11 -fno-rtti -O3 -DNDEBUG
	 LDFLAGS = -L$(OUTPUT) -lRobot

	ifeq ($(UNAME), Darwin)
		CXXFLAGS += -stdlib=libc++
		 LDFLAGS += -framework ApplicationServices -framework AppKit \
					-bundle -undefined dynamic_lookup -Wl,-search_paths_first
	else
		CXXFLAGS += -pthread -fPIC -s
		 LDFLAGS += -lrt -lX11 -lXtst -lXinerama -shared
	endif

endif

CXXFLAGS += -DBUILDING_V8_SHARED      \
			-DBUILDING_UV_SHARED      \
			-DBUILDING_NODE_EXTENSION \
			-DBUILDING_ROBOT_SHARED

SOURCES = $(shell find ./ -name "*.cc")
HEADERS = $(shell find ./ -name "*.h" )
OBJECTS = $(patsubst %.cc, $(OBJECT)%.o, $(SOURCES))



##----------------------------------------------------------------------------##
## Build                                                                      ##
##----------------------------------------------------------------------------##

.PHONY: all _init build clean

all:
	@echo "Please run make from the root directory"
	exit 1

_init:
ifneq ($(_build), robot)
	@echo "Please run make from the root directory"
	exit 1
endif
	mkdir -p $(OUTPUT) $(OBJECT)

$(OBJECT)%.o: $(SRC)%.cc
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

build: _init $(OBJECTS)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $(BINARY) $(OBJECTS) $(LDFLAGS)
	cp -f $(BINARY) ../../Library/

clean:
	rm -rf $(OUTPUT)
