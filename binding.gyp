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
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1,
        },
      },
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "OTHER_CPLUSPLUSFLAGS": [
          "-x objective-c++",
          "-Wno-sign-compare",
          "-Wno-unused-variable",
          "-Wno-missing-field-initializers",
        ],
      },
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
      ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1,
        },
      },
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "OTHER_CPLUSPLUSFLAGS": [
          "-x objective-c++",
          "-Wno-sign-compare",
          "-Wno-unused-variable",
          "-Wno-missing-field-initializers",
        ],
      },
      "defines!": [
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
