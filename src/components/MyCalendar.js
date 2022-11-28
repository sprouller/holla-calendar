import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";
import { useState } from "react";
import MyModal from "./MyModal";

//dnd calendar
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { useEffect } from "react";
import {
  addJobToTable,
  deleteJobFromTable,
  editJobInTable,
  fetchClients,
  fetchEmployees,
  fetchEvents,
} from "../controller/Airtable";
// moment.tz.setDefault("Etc/GMT");
const localizer = momentLocalizer(moment);

// react BasicCalendar component
const BasicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);

  //states for creating event
  const [modalStatus, setModalStatus] = useState(false);
  const [eventInput, setEventInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //state for on select event
  const [eventId, setEventId] = useState("");
  const [editStatus, setEditStatus] = useState(false);

  useEffect(() => {
    fetchEvents().then((eventsFromAirtable) => {
      setEvents(...events, eventsFromAirtable);
    });
    fetchClients().then((clientsFromAirtable) => {
      setClients(...clients, clientsFromAirtable);
    });
    fetchEmployees().then((employeesFromAirtable) => {
      setEmployees(...employees, employeesFromAirtable);
    });
  }, []);

  const handleClose = () => {
    setModalStatus(false);
    setEditStatus(false);
    setEventInput("");
  };

  const handleChange = (e) => {
    setEventInput(e.target.value);
  };

  const handleSave = (
    start,
    end,
    title,
    jobName,
    client,
    employee,
    timeAllocated
  ) => {
    // POST data to airTable
    addJobToTable(
      start,
      end,
      title,
      jobName,
      client,
      employee,
      timeAllocated
    ).then((_) => {
      fetchEvents().then((updatedEvents) => {
        setEvents([...updatedEvents]);
        setModalStatus(false);
      });

      //setEvents((events) => [...events, addedEvent]);
    });
  };

  const handleEditEvent = (e) => {
    setEventInput(e.target.value);
  };

  const handleEdited = (
    start,
    end,
    jobName,
    client,
    employee,
    timeAllocated
  ) => {
    editJobInTable(
      eventId,
      start,
      end,
      jobName,
      client,
      employee,
      timeAllocated
    ).then((_) => {
      fetchEvents().then((updatedEvents) => {
        setEvents([...updatedEvents]);
        setModalStatus(false);
        setEditStatus(false);
        setEventInput("");
      });
    });
  };

  // on delete event handler
  const handleDelete = () => {
    deleteJobFromTable(eventId).then((_) => {
      fetchEvents().then((updatedEvents) => {
        setEvents([...updatedEvents]);
        setModalStatus(false);
        setEditStatus(false);
        setEventInput("");
      });
    });
  };

  //slot select handler
  const handleSlotSelectEvent = (slotInfo) => {
    setStartDate(new Date(`${slotInfo.start}`));
    setEndDate(new Date(`${slotInfo.end}`));
    setModalStatus(true);
    setEventInput("");
  };

  //move event handler
  const moveEventHandler = ({ event, start, end }) => {
    let updatedEvents = [];
    updatedEvents = events.filter((e) => {
      return e.id !== event.id;
    });
    setEvents([
      ...updatedEvents,
      {
        id: `${event.id}`,
        title: `${event.title}`,
        start: new Date(`${start}`),
        end: new Date(`${end}`),
      },
    ]);
  };

  //resize event handler
  const resizeEventHandler = ({ event, start, end }) => {
    let updatedEvents = [];
    updatedEvents = events.filter((e) => {
      return e.id !== event.id;
    });
    setEvents([
      ...updatedEvents,
      {
        id: `${event.id}`,
        title: `${event.title}`,
        start: new Date(`${start}`),
        end: new Date(`${end}`),
      },
    ]);
  };

  //on select event handler
  const hanldeOnSelectEvent = (e) => {
    setEditStatus(true);
    setStartDate(new Date(`${e.start}`));
    setEndDate(new Date(`${e.end}`));
    setEventInput(e.title);
    setEventId(e.id);
    setModalStatus(true);
  };

  // console.log("events: ", events);
  // console.log("clients: ", clients);
  // console.log("employees: ", employees);

  const selectedEvent =
    events.length &&
    events.find((event) => {
      return event.id === eventId;
    });

  console.log("events: ", events);

  return (
    <div className="my-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor={(e) => {
          if (!e) return "end";
          const addOneDay = new Date();
          addOneDay.setDate(new Date(e.end).getDate() + 1);
          return addOneDay;
        }}
        allDayAccessor={true}
        selectable
        //event trigger after clicking any slot
        onSelectSlot={handleSlotSelectEvent}
        //event trigger after clicking any event
        onSelectEvent={hanldeOnSelectEvent}
        //event for drag and drop
        onEventDrop={moveEventHandler}
        //event trigger hen resizing any event
        resizable
        onEventResize={resizeEventHandler}
        // onSelecting={slot => false}
        longPressThreshold={10}
      />
      <MyModal
        modalStatus={modalStatus}
        handleClose={handleClose}
        handleSave={handleSave}
        handleChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        eventInput={eventInput}
        event={selectedEvent}
        handleEditEvent={handleEditEvent}
        handleEdited={handleEdited}
        editStatus={editStatus}
        handleDelete={handleDelete}
        clients={clients}
        employees={employees}
      />
    </div>
  );
};

export default BasicCalendar;
