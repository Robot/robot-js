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
## Help                                                                       ##
##----------------------------------------------------------------------------##

.PHONY: help

help:
	@echo
	@echo "WELCOME TO ROBOT-JS"
	@echo "-------------------"
	@echo
	@echo "MAKE"
	@echo "  $$ make help  - Prints out these help instructions"
	@echo "  $$ make build - Builds robot-js as a node addon"
	@echo "  $$ make clean - Cleans and removes generated files"
	@echo
	@echo "MODES"
	@echo "  This project can be built using debug or release settings"
	@echo "  By default, this project is built using release settings"
	@echo "  $$ make mode=debug <cmd>  -or-  $$ make mode=release <cmd>"
	@echo
	@echo "NODE"
	@echo "  This project can be built for multiple versions of Node"
	@echo "  By default, this project is built using Node 0.12.13"
	@echo "  nodeVersion: represents the node version to compile with"
	@echo "  nodeModules: represents the NODE_MODULE_VERSION constant"
	@echo "  $$ make nodeVersion=4.4.0 nodeModules=46 <cmd>"
	@echo "  $$ make nodeVersion=5.9.0 nodeModules=47 <cmd>"
	@echo
	@echo "DOCS"
	@echo "  Visit http://getrobot.net for product documentation"
	@echo



##----------------------------------------------------------------------------##
## Build                                                                      ##
##----------------------------------------------------------------------------##

.PHONY: all _init build clean

all: build

_init:
ifeq ($(mode), debug)
	@echo "Building with debug settings"
else
	@echo "Building with release settings"
endif

build: _init
	cd Robot; make _build=robot --no-print-directory build
	cd Addon; make _build=robot --no-print-directory build

clean:
	cd Robot; make _build=robot --no-print-directory clean
	cd Addon; make _build=robot --no-print-directory clean
