import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import axios from "axios";
import "./App.css";

function App() {
  const [reminderMsg, setReminderMsg] = useState("");
  const [remindAt, setRemindAt] = useState();
  const [reminderList, setreminderList] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:9000/get/reminders")
      .then((res) => setreminderList(res.data));
  }, [reminderMsg]);
  const AddReminderMsg = () => {
    if (!reminderMsg =="") {
       axios
         .post("http://localhost:9000/add/reminder", { reminderMsg, remindAt })
         .then((res) => setreminderList(res));
       setReminderMsg("");
       setRemindAt();
    }
   
  };
  const deleteReminder = (id) => {
    axios
      .post("http://localhost:9000/delete/reminder", { id })
      .then((res) => setreminderList(res));
    
  };
  return (
    <div className="App">
      <div className="homepage">
        <div className="homepage_header">
          <h1>Remind Me 🙋‍♂️</h1>
          <form onSubmit={AddReminderMsg}>
            <input
              type="text"
              placeholder="Reminder notes here..."
              value={reminderMsg}
              onChange={(e) => setReminderMsg(e.target.value)}
            />
            <DateTimePicker
              value={remindAt}
              onChange={setRemindAt}
              minDate={new Date()}
              minutePlaceholder="mm"
              hourPlaceholder="hh"
              dayPlaceholder="DD"
              monthPlaceholder="MM"
              yearPlaceholder="YYYY"
            />
            <button type="submit" className="btn btn-outline-dark">
              Add Reminder
            </button>
          </form>
        </div>

        <div className="homepage_body">
          {reminderList.map((reminder) => (
            <div className="reminder_card bg-warning" key={reminder._id}>
              <h2>{reminder.reminderMsg}</h2>
              <h3>Remind Me at:</h3>
              <p>{reminder.remindAt}</p>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={()=>deleteReminder(reminder._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
