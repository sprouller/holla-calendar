import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useState } from "react";
import MyModal from "./MyModal";
import axios from "axios";

//dnd calendar
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { useEffect } from "react";
import { addJobToTable } from "../controller/Airtable";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

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
    function fetchEvents() {
      const jobsTableId = process.env.REACT_APP_JOBS_TABLE_ID;
      axios({
        method: "get",
        url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${jobsTableId}`,
        headers: {
          authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
      }).then((response) => {
        const fetchedEvents = response.data.records;

        const formattedEvents = fetchedEvents.map((event) => {
          const { client_name, job_name, employee_first_name } = event.fields;
          const displayTitle = `Client: ${client_name} | Job: ${job_name} | ${employee_first_name}`;
          return {
            id: event.id,
            title: displayTitle,
            start: new Date(event.fields.start_date),
            end: new Date(event.fields.end_date),
          };
        });
        setEvents(...events, formattedEvents);
      });
    }

    function fetchClients() {
      const clientsTableId = process.env.REACT_APP_CLIENTS_TABLE_ID;
      axios({
        method: "get",
        url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${clientsTableId}`,
        headers: {
          authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
      }).then((response) => {
        const fetchedClients = response.data.records;

        const formattedClients = fetchedClients.map((client) => {
          const { name, client_since, jobs } = client.fields;
          return {
            id: client.id,
            name,
            jobs,
            client_since,
          };
        });
        setClients(...clients, formattedClients);
      });
    }
    function fetchEmployees() {
      const employeesTableId = process.env.REACT_APP_EMPLOYEES_TABLE_ID;
      axios({
        method: "get",
        url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${employeesTableId}`,
        headers: {
          authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
      }).then((response) => {
        const fetchedEmployees = response.data.records;

        const formattedEmployees = fetchedEmployees.map((employee) => {
          const { first_name, surname, colour, jobs } = employee.fields;
          return {
            id: employee.id,
            first_name,
            surname,
            colour,
            jobs,
          };
        });
        setEmployees(...employees, formattedEmployees);
      });
    }
    fetchEmployees();
    fetchClients();
    fetchEvents();
  }, []);

  const handleClose = () => {
    setModalStatus(false);
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
    ).then((addedEvent) => {
      console.log("added event: ", addedEvent);
      setModalStatus(false);
      // setResult(result => [...result, response]);
      setEvents((events) => [...events, addedEvent]);
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

  const handleEditEvent = (e) => {
    setEventInput(e.target.value);
  };
  const handleEdited = (e) => {
    setModalStatus(false);
    let updatedEvents = [];
    if (eventInput) {
      updatedEvents = events.filter((e) => {
        return e.id !== eventId;
      });
      setEvents([
        ...updatedEvents,
        {
          id: `${eventId}`,
          title: `${eventInput}`,
          start: new Date(`${startDate}`),
          end: new Date(`${endDate}`),
        },
      ]);
    } else {
      updatedEvents = events.filter((e) => {
        return e.id !== eventId;
      });
      setEvents([...updatedEvents]);
    }
    setEditStatus(false);
    setEventInput("");
  };

  // on delete event handler
  const handleDelete = () => {
    let updatedEvents = [];
    updatedEvents = events.filter((e) => {
      return e.id !== eventId;
    });
    setEvents([...updatedEvents]);
    setModalStatus(false);
    setEventInput("");
  };

  console.log("events: ", events);
  console.log("clients: ", clients);
  console.log("employees: ", employees);

  return (
    <div className="my-calendar">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
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
