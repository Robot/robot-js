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
// Exports                                                                    //
//----------------------------------------------------------------------------//

module.exports = function (robot, log, sprintf, getline, assert)
{
	//----------------------------------------------------------------------------//
	// Locals                                                                     //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	var Color     = robot.Color;
	var Image     = robot.Image;
	var Timer     = robot.Timer;
	var Clipboard = robot.Clipboard;

	var fs  = require ("fs"      );
	var png = require ("node-png").PNG;



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	function testLinux()
	{
		if (process.platform === "linux")
		{
			assert (!Clipboard.clear  ());

			assert (!Clipboard.hasText());
			assert (!Clipboard.getText().length );
			assert (!Clipboard.setText (""     ));
			assert (!Clipboard.setText ("Hello"));
			assert (!Clipboard.setText ("World"));

			var image = Image();
			assert (!Clipboard.hasImage());
			assert (!Clipboard.getImage (image));
			assert (!Clipboard.setImage (image));
			assert (!image.isValid());

			assert (Clipboard.getSequence() === 0);
			assert (Clipboard.getSequence() ===
					Clipboard.getSequence());
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testText()
	{
		if (process.platform === "darwin" ||
			process.platform === "win32")
		{
			var s = 0; var text;
			var image = Image();
			var big = new Array (1048576).join ("0");

			var test = function (str, write)
			{
				if (write)
					assert (Clipboard.setText (str));

				assert ( Clipboard.hasText ());
				assert (!Clipboard.hasImage());

				assert (Clipboard.getSequence() !== 0);
				assert (Clipboard.getSequence() !== s);
				assert (Clipboard.getSequence() ===
						Clipboard.getSequence());
					s = Clipboard.getSequence();

				assert (!Clipboard.getImage (image)); assert (!image.isValid());
				assert (!Clipboard.getImage (image)); assert (!image.isValid());
				text = Clipboard.getText(); assert (text === str);
				text = Clipboard.getText(); assert (text === str);
				return true;
			};

			//----------------------------------------------------------------------------//

			assert (test ("",      true));
			assert (test ("Hello", true)); log ("Try pasting the text"); getline();
			assert (test ("World", true)); log ("Try pasting the text"); getline();
			assert (test (big,     true));

			//----------------------------------------------------------------------------//

			assert (Clipboard.clear());
			log ("Copy Hello and press enter  "); getline(); assert (test ("Hello", false));
			assert (Clipboard.clear());
			log ("Copy World and press enter\n"); getline(); assert (test ("World", false));

			//----------------------------------------------------------------------------//

			assert ( Clipboard.hasText ());
			assert (!Clipboard.hasImage());

			assert (Clipboard.getSequence() !== 0);
			assert (Clipboard.getSequence() === s);
			assert (Clipboard.getSequence() ===
					Clipboard.getSequence());

			assert (!Clipboard.getImage (image)); assert (!image.isValid());
			assert (!Clipboard.getImage (image)); assert (!image.isValid());
			text = Clipboard.getText(); assert (text === "World");
			text = Clipboard.getText(); assert (text === "World");

			//----------------------------------------------------------------------------//

			assert ( Clipboard.clear   ());
			assert (!Clipboard.hasText ());
			assert (!Clipboard.hasImage());

			assert (Clipboard.getSequence() !== 0);
			assert (Clipboard.getSequence() !== s);
			assert (Clipboard.getSequence() ===
					Clipboard.getSequence());
				s = Clipboard.getSequence();

			assert (!Clipboard.getImage (image)); assert (!image.isValid());
			assert (!Clipboard.getImage (image)); assert (!image.isValid());
			text = Clipboard.getText(); assert (text === "");
			text = Clipboard.getText(); assert (text === "");
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testImage()
	{
		if (process.platform === "darwin" ||
			process.platform === "win32")
		{
			var s = 0; var text;
			var image = Image();

			var pattern = Image (9, 5);
			// Create test clipboard image
			for (var i = 0; i < 5; ++i)
			{
				var a = 0;
				switch (i) {
					case 0: a = 255; break; case 1: a = 192; break;
					case 2: a = 128; break; case 3: a =  64; break;
				}

				pattern.setPixel (0, i, Color (  0,   0,   0, a));
				pattern.setPixel (1, i, Color (128, 128, 128, a));
				pattern.setPixel (2, i, Color (255, 255, 255, a));
				pattern.setPixel (3, i, Color (255,   0,   0, a));
				pattern.setPixel (4, i, Color (  0, 255,   0, a));
				pattern.setPixel (5, i, Color (  0,   0, 255, a));
				pattern.setPixel (6, i, Color (255, 255,   0, a));
				pattern.setPixel (7, i, Color (  0, 255, 255, a));
				pattern.setPixel (8, i, Color (255,   0, 255, a));
			}

			var test = function (img)
			{
				if (img.isValid())
					assert (Clipboard.setImage (img));

				assert (!Clipboard.hasText ());
				assert ( Clipboard.hasImage());

				assert (Clipboard.getSequence() !== 0);
				assert (Clipboard.getSequence() !== s);
				assert (Clipboard.getSequence() ===
						Clipboard.getSequence());
					s = Clipboard.getSequence();

				assert (Clipboard.getImage (image)); assert (image.isValid());
				assert (Clipboard.getImage (image)); assert (image.isValid());
				text = Clipboard.getText(); assert (text === "");
				text = Clipboard.getText(); assert (text === "");
				return true;
			};

			//----------------------------------------------------------------------------//

			assert (test (pattern));
			assert (pattern.isValid() === true);
			assert (pattern.getWidth () ===  9);
			assert (pattern.getHeight() ===  5);
			assert (pattern.getLength() === 45);
			assert (pattern.getLimit () === 45);

			assert (pattern.isValid  () === image.isValid  ());
			assert (pattern.getWidth () === image.getWidth ());
			assert (pattern.getHeight() === image.getHeight());
			assert (pattern.getLength() === image.getLength());
			assert (pattern.getLimit () === image.getLimit ());

			assert (image.getPixel (0, 0).eq (Color (  0,   0,   0)));
			assert (image.getPixel (1, 0).eq (Color (128, 128, 128)));
			assert (image.getPixel (2, 0).eq (Color (255, 255, 255)));
			assert (image.getPixel (3, 0).eq (Color (255,   0,   0)));
			assert (image.getPixel (4, 0).eq (Color (  0, 255,   0)));
			assert (image.getPixel (5, 0).eq (Color (  0,   0, 255)));
			assert (image.getPixel (6, 0).eq (Color (255, 255,   0)));
			assert (image.getPixel (7, 0).eq (Color (  0, 255, 255)));
			assert (image.getPixel (8, 0).eq (Color (255,   0, 255)));

			//----------------------------------------------------------------------------//

			var saveImage = function (name, image)
			{
				var result = new png ({
					 width: image.getWidth (),
					height: image.getHeight()
				});

				var data = image.getData  ();
				var size = image.getLength();
				var buffer = result.data;
				assert (image.swap ("abgr"));

				for (var i = 0, j = 0; i < size; ++i, j += 4)
					buffer.writeUInt32LE (data[i], j);

				result.pack().pipe (fs.createWriteStream (name));
			};

			saveImage ("pattern_orig.png", image  );
			saveImage ("pattern_copy.png", pattern);
			log ("Try pasting the image"); getline();

			assert (Clipboard.clear());
			log ("Copy JPG image and press enter"); getline(); assert (test (Image()));
			saveImage ("JPG.png", image);

			assert (Clipboard.clear());
			log ("Copy PNG image and press enter"); getline(); assert (test (Image()));
			saveImage ("PNG.png", image);

			log ("Please verify saved images\n"); getline();

			//----------------------------------------------------------------------------//

			assert (!Clipboard.setImage (Image()));

			assert (!Clipboard.hasText ());
			assert ( Clipboard.hasImage());

			assert (Clipboard.getSequence() !== 0);
			assert (Clipboard.getSequence() === s);
			assert (Clipboard.getSequence() ===
					Clipboard.getSequence());

			assert (Clipboard.getImage (image)); assert (image.isValid());
			assert (Clipboard.getImage (image)); assert (image.isValid());
			text = Clipboard.getText(); assert (text === "");
			text = Clipboard.getText(); assert (text === "");

			//----------------------------------------------------------------------------//

			image.destroy();
			assert ( Clipboard.clear   ());
			assert (!Clipboard.hasText ());
			assert (!Clipboard.hasImage());

			assert (Clipboard.getSequence() !== 0);
			assert (Clipboard.getSequence() !== s);
			assert (Clipboard.getSequence() ===
					Clipboard.getSequence());
				s = Clipboard.getSequence();

			assert (!Clipboard.getImage (image)); assert (!image.isValid());
			assert (!Clipboard.getImage (image)); assert (!image.isValid());
			text = Clipboard.getText(); assert (text === "");
			text = Clipboard.getText(); assert (text === "");
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testSpeed()
	{
		if (process.platform === "darwin" ||
			process.platform === "win32")
		{
			var s = 0; var text;
			var timer = Timer();
			var image = Image (1920, 1080);

			var smallText = "Small Size";
			var largeText = new Array
				(1048576).join ("0");

			var smallImage = Image (  16,   16);
			var largeImage = Image (1920, 1080);
			smallImage.fill (192, 128, 64);
			largeImage.fill (192, 128, 64);

			//----------------------------------------------------------------------------//

			log ("Small text  (ms): ");
			for (var i = 0; i < 5; ++i)
			{
				timer.start();

				assert (Clipboard.setText (smallText));
				var     clipSequence = Clipboard.getSequence();
				assert (clipSequence !== s); s = clipSequence;

				assert (Clipboard.getText().length > 0);
				assert (Clipboard.getSequence() === s);

				log (timer.getElapsed() + " ");
			}

			assert (Clipboard.clear());
			log ("\n");

			//----------------------------------------------------------------------------//

			log ("Large text  (ms): ");
			for (var i = 0; i < 5; ++i)
			{
				timer.start();

				assert (Clipboard.setText (largeText));
				var     clipSequence = Clipboard.getSequence();
				assert (clipSequence !== s); s = clipSequence;

				assert (Clipboard.getText().length > 0);
				assert (Clipboard.getSequence() === s);

				log (timer.getElapsed() + " ");
			}

			assert (Clipboard.clear());
			log ("\n");

			//----------------------------------------------------------------------------//

			log ("Small image (ms): ");
			for (var i = 0; i < 5; ++i)
			{
				timer.start();

				assert (Clipboard.setImage (smallImage));
				var     clipSequence = Clipboard.getSequence();
				assert (clipSequence !== s); s = clipSequence;

				assert (Clipboard.getImage (image));
				assert (Clipboard.getSequence() === s);

				log (timer.getElapsed() + " ");
			}

			assert (Clipboard.clear());
			log ("\n");

			//----------------------------------------------------------------------------//

			log ("Large image (ms): ");
			for (var i = 0; i < 5; ++i)
			{
				timer.start();

				assert (Clipboard.setImage (largeImage));
				var     clipSequence = Clipboard.getSequence();
				assert (clipSequence !== s); s = clipSequence;

				assert (Clipboard.getImage (image));
				assert (Clipboard.getSequence() === s);

				log (timer.getElapsed() + " ");
			}

			assert (Clipboard.clear());
			log ("\n");
		}

		return true;
	}

	////////////////////////////////////////////////////////////////////////////////

	function testArgs()
	{
		var img = Image();

		assert (Clipboard.setText,  Clipboard, [   ]);
		assert (Clipboard.setText,  Clipboard, [ 0 ]);
		assert (Clipboard.getImage, Clipboard, [   ]);
		assert (Clipboard.getImage, Clipboard, [ 0 ]);
		assert (Clipboard.getImage, Clipboard, [" "]);
		assert (Clipboard.setImage, Clipboard, [   ]);
		assert (Clipboard.setImage, Clipboard, [ 0 ]);
		assert (Clipboard.setImage, Clipboard, [" "]);

		assert (typeof Clipboard.clear    (   ) === "boolean");
		assert (typeof Clipboard.hasText  (   ) === "boolean");
		assert (typeof Clipboard.getText  (   ) === "string" );
		assert (typeof Clipboard.setText  (" ") === "boolean");
		assert (typeof Clipboard.hasImage (   ) === "boolean");
		assert (typeof Clipboard.getImage (img) === "boolean");
		assert (typeof Clipboard.setImage (img) === "boolean");
		assert (typeof Clipboard.getSequence () === "number" );

		return true;
	}



	//----------------------------------------------------------------------------//
	// Main                                                                       //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////

	return function()
	{
		log ("BEGIN CLIPBOARD TESTING\n------------------------------\n");

		log ("Warning: Some set of tests cannot be automated\n"  );
		log ("         Please execute the following commands\n\n");

		if (!testLinux()) { log (">> Linux Failed\n\n"); return false; }
		if (!testText ()) { log (">> Text Failed \n\n"); return false; }
		if (!testImage()) { log (">> Image Failed\n\n"); return false; }
		if (!testSpeed()) { log (">> Speed Failed\n\n"); return false; }
		if (!testArgs ()) { log (">> Args Failed \n\n"); return false; }
		log (">> Success\n\n"); return true;
	};
};
