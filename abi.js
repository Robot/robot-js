/*
 * Discover the node ABI version by peeking in the headers.
 * Expects the header include path as an agument.
 * Works with both standard node and iojs variants.
 */

const fs = require('fs');
const path = require('path');

const paths = [
  path.join(process.argv[2], 'src', 'node_version.h'),
  path.join(process.argv[2], 'include', 'node', 'node_version.h')
];

var contents;
for(p of paths) {
  try {
    contents = fs.readFileSync(p);
    break;
  } catch(e) {}
}

if(contents == null) {
  console.warn('Unable to find node_version.h');
} else {
  console.log(
    contents.toString().match(
      /\s+NODE_MODULE_VERSION\s+(\d+)/
    )[1]
  );
}
