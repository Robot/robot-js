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

ifeq ($(UNAME), Darwin)
	CXX    = clang++
	OUTPUT = ../Binaries/Mac/
else
	CXX    = g++
	OUTPUT = ../Binaries/Linux/
endif

ifeq ($(mode), debug)
	LIBRARY  = $(OUTPUT)libRobotd.a
	OBJECT   = $(OUTPUT)Robotd/
	CXXFLAGS = -std=c++11 -Wall -pedantic-errors -fno-rtti -O0 -g -DDEBUG

	ifeq ($(UNAME), Darwin)
		CXXFLAGS += -stdlib=libc++ -x objective-c++
	else
		CXXFLAGS += -fPIC
	endif

else
	LIBRARY  = $(OUTPUT)libRobot.a
	OBJECT   = $(OUTPUT)Robot/
	CXXFLAGS = -std=c++11 -Wall -pedantic-errors -fno-rtti -O3 -DNDEBUG

	ifeq ($(UNAME), Darwin)
		CXXFLAGS += -stdlib=libc++ -x objective-c++
	else
		CXXFLAGS += -fPIC -s
	endif

endif

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
	$(CXX) $(CXXFLAGS) -c $< -o $@

build: _init $(OBJECTS)
	ar rcs $(LIBRARY) $(OBJECTS)

clean:
	rm -rf $(OUTPUT)
