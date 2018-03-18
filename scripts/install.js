////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                       (C) 2010-2018 Robot Developers                       //
//                       See LICENSE for licensing info                       //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

"use strict";

//----------------------------------------------------------------------------//
// Requires                                                                   //
//----------------------------------------------------------------------------//

var mFS     = require ("fs"    );
var mCrypto = require ("crypto");
var mHTTP   = require ("http"  );
var mColors = require ("colors/safe");



//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////

var REMOTE = "http://node.getrobot.net/addon/";

////////////////////////////////////////////////////////////////////////////////

var BINARY =
	process.platform   + "-" +
	process.arch       + "-" +
	process.versions.modules +
	".node";

////////////////////////////////////////////////////////////////////////////////

var SOURCE = REMOTE + process.env.npm_package_version + "/" + BINARY;
var SIGS   = REMOTE + process.env.npm_package_version + "/signatures.txt";
var TARGET = "./lib/" + BINARY;

////////////////////////////////////////////////////////////////////////////////
/// Fingerprint: ssh-rsa 4096 25:9D:39:06:78:19:07:7B:1C:85:31:6E:D1:FA:9B:EA

var PUBLIC_KEY =
	"-----BEGIN PUBLIC KEY-----\n" +
	"MIICIDANBgkqhkiG9w0BAQEFAAOCAg0AMIICCAKCAgEAv7WvbN0eIrK2qU47FQJ3\n" +
	"F0pjHGGkPquERERV1w5oz4XCuryBXKq8lu6yech440fLitdzLj4e80Rg1RU3+jgd\n" +
	"8C8da8jkLRmTrlo7Tb0Qt77yydmPBUDeq3gOKylrXSZBFi4tMCmZLHloHtnvriHr\n" +
	"u8CP5Zmq4C4YZfbj2JaIoONJAmyuGBh4Mydrp7FmzYCkYEUjnv+1tKxWTkxwcuGP\n" +
	"oX5BGFfceZMxpJXJE1ycrylPvjPDixknp55M/pKant3P84bA8+uaX+cTsgeDD1lb\n" +
	"CLOOUqjV6DpqGmcLE9eXOWMhrs5a2HnztLeHlQx4fQYEz46PUctPCnr2D+o2rLva\n" +
	"FYzVVUa8Bb8TC7L7xrkoqYjrzdKPG2MWAunY4i9YFaT/qipbZjfJKHs/JJmP0a+J\n" +
	"5s/SN+P9F5itxPMNubdQECGQJOeQcYCLtrhMRSeQ/15CkXo/4i8QMV3ZPinJEYKy\n" +
	"54acfd6Lxy9RvwW6oUht6aFTvYjWn9F1EsPPT8v4PTMGGK0k9i0+xNRoKf+c3a5u\n" +
	"mfyLoOqSaKoxY6FyIBE/F/xHgJ5vNSMGlmORPNKak600cNUVJj0QfHKcWkHSzyqF\n" +
	"BD5MYVZuGw4XBrN4gpLiI1T/MN1xdzHIhd9GNpgv40ClCwZASSIux1BWGzkN1C8Y\n" +
	"zfge1QWwJVC1G3Mig+ki3/UCASU=\n" +
	"-----END PUBLIC KEY-----\n";



//----------------------------------------------------------------------------//
// Locals                                                                     //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////
/// Create a writable stream to binary file

var target = mFS.createWriteStream (TARGET);

////////////////////////////////////////////////////////////////////////////////

var genericFailure = function (details)
{
	console.warn (mColors.yellow.bold (
		"WARNING: robot-js precompiled binaries could " +
		"not be downloaded, an attempt to compile them" +
		" manually will be made. For more information," +
		" please visit http://getrobot.net/docs/node.html." +
		" Details: " + details
	));

	try
	{
		// Delete target binary
		mFS.unlinkSync (TARGET);

	} catch (e) { }

	process.exitCode = 1;
};

////////////////////////////////////////////////////////////////////////////////

var verifyFailure = function (details)
{
	console.error (mColors.red.bold (
		"ERROR: robot-js precompiled binaries could not " +
		"be verified. This could be a result of a man-in" +
		"-the-middle attack. If you want to continue " +
		"anyway, use the following command to disable" +
		" verification: 'npm config set robot-js:verify " +
		"false'. Details: " + details
	));

	try
	{
		// Delete target binary
		mFS.unlinkSync (TARGET);

	} catch (e) { }
};

////////////////////////////////////////////////////////////////////////////////

var request = function (url, success, failure)
{
	// Attempt to get the URL
	var req = mHTTP.get (url);

	// Whenever a response is received
	req.on ("response", function (res)
	{
		// Check if response is OK
		if (res.statusCode === 200)
			success (res);

		// Some unexpected response
		else failure ("bad response" +
			" (" + res.statusCode +
			") " + res.statusMessage);
	});

	// Whenever an error is thrown
	req.on ("error", function (err)
	{
		failure (err.message);
	});
};



//----------------------------------------------------------------------------//
// Main                                                                       //
//----------------------------------------------------------------------------//

// Target file has gotten an error
target.on ("error", function (err)
{
	genericFailure (err.message);
});

// Attempt to download the binary
request (SOURCE, function (source)
{
	// Save the response
	source.pipe (target);

	// Check whether we want to verify binary
	if (process.env.npm_package_config_verify)
	{
		// Create a verify object for verifying the file
		var verify = mCrypto.createVerify ("RSA-SHA256");
		source.pipe (verify);

		// Binary finished downloading
		source.on ("end", function()
		{
			// Download all the signatures
			request (SIGS, function (sigs)
			{
				var signatures = "";
				// Save data as it's downloading
				sigs.on ("data", function (data)
				{
					signatures += data.toString();
				});

				// Signatures downloaded
				sigs.on ("end", function()
				{
					var signature = "";
					// Parse file and find the associated signature
					signatures.split (/\r?\n/).map (function (sig)
					{
						sig = sig.split (" ");
						if (sig.length >= 2 &&
							sig[1] === BINARY)
							signature = sig[0];
					});

					if (verify.verify (PUBLIC_KEY, signature, "base64"))
						console.info ("Binary downloaded and verified");
					else
						verifyFailure ("Invalid binary file signature");
				});

			}, verifyFailure);
		});
	}

}, genericFailure);
