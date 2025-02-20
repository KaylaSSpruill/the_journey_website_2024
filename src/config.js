const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://wrightcn1:StemSeminar_Inspirational@userauthen.ijfao.mongodb.net/TheJourney");

connect.then(() => {
    console.log("Database connected sucessfully");
})
.catch(() => {
    console.log("Database cannot be connected");
});

const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
	profile_pic: {
		type: String,
		default: "/images/noprofilephoto.jpg"
	}
});

const JournalSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    mood: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const CalendarSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    notes: {
        type: String
    }
});

const User = new mongoose.model("users", LoginSchema);
const Journal = mongoose.model("Journal", JournalSchema); 
const Calendar = mongoose.model("Calendar", CalendarSchema);

module.exports = {User, Journal, Calendar};