const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { User, Journal, Calendar } = require('./config');
const bodyParser = require('body-parser');
const multer = require('multer');
const { checkAuthCookie, cleanAuthCookie } = require('./controllers/cookieControllers.js');
const { createToken, decodeToken } = require('./controllers/jwtControllers.js');

const app = express();

//Storage for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');

app.use(express.static("public"));
//app.use('/src',express.static(path.join(__dirname, 'src')));

// Serve static images
app.use('/uploads', express.static("uploads"));

//Middleware for user login and basic set up
app.use('/', (req, res, next) => {
    cleanAuthCookie(req, res);
	checkAuthCookie(req);
	next();
});

app.get('/login', (req,res) => {
    if (req.session.authToken) {
		const decoded = decodeToken(req.session.authToken);
		if (decoded) {
			if (decoded.username) {
				res.render('login', {
					user: decoded.username
				});
			} else {
				res.render('login', {
					username: null
				});
			}
		}
    } else {
        res.render('login', {
            username: null
        });
    }
});

app.get('/signup', (req,res) => {
    res.render('signup');
});

app.get('/main', (req, res) => {
	if (req.session.authToken) {
		const decoded = decodeToken(req.session.authToken);
		if (decoded) {
			res.render('main');
		} else {
			res.render('login');
		}
	} else {
		res.render('login', { username: null });
	}
});

app.get('/about', (req, res) => {
	const decoded = decodeToken(req.session.authToken);
    res.render('about');
});

app.get('/user', async (req, res) => {
	const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;
    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const journalEntries = await Journal.find({ user_id: userId })
        .sort({ date: -1 }) 
        //.limit(5); 

        res.render('user', {
            username: decoded.username,
            journalEntries: journalEntries
        });
    } catch (err) {
        res.status(500).send({ error: err });
    }
});


app.get('/resources', (req, res) => {
	const decoded = decodeToken(req.session.authToken);
    res.render('resources');
});


