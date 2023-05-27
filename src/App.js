import React, { useState } from 'react';
import alarmSound from './assets/alarmtone.mp3';
import notificationIcon from './assets/notification.png';
import './App.css';

function App() {
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState('');
  const [selectedMedication, setSelectedMedication] = useState('');
  const [reminders, setReminders] = useState([]);
  const [editingReminder, setEditingReminder] = useState(null);

  const handleInputChange = (event) => {
    setNewMedication(event.target.value);
  };

  const handleAddMedication = () => {
    const trimmedMedication = newMedication.trim();
    if (trimmedMedication) {
      setMedications([...medications, trimmedMedication]);
      setNewMedication('');
    }
  };

  const handleSelectMedication = (medication) => {
    setSelectedMedication(medication);
    setEditingReminder(null); // Clear editing reminder when selecting a medication
  };

  const handleDateTimeChange = (event) => {
    const dateTime = event.target.value;
    const reminder = {
      medication: selectedMedication,
      dateTime: dateTime,
      isTaken: false, // Add new property to track medication intake
    };
    if (editingReminder !== null) {
      // If editing reminder, update the existing reminder
      setReminders((prevReminders) => {
        const updatedReminders = [...prevReminders];
        updatedReminders[editingReminder] = reminder;
        return updatedReminders;
      });
      setEditingReminder(null); // Clear editing reminder after update
    } else {
      // If adding new reminder
      setReminders((prevReminders) => [...prevReminders, reminder]);
    }
    setAlarm(dateTime); // Set the alarm with the specified date and time
  };

  const setAlarm = (dateTime) => {
    const alarmDateTime = new Date(dateTime);
    const currentDateTime = new Date();
    const timeDifference = alarmDateTime.getTime() - currentDateTime.getTime();

    if (timeDifference > 0) {
      setTimeout(() => {
        showNotification(selectedMedication);
        playAlarmSound(); // Play the alarm sound
      }, timeDifference);
    }
  };

  const playAlarmSound = () => {
    const audio = new Audio(alarmSound);
    audio.play();
  };

  const handleDeleteReminder = (index) => {
    setReminders((prevReminders) => {
      const updatedReminders = [...prevReminders];
      updatedReminders.splice(index, 1);
      return updatedReminders;
    });
  };

  const handleEditReminder = (index) => {
    const reminder = reminders[index];
    setSelectedMedication(reminder.medication);
    setEditingReminder(index);
  };

  const handleMedicationTaken = (index) => {
    setReminders((prevReminders) => {
      const updatedReminders = [...prevReminders];
      updatedReminders[index].isTaken = true;
      return updatedReminders;
    });
  };

  const showNotification = (medication) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Medication Reminder`, {
        body: `Time to take ${medication}!`,
        icon: notificationIcon, // notification icon
      });
    }
  };

  // Request permission for notifications
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  return (
    <div className='App'>
      <div className='background'></div>
      <div className='container'>
        <h1>Elderly Care</h1>
        <h2>Medication Reminder</h2>

        <div className='input-section'>
          <input
            type='text'
            value={newMedication}
            onChange={handleInputChange}
            placeholder='Enter medication name'
          />
          <button onClick={handleAddMedication}>Add Medicine</button>
        </div>

        <div className='content-section'>
          <div className='medications-section'>
            <h3>Medications</h3>
            <h6
              style={{
                color: 'darkgreen',
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}
            >
              Click on a medicine to set a reminder
            </h6>
            <ul>
              {medications.map((medication, index) => (
                <li
                  key={index}
                  className={
                    selectedMedication === medication ? 'selected' : ''
                  }
                  onClick={() => handleSelectMedication(medication)}
                >
                  {medication}
                </li>
              ))}
            </ul>
          </div>

          {selectedMedication && (
            <div className='reminder-section'>
              <h3>Set Reminder for {selectedMedication}</h3>
              <input
                type='datetime-local'
                onChange={handleDateTimeChange}
                className='datetime-input'
              />
            </div>
          )}

          <div className='reminders-section'>
            <h3>Reminders</h3>
            <ul>
              {reminders.map((reminder, index) => (
                <li key={index} className='reminder-item'>
                  <div className='reminder-info'>
                    <span className='medication-name'>
                      Medication: {reminder.medication}
                    </span>
                    <span className='date-time'>
                      Date & Time: {reminder.dateTime}
                    </span>
                    <span className='status'>
                      Status: {reminder.isTaken ? 'Taken' : 'Not Taken'}
                    </span>
                  </div>
                  <div className='reminder-actions'>
                    <button onClick={() => handleEditReminder(index)}>
                      Edit
                    </button>
                    {!reminder.isTaken && (
                      <button onClick={() => handleMedicationTaken(index)}>
                        Mark as Taken
                      </button>
                    )}
                    <button onClick={() => handleDeleteReminder(index)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button onClick={requestNotificationPermission}>
          Enable Notifications
        </button>
      </div>
    </div>
  );
}

export default App;
