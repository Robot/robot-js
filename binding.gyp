{
  "conditions": [
    ["OS=='linux'", {"variables": {"target_platform": "linux"}}],
    ["OS=='win'", {"variables": {"target_platform": "win32"}}],
    ["OS=='mac'", {"variables": {"target_platform": "darwin"}}]
  ],
  "variables": {
    # is there a better way do find the target ABI from node-gyp?
    "target_module_version": "<!(node -e 'console.log(fs.readFileSync(\"<(node_root_dir)/src/node_version.h\",\"utf-8\").match(/\s+NODE_MODULE_VERSION\s+(\d+)/)[1])')",
  },
  "targets": [
    {
      "target_name": "<(target_platform)-<(target_arch)-<(target_module_version)",
      "conditions": [
        ["OS=='linux'", {
          "libraries": [
            "-lrt",
            "-lX11",
            "-lXtst",
            "-lXinerama"
          ],
        }],
      ],
      "configurations": {
        "Debug": {
          "defines": [
            "DEBUG"
          ]
        },
        "Release": {
          "defines": [
            "NDEBUG"
          ]
        }
      },
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "OTHER_CPLUSPLUSFLAGS": [
          "-x objective-c++",
          "-Wno-sign-compare",
          "-Wno-unused-variable",
          "-Wno-deprecated-declarations",
          "-Wno-missing-field-initializers"
        ]
      },
      "include_dirs": [
        "Native/Robot",
        "Native/Addon"
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
        "Native/Addon/Clipboard.cc",
        "Native/Addon/Image.cc",
        "Native/Addon/Keyboard.cc",
        "Native/Addon/Memory.cc",
        "Native/Addon/Mouse.cc",
        "Native/Addon/Process.cc",
        "Native/Addon/Robot.cc",
        "Native/Addon/Screen.cc",
        "Native/Addon/Window.cc"
      ],
    },
    {
      "target_name": "copy_binary",
      "type": "none",
      "dependencies" : ["<(target_platform)-<(target_arch)-<(target_module_version)"],
      "copies": [
        {
          "files": ["<(PRODUCT_DIR)/<@(_dependencies).node"],
          "destination": "<(module_root_dir)/Library"
        }
      ]
    }
  ]
}
