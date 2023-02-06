const mongoose = require("mongoose");
const ReminderSchema = mongoose.Schema({
  message: String,
  remindAt: String,
  isReminded: Boolean,
});
const Reminder = new mongoose.model("reminder", ReminderSchema);

module.exports = Reminder;