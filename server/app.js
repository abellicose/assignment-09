require("dotenv").config()
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000", "https://assignment-09-frontend.vercel.app"], credentials: true }));
app.use(cookieParser());

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    const coll = db.collection("users");
    let user = await coll.findOne({ email: profile.emails[0].value });
    if (!user) {
        const result = await coll.insertOne({
            name: profile.displayName,
            email: profile.emails[0].value,
            profileUrl: profile.photos[0].value,
            createdAt: Date.now()
        });
        user = await coll.findOne({ _id: result.insertedId });
    }
    return done(null, user);
}));

app.use(passport.initialize());

const uri = process.env.MONGODB_URI;
console.log(uri);
if (!uri) throw new Error("Please put your MONGODB URL in .env file");

const client = new MongoClient(uri,
    {
        compressors: ["snappy"]
    }
);
let db = null;

async function launchDb() {
    try {
        await client.connect();
        db = await client.db('sportnest');
        db.command({ ping: 1 });
        console.log('Pinged DB. Successfully connected to MongoDB!');
    } catch(err) {
        console.log(err);
    }
}

function authVerify(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(404).json({ message: "No valid token" });
    }

    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        req.user = userData;
        next();
    } catch(err) {
        console.log(err);
        res.status(401).json({ message: "Invalid Token" });
    }
}

// ======================
//         POST
// ======================

// Auth
app.post("/api/auth/register", async(req, res) => {
    const data = req.body;
    // validate on server as well
    try {
        const coll = await db.collection("users");
        const prev = await coll.findOne({ email: data.email });
        if (prev) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const hashed = await bcrypt.hash(data.password, 10);
        const doc = await coll.insertOne({...data, password: hashed, createdAt: Date.now()}, {});
        if (!doc.acknowledged) {
            return res.status(500).json({ message: "Server Error" });
        }
        res.status(201).json({ message: "User created successfully" });
    } catch(err) {
        console.log("Something went wrong while registering");
        console.log(err);
        res.status(500).json({ message: "Failed to create user" });
    }
});

app.post("/api/auth/login", async(req, res) => {
    const {email, password} = req.body; // email, password
    // verify data here
    const coll = await db.collection("users");
    const user = await coll.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "No user found with this email address" });
    }
    
    const decode = await bcrypt.compare(password, user.password);
    if (!decode) {
        return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true, partitioned: true, maxAge:  7 * 24 * 3600 * 1000, });
    res.json({ message: "User Logged in Successfully" });
});