app.get('/calendar', async (req, res) => {
	const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;
    
	if (!userId) {
        return res.redirect('/login');
    }

    try {
        const events = await Calendar.find({ user_id: userId })
            .sort({ date: -1 })
            .limit(5);

        // Convert event dates to 'YYYY-MM-DD' format for easier comparison in the frontend
        const formattedEvents = events.map(event => ({
            ...event.toObject(),
            date: event.date.toISOString().split('T')[0]  // Convert to 'YYYY-MM-DD' format
        }));

        res.render('calendar', {
            username: decoded.username,
            events: formattedEvents
        });
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

app.get('/journal', async (req, res) => {
	const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;
    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const journalEntries = await Journal.find({ user_id: userId })
            .sort({ date: -1 })
            .limit(5);

        res.render('journal', {
            username: decoded.username,
            journalEntries: journalEntries
        });
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

app.get('/user-journal', async (req, res) => {
	const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;    
    
    if (!userId) {
        return res.redirect('/login');
    }
    
    try {
        const journalEntries = await Journal.find({ user_id: userId })
		.sort({ date: -1 })
		.limit(5);
    
		res.json(journalEntries);
	} catch (error) {
		res.status(500).json({ error : 'Failed to fetch journal entries'});
	}    
});

app.get('/user-data', async (req, res) => {
	const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;
	
	 if (!userId) {
        return res.redirect('/login');
    }
	
	try {
		const user = await User.findOne({ _id: userId });
		if (user) {
			res.json(user);
		}	
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch user' });
	}
});

app.post('/journal', async (req, res) => {
    const { title, content, mood, date } = req.body;
	const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;
    
	if (!userId) {
        return res.status(400).send({ error: 'User not logged in' });
    }
    try {
        const newJournalEntry = new Journal({
            user_id: userId,
            title: title,
            content: content,
            mood: mood,
            date: date,
        });
        await newJournalEntry.save();
        const journalEntries = await Journal.find({ user_id: userId })
            .sort({ date: -1 })
            .limit(5);

        res.json({ success: true, journalEntries: journalEntries });
    } catch (error) {
        res.status(500).json({ error : 'Failed to save journal entry' });
    }
});


app.post("/signup", async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    }

    const existingUser = await User.findOne({ username: data.username });

    if (existingUser) {
        return res.send("An account already exists with that username. Please choose a different username.");
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userData = new User(data); 
        await userData.save();
    }
    res.redirect('login');
});

app.post('/calendar', async (req, res) => {
    const { name, date, notes } = req.body;
	 const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;

    if (!userId) {
        return res.status(400).send('User not logged in');
    }

    try {
        // Create a new event and save it to the database
        const newEvent = new Calendar({
            user_id: userId,
            name: name,
            date: new Date(date),  // Ensure correct date format
            notes: notes
        });

        await newEvent.save();  // Save event to the database

        res.json({ success: 'Event created successfully' });
    } catch (error) {
        res.status(500).json({error: 'Failed to save event'});
    }
});

app.delete('/calendar', async (req, res) => {
	const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;
    const eventId = req.body.eventId;  // Get the event ID from the request body

    if (!userId) {
        return res.status(401).send({ error: 'User not logged in' });  // Ensure the user is logged in
    }

    if (!eventId) {
		return res.status(400).send({ error: 'Event ID is required' });  // Make sure an event ID is provided
    }

    try {
        // Find the event by its ID and ensure it belongs to the logged-in user
        const event = await Calendar.findOne({ _id: eventId, user_id: userId });

        if (!event) {
            return res.status(404).send({ error: 'Event not found or does not belong to this user' });
        }

        // Delete the event
        await Calendar.findByIdAndDelete(eventId);

        res.json({ success: 'Event deleted successfully' });  // Send success response
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete event' });  // Handle any errors
    }
});

app.delete('/journal', async (req, res) => {
    const userId = req.session.userId;
    const entryId = req.body.entryId;

    if(!userId) {
        return res.status(401).send('User not logged in');
    }

    if(!entryId){
        return res.status(400).send('Entry ID is required');
    }

    try{
        const entry = await Journal.findOne({_id: entryId, user_id: userId});

        if(!entry){
            return res.status(404).send('Entry not found or does not belong to this user');
        }

        res.json({ success: true, message: 'Entry deleted successfully'});
    } catch (error){
        console.error('Error deleting entry:', error);
        res.status(500).send('Failed to delete entry');
    }
    
});


app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ username: req.body.username });
        if (!check) {
            return res.status(401).json({ error: "Username not found" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
			const remembered = req.body.check; //If the box is checked, the value is on, otherwise it is undefined
			//console.log("This is the remembered: ", remembered); //Use this to confirm the above statement
			const token = await createToken({ username: check.username, userId: check._id });
			if (token) {
				req.session.authToken = token;
				if (remembered) {
					res.cookie("authToken", token, {
						httpOnly: true, // Prevents JavaScript access (protects from XSS)
						secure: true, // Ensures the cookie is sent only over HTTPS
						sameSite: "Strict", // Helps prevent CSRF attacks
						maxAge: 60 * 60 * 1000 // 1 day expiration
					});
			    }
			    res.status(200).json({success: 'Login successful!', redirect: '/main'});
			} else {
				return res.status(401).json({ error: "Errors creating token!" });;
			}			
        } else {
            return res.status(401).json({ error: "Incorrect password"});
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong, please try again."});
    }
});

app.post('/change-password', async (req, res) => {
    const newPassword = req.body.newPassword;
    const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User not logged in'});
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("Hashed Password: ", hashedPassword);

        const result = await User.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount === 1) {
            res.status(200).json({ success: "Password successfully updated!", redirect: '/user'});
        } else {
            res.status(500).json({ error: 'Error updating password.'});
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong, please try again.'});
    }
});

app.post('/change-username', async (req, res) => {
    const newUsername = req.body.newUsername;
    const decoded = await decodeToken(req.session.authToken);
	const userId = decoded.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User not logged in' });
    }

    try {
        const existingUser = await User.findOne({ username: newUsername });

        if (existingUser) {
            return res.status(400).send({ error: "This username is already taken. Please choose a different one." });
        }

        const result = await User.updateOne(
            { _id: userId },
            { $set: { username: newUsername } }
        );

        if (result.modifiedCount === 1) {
			const newToken = createToken({ username: newUsername, userId: userId });
            req.session.authToken = newToken;
            res.redirect('/user');
        } else {
            res.status(500).send({ error: 'Error updating username.' });
        }
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

app.post('/change-profilepic', upload.single('profile_pic'), async (req, res) => {
	if (!req.file) {
        return res.status(400).send({ error: "No file uploaded." });
    }
	const name = req.file.filename; // Assuming multer saves the file path
	//Now we need to store this in the database
	const imagePath = `http://localhost:5001/uploads/${name}`; //
	const userId = req.session.userId;
	
	
	if (!userId) {
		return res.status(400).send({ error: "User not logged in." });
	}
	
	try {
		const existingUser = await User.findOne({ _id: userId });
		
		if (existingUser) {
			const result = await User.updateOne(
				{ _id: userId },
				{ $set: { profile_pic: imagePath } }
			);
						
			if (result.acknowledged) {
				req.session.profile_pic = imagePath;
				res.redirect('/user');
			} else {
				res.status(500).send({ error: 'Error updating username.' });
			}
		}
	} catch (err) {
		res.status(500).send({ error: "Profile picture update fails, check to see errors and try again" });
	}
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send({ error: err });
        }
        res.redirect('/login');
    });
});

app.post('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.status(500).send({ error: err });
		}
	});
});

const port = 5001;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});