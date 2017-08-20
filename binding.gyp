{
  "conditions": [
    ["OS=='linux'", {"variables": {"target_platform": "linux"}}],
    ["OS=='win'", {"variables": {"target_platform": "win32"}}],
    ["OS=='mac'", {"variables": {"target_platform": "darwin"}}],
  ],
  "variables": {
    "target_module_version": "<!(node <(module_root_dir)/abi.js <(node_root_dir))",
  },
  "target_defaults": {
    "configurations": {
      "Debug": {
        "defines": [
          "DEBUG",
        ],
      },
      "Release": {
        "defines": [
          "NDEBUG",
        ],
      },
    },
  },
  "targets": [
    {
      "target_name": "robot",
      "type": "static_library",
      "configurations": {
        "Debug": {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1,
            },
          },
        },
        "Release": {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1,
            },
          },
        },
      },
      "xcode_settings": {
        "MACOSX_DEPLOYMENT_TARGET": "10.7",
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "GCC_VERSION": "com.apple.compilers.llvm.clang.1_0",
        "CLANG_CXX_LIBRARY": "libc++",
        "CLANG_CXX_LANGUAGE_STANDARD": "c++11",
        "OTHER_CPLUSPLUSFLAGS": [
          "-x objective-c++",
          "-Wno-sign-compare",
          "-Wno-unused-variable",
          "-Wno-missing-field-initializers",
        ],
      },
      "cflags_cc!": [
        "-fno-exceptions",
      ],
      "cflags_cc": [
        "-std=c++11",
        "-fexceptions",
        "-Wno-strict-aliasing",
        "-Wno-unused-variable",
        "-Wno-missing-field-initializers",
      ],
      "defines!": [
        "_HAS_EXCEPTIONS=0",
        "V8_DEPRECATION_WARNINGS=1",
      ],
      "sources": [
        "Native/Robot/Bounds.cc",
        "Native/Robot/Clipboard.cc",
        "Native/Robot/Color.cc",
        "Native/Robot/Hash.cc",
        "Native/Robot/Image.cc",
        "Native/Robot/Keyboard.cc",
        "Native/Robot/Memory.cc",
        "Native/Robot/Module.cc",
        "Native/Robot/Mouse.cc",
        "Native/Robot/Point.cc",
        "Native/Robot/Process.cc",
        "Native/Robot/Range.cc",
        "Native/Robot/Screen.cc",
        "Native/Robot/Size.cc",
        "Native/Robot/Timer.cc",
        "Native/Robot/Window.cc",
      ],
    },
    {
      "target_name": "<(target_platform)-<(target_arch)-<(target_module_version)",
      "dependencies": ["robot"],
      "conditions": [
        ["OS=='linux'", {
          "libraries": [
            "-lrt",
            "-lX11",
            "-lXtst",
            "-lXinerama",
          ],
        }],
        ["OS=='win'", {
          "libraries": [
            "-lPsapi",
          ],
        }],
        ["OS=='mac'", {
          "libraries": [
            "-framework ApplicationServices",
            "-framework AppKit",
          ],
        }],
      ],
      "configurations": {
        "Debug": {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1,
            },
          },
        },
        "Release": {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1,
            },
          },
        },
      },
      "xcode_settings": {
        "MACOSX_DEPLOYMENT_TARGET": "10.7",
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "GCC_VERSION": "com.apple.compilers.llvm.clang.1_0",
        "CLANG_CXX_LIBRARY": "libc++",
        "CLANG_CXX_LANGUAGE_STANDARD": "c++11",
        "OTHER_CPLUSPLUSFLAGS": [
          "-x objective-c++",
          "-Wno-sign-compare",
          "-Wno-unused-variable",
          "-Wno-missing-field-initializers",
        ],
      },
      "cflags_cc!": [
        "-fno-exceptions",
      ],
      "cflags_cc": [
        "-std=c++11",
        "-fexceptions",
        "-Wno-strict-aliasing",
        "-Wno-unused-variable",
        "-Wno-missing-field-initializers",
      ],
      "defines!": [
        "_HAS_EXCEPTIONS=0",
        "V8_DEPRECATION_WARNINGS=1",
      ],
      "include_dirs": [
        "Native/Robot",
      ],
      "sources": [
        "Native/Addon/Clipboard.cc",
        "Native/Addon/Image.cc",
        "Native/Addon/Keyboard.cc",
        "Native/Addon/Memory.cc",
        "Native/Addon/Mouse.cc",
        "Native/Addon/Process.cc",
        "Native/Addon/Robot.cc",
        "Native/Addon/Screen.cc",
        "Native/Addon/Window.cc",
      ],
    },
    {
      "target_name": "copy_binary",
      "type": "none",
      "dependencies" : ["<(target_platform)-<(target_arch)-<(target_module_version)"],
      "copies": [
        {
          "files": ["<(PRODUCT_DIR)/<@(_dependencies).node"],
          "destination": "<(module_root_dir)/Library",
        },
      ],
    },
  ]
}