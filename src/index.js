const express = require('express');
const path = require("path");
const bcrypt = require('bcrypt');
const session = require('express-session');
const { User, Journal, Calendar} = require('./config');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');

app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, "js")));
//app.use('/src',express.static(path.join(__dirname, 'src')));


app.get('/login', (req,res) => {
    if(req.session.user) {
        res.render('login', {
            user: req.session.username
        });
    }else {
        res.render('login', {
            username: null
        });
    }
});

app.get('/signup', (req,res) => {
    res.render('signup');
});

app.get('/main', (req, res) => {
    res.render('main', { username: req.session.username });

});

app.get('/about', (req, res) => {
    res.render('about', { username: req.session.username });
});

app.get('/user', async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const journalEntries = await Journal.find({ user_id: userId })
        .sort({ date: -1 }) 
        //.limit(5); 

        res.render('user', {
            username: req.session.username,
            journalEntries: journalEntries
        });
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).send('Failed to fetch journal entries');
    }
});


app.get('/resources', (req, res) => {
    res.render('resources', { username: req.session.username });
});


app.get('/calendar', async (req, res) => {
    const userId = req.session.userId;

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
            username: req.session.username,
            events: formattedEvents
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Failed to fetch events');
    }
});



app.get('/journal', async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const journalEntries = await Journal.find({ user_id: userId })
            .sort({ date: -1 })
            .limit(5);

        res.render('journal', {
            username: req.session.username,
            journalEntries: journalEntries
        });
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).send('Failed to fetch journal entries');
    }
});

app.get('/user-journal', async (req, res) => {
        const userId = req.session.userId;
    
        if (!userId) {
            return res.redirect('/login');
        }
    
        try {
            const journalEntries = await Journal.find({ user_id: userId })
                .sort({ date: -1 })
                .limit(5);
    
            res.json(journalEntries);
        } catch (error) {
            console.error('Error fetching journal entries:', error);
            res.status(500).json({ error : 'Failed to fetch journal entries'});
        }    
});

app.post('/journal', async (req, res) => {
    const { title, content, mood, date } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(400).send('User not logged in');
    }
    try {
        console.log('Received journal entry:', { title, content, mood, date });

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
        console.error('Error saving journal entry:', error);
        res.status(500).json({error : 'Failed to save journal entry'});
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

        console.log("User created successfully:", userData);
    }

    res.render('main', { username: req.body.username });
});

app.post('/calendar', async (req, res) => {
    const { name, date, notes } = req.body;
    const userId = req.session.userId;

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

        res.json({ success: true, message: 'Event created successfully' });
    } catch (error) {
        console.error('Error saving event:', error);
        res.status(500).json({error: 'Failed to save event'});
    }
});

app.delete('/calendar', async (req, res) => {
    const userId = req.session.userId;
    const eventId = req.body.eventId;  // Get the event ID from the request body

    if (!userId) {
        return res.status(401).send('User not logged in');  // Ensure the user is logged in
    }

    if (!eventId) {
        return res.status(400).send('Event ID is required');  // Make sure an event ID is provided
    }

    try {
        // Find the event by its ID and ensure it belongs to the logged-in user
        const event = await Calendar.findOne({ _id: eventId, user_id: userId });

        if (!event) {
            return res.status(404).send('Event not found or does not belong to this user');
        }

        // Delete the event
        await Calendar.findByIdAndDelete(eventId);

        res.json({ success: true, message: 'Event deleted successfully' });  // Send success response
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Failed to delete event');  // Handle any errors
    }
});


app.post("/login", async (req, res) => {
    console.log("Received login request with:", req.body);
    try {
        const check = await User.findOne({ username: req.body.username });
        console.log("Check: ", check);
        if (!check) {
            return res.status(401).json({error: "Username not found"});
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            req.session.username = check.username;
            req.session.userId = check._id;
            res.status(200).json({success: true, message: 'Login successful!', redirect: '/main'});
            // res.redirect('/main');
        } else {
            return res.status(401).json({ error: "Incorrect password"});
        }

    } catch (error) {
        console.error("Error during login:", error); 
        res.status(500).json({ error: "Something went wrong, please try again."});
    }
});

app.post('/change-password', async (req, res) => {
    const newPassword = req.body.newPassword;
    const userId = req.session.userId;

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

        console.log("Update Result: ", result);

        if (result.modifiedCount === 1) {
            console.log("Password successfully updated!");
            res.status(200).json({success: "Password successfully updated!"})
            res.redirect('/user');
        } else {
            console.log("Password update failed!");
            res.status(500).json({error: 'Error updating password.'});
        }
    } catch (err) {
        console.error('Error during password update:', err);
        res.status(500).json({ error: 'Something went wrong, please try again.'});
    }
});

app.post('/change-username', async (req, res) => {
    const newUsername = req.body.newUsername;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(400).json({error: 'User not logged in'});
    }

    try {
        const existingUser = await User.findOne({ username: newUsername });

        if (existingUser) {
            return res.status(400).send("This username is already taken. Please choose a different one.");
        }

        const result = await User.updateOne(
            { _id: userId },
            { $set: { username: newUsername } }
        );

        console.log("Update Result: ", result);

        if (result.modifiedCount === 1) {
            req.session.username = newUsername;
            console.log("Username successfully updated!");
            res.redirect('/user');
        } else {
            console.log("Username update failed!");
            res.status(500).send('Error updating username.');
        }
    } catch (err) {
        console.error('Error during username update:', err);
        res.status(500).send('Something went wrong with username, please try again.');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error logging out");
        }
        res.redirect('/login');
    });
});


const port = 5001;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
})