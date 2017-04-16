////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                       (C) 2010-2017 Robot Developers                       //
//                       See LICENSE for licensing info                       //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

"use strict";

//----------------------------------------------------------------------------//
// Install                                                                    //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

var mFS   = require ("fs"  );
var mHTTP = require ("http");
var mCrypto = require ("crypto");

////////////////////////////////////////////////////////////////////////////////

var SOURCE = "http://node.getrobot.net/addon/" + process.env.npm_package_version + "/" +
	process.platform   + "-" +
	process.arch       + "-" +
	process.versions.modules +
	".node";

var TARGET = "./Library/" +
	process.platform   + "-" +
	process.arch       + "-" +
	process.versions.modules +
	".node";

var PUBKEY = "-----BEGIN PUBLIC KEY-----\n" +
	"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuS2TjQltjcSDyQ3YSKvn\n" +
	"IVhNGmPW3VA25m46RuN9FG0RgQx1a/YTh9c/RJfHv/YdESjnlbjwq+L6buuQ/rz/\n" +
	"wQEQc1KJEIEXp+WR2bVE3NuS+mCKhpOCMvbB3GrIrbZVScI+/IWxbW2gytxNAmbY\n" +
	"HLqWRzGjLaKHflTI4N2RZ85p6EDXN7QNAy1xbwIlmLxdepUMMpgPYryss3agFQiX\n" +
	"PlO89hTGaZ8k+rqb3VvtZP0iexGjx1GxIeAvP5pw6sBR03qlZq9ROk70Fpuo/7GV\n" +
	"QgM2kYrRNTEEeJoVCu4J4FumVyyG5PJPBhLyXbL5sYeuoBXJyAT/3Ora9f+WEXbw\n" +
	"TQIDAQAB\n" +
	"-----END PUBLIC KEY-----";

var SIG = SOURCE + '.sha256';

////////////////////////////////////////////////////////////////////////////////

function failure (reason)
{
	console.error
		("ERROR: robot-js binaries failed to install. " +
		 "You will need to install them manually, see " +
		 "http://getrobot.net/docs/node.html for more " +
		 "info. Reason: " + reason + "\n");
}

function verifyFailure (reason)
{
	console.error
		("ERROR: robot-js binaries could not be verified. " +
		 "Reason: " + reason + "\n" +
		 "This could be an indication of a MitM attack. " +
		 "If you want to continue anyway, you can use the " +
		 "following command to disable verification:\n" +
		 "npm config set robot-js:verify false");
}

function getStreamOrFail(url, streamCallback, errCallback) {
	// Attempt to get url
	var req = mHTTP.get (url);

	// Whenever a response is received
	req.on ("response", function(res)
	{
		// Check if response is OK
		if (res.statusCode === 200)
		{
			streamCallback (res);
		}
		
		// Some unexpected response
		else errCallback ("bad response" +
			" (" + res.statusCode +
			") " + res.statusMessage);
	});
	
	// Whenever an error is thrown
	req.on ("error", function (err)
	{
		errCallback (err.message);
	});
}

////////////////////////////////////////////////////////////////////////////////


// Attempt to download binary
getStreamOrFail (SOURCE, function (res)
{
	// Open a writable stream to binary file
	var file = mFS.createWriteStream (TARGET);

	// Save response
	res.pipe (file);

	// Whenever an error is thrown
	file.on ("error", function (err)
	{
		mFS.unlink (TARGET);
		failure (err.message);
	});

	// Initialize the verification object
	var verify = mCrypto.createVerify ("RSA-SHA256");
		
	// Compute hash
	res.pipe (verify);
	
	// Whenever the binary has finished downloading
	res.on ("end", function ()
	{
		if (process.env.npm_package_config_verify)
		{
			// Attempt to download signature
			getStreamOrFail (SIG, function (res)
			{
				// Store the signature in memory
				var bufs = [];
				res.on ("data", function (d) { bufs.push(d); });
				
				// Whenever the signature has finished downloading
				res.on ("end", function ()
				{
					// Check for valid signature
					if (verify.verify (PUBKEY, Buffer.concat (bufs)))
					{
						console.log ("Binary downloaded and verified");
					}
					else
					{
						mFS.unlink (TARGET);
						verifyFailure ("Signature invalid");
					}
				});
			}, function (err)
			{
				mFS.unlink (TARGET);
				verifyFailure ("Signature download failed - " + err);
			});
		}
	});
}, failure);

