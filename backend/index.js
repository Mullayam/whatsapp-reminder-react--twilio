require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Reminder = require("./models/reminder");
//APP SETUP
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
//twilio
const accountSid = "AC81200d42822afd2a0b7bc6bd185b79ff";
const authToken = "authToken";
const client = require("twilio")(accountSid, authToken);

setInterval(() => {
  Reminder.find({}, (err, info) => {
    if (err) {
      console.log(err);
    }
  if (info)
    info.forEach((element) => {
     if (!element.isReminded) {
       const now = new Date();
       if (new Date(element.remindAt) - now < 0) {
         Reminder.findByIdAndUpdate(
           element._id,
           { isReminded: true },
           (error, data) => {
             if (error) {
               console.log(error);
             }
             client.messages
               .create({
                 body: element.message,
                 from: "whatsapp:+14155238886",
                 to: "whatsapp:+919306373743",
               })
               .then((message) => console.log(message.sid))
               .done();
           }
         );
       }
     }
    });{}
  });
}, 5000);

//DB CONNECTION
const DB_URL =
  "mongodb+srv://mullayam06:LNA75QfqCmVDiaBl@cluster0.68i99bx.mongodb.net/reminderApp";
// mongoose.set('strictQuery',true)
mongoose.connect(
  DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("DB DOne")
);

app.get("/", (req, res) => {
  res.send("hii from ackeknd");
});
app.get("/get/reminders", (req, res) => {
  Reminder.find({}, (err, info) => {
    if (err) {
      console.log(err);
    }
    res.send(info);
  });
});
app.post("/add/reminder", async (req, res) => {
  const { reminderMsg, remindAt } = req.body;
  const AddReminderMsg = new Reminder({
    message: reminderMsg,
    remindAt: remindAt,
    isReminded: false,
  });

  await AddReminderMsg.save((err) => {
    if (err) {
      console.log(err);
    }
    Reminder.find({}, (err, info) => {
      if (err) {
        console.log(err);
      }
      res.send(info);
    });
  });
});
app.post("/delementte/reminder", (req, res) => {
  Reminder.delementteOne({ _id: req.body.id }, () => {
    Reminder.find({}, (err, info) => {
      if (err) {
        console.log(err);
      }
      Reminder.find({}, (err, info) => {
        if (err) {
          console.log(err);
        }
        res.send(info);
      });
    });
  });
});
app.get("/delementte/all", (req, res) => {});
app.listen(9000, () => {
  console.log("http://localhost:9000");
});