app.post("/api/auth/logout", authVerify, (req, res, next) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

// Facilities
app.post("/api/facilities", authVerify, async(req, resp) => {
    const data = req.body;
    try {
        const coll = await db.collection("facilities");
        const facility = await coll.insertOne({...data, ownerId: req.user.id });
        if (facility.acknowledged) {
            resp.json({ message: "facility added successfully" });
        } else {
            resp.status(404).json({ message: "Failed to add facility" });
        }
    } catch(err){
        console.log(err);
        resp.status(404).json({ message: "Failed to get user info" });
    }
});

// Booking

app.post("/api/bookings", authVerify, async(req, res) => {
    const data = req.body; // facility id, booking date, timeslots array 
    console.log(data);
    const {email, id} = req.user;
    try {
        let coll = await db.collection("facilities");
        const facility = await coll.findOne({ _id: new ObjectId(data.facility_id) });
        if (!facility) {
            return res.status(404).json({ message: "No facility with this id found" });
        }

        coll = await db.collection("bookings");
        const result = await coll.insertOne({...data, ownerId: id, facility_name: facility.name, hours: data.time_slots.length, total_price: data.time_slots.length * facility.price_per_hour, status: "Pending"});
        if (result.acknowledged) {
            res.json({ message: "booking added successfully" });
        } else {
            res.status(404).json({ message: "Failed to add booking" });
        }
        await db.collection("facilities").updateOne(
            { _id: new ObjectId(data.facility_id) },
            { $inc: { booking_count: 1 } }
        );
    } catch(err){
        console.log(err);
        res.status(404).json({ message: "Could not add booking" });
    }
});

// ======================
//          PUT
// ======================

// Facilities

app.put("/api/facilities/:id", authVerify, async(req, res) => {
    const data = req.body;
    const id = req.params.id;
    const {email, id: authUserId} = req.user;
    try {
        const coll = await db.collection("facilities");
        const prevFacility = await coll.findOne({ _id: new ObjectId(id) });
        if (!prevFacility) {
            return res.status(404).json({ message: "No facility with this id exists" });
        }

        if (prevFacility.ownerId !== authUserId) {
            return res.status(404).json({ message: "Facility cannot be updated by this user." });
        }

        const facility = await coll.updateOne({ _id: new ObjectId(id) }, { $set: {...data} });
        if (facility.acknowledged) {
            res.json({ message: "Facility updated successfully" });
        } else {
            res.status(404).json({ message: "Facility wasnt updated in the database" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Failed to update facility" });
    }
});


// ======================
//        DELETE
// ======================

// Facilities

app.delete("/api/facilities/:id", authVerify, async(req, res) => {
    const id = req.params.id;
    const {email, id: authUserId} = req.user;
    try {
        const coll = await db.collection("facilities");
        const facility = await coll.findOne({ _id: new ObjectId(id) });
        if (!facility) {
            return res.status(404).json({ message: "No facility with this id exists" });
        }

        if (facility.ownerId !== authUserId) {
            return res.status(404).json({ message: "Facility cannot be deleted by this user." });
        }

        const result = await coll.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount) {
            res.json({ message: "Facility deleted successfully" });
        } else {
            res.status(404).json({ message: "Facility failed to delete from the database" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Failed to delete facility" });
    }
});


// ======================
//         PATCH
// ======================

// bookings

app.patch("/api/bookings/:id", authVerify, async(req, resp) => {
    const data = req.body;
    const id = req.params.id;
    const {email, id: authUserId} = req.user;
    try {

        const coll = await db.collection("bookings");
        const booking = await coll.findOne({ _id: new ObjectId(id) });
        if (!booking) {
            return resp.status(404).json({ message: "No booking with this ID found." });
        }

        if (booking.ownerId !== authUserId) {
            return resp.status(404).json({ message: "Booking cannot be updated by this user." });
        }

        const result = await coll.updateOne({ _id: new ObjectId(id) }, { $set: {...data} });
        if (result.acknowledged) {
            resp.json({ message: "Booking updated successfully" });
        } else {
            resp.status(404).json({ message: "Booking wasnt updated in the database" });
        }
        if (data.status === "Cancelled") {
            await db.collection("facilities").updateOne(
                { _id: new ObjectId(booking.facility_id) },
                { $inc: { booking_count: -1 } }
            );
        }
    } catch (err) {
        console.log(err);
        resp.status(404).json({ message: "Booking to update facility" });
    }
});


// ======================
//          GET
// ======================

// auth
app.get("/api/auth/me", authVerify, async(req, res, next) => {
    try {
        const coll = await db.collection("users");
        const user = await coll.findOne({_id: new ObjectId(req.user.id)});
        return res.json(user);
    } catch(err){
        console.log(err);
        res.status(404).json({ message: "Failed to get user info" });
    }
});

app.get("/api/auth/google", passport.authenticate("google", { 
    scope: ["profile", "email"] 
}));

app.get("/api/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "http://localhost:3000/login" }),
    (req, res) => {
        const token = jwt.sign(
            { email: req.user.email, id: req.user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" }
        );
        res.cookie("token", token, { 
            httpOnly: true, sameSite: "lax", secure: false, 
            maxAge: 7 * 24 * 3600 * 1000 
        });
        res.redirect("http://localhost:3000");
    }
);


// facilities

app.get("/api/facilities", async(req, res) => {
    const query = {};
    if (req.query.search) { query.name = { $regex: req.query.search, $options: "i" }; }
    if (req.query.sport) { query.facility_type = { $in: [req.query.sport] }; }

    try {
        const coll = await db.collection("facilities");
        const facilities = await coll.find(query).toArray();
        res.json(facilities);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Failed to get all facilities" });
    }
});

app.get("/api/facilities/mine", authVerify, async(req, res) => {
    try {
        const coll = await db.collection("facilities");
        const myfac = await coll.find({ ownerId: req.user.id }).toArray();
        if (!myfac) {
            return res.status(404).json({ message: "This user has no bookings" });
        }
        res.json(myfac);
    } catch(err) {
        console.log(err);
        return res.status(404).json({ message: "Failed to fetch bookings" });
    }
});

app.get("/api/facilities/:id", authVerify, async(req, res) => {
    try {
        const id = req.params.id;
        const coll = await db.collection("facilities");
        const facility = await coll.findOne({ _id: new ObjectId(id) });
        if (!facility) {
            return res.status(404).json({ message: "No facility with this ID exists." });
        }
        res.json(facility);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Failed to fetch facility" });
    }
});

// bookings
app.get("/api/bookings", authVerify, async(req, res) => {
    try {
        const coll = await db.collection("bookings");
        const bookings = await coll.find({ ownerId: req.user.id }).toArray();
        if (!bookings) {
            return res.status(404).json({ message: "This user has no bookings." });
        }
        res.json(bookings);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Failed to fetch bookings for this user" });
    }
})

// Claude code because I Can't figure out how to fix this
module.exports = async (req, res) => {
  if (!db) {
    await launchDb();
  }
  return app(req, res);
};

if (require.main === module) {
  launchDb().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}
