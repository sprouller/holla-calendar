import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";
import { useState } from "react";
import MyModal from "./MyModal";
import AddEventModal from "./AddEventModal";
import ViewEventModal from "./ViewEventModal";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { useEffect } from "react";
import {
  addJobAndSprintToAirtable,
  addJobToTable,
  addTimeToTimeTrackingTable,
  deleteJobFromTable,
  editJobInTable,
  fetchClients,
  fetchEmployees,
  fetchEvents,
  fetchSprints,
  fetchTimeTrackingInfoByJobId,
} from "../controller/Airtable";

// moment.tz.setDefault("Etc/GMT");
const localizer = momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(Calendar);

// react BasicCalendar component
const BasicCalendar = () => {
  const [sprints, setSprints] = useState([]);
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);

  //states for creating event
  const [addEventModalStatus, setAddEventModalStatus] = useState(false);
  const [viewEventModalStatus, setViewEventModalStatus] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [eventInput, setEventInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //state for on select event
  const [eventId, setEventId] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [altKeyDown, setAltKeyDown] = useState(false);

  useEffect(() => {
    // fetchEvents().then((eventsFromAirtable) => {
    //   setEvents(...events, eventsFromAirtable);
    // });
    fetchSprints().then((sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
    });
    fetchClients().then((clientsFromAirtable) => {
      setClients(clientsFromAirtable);
    });
    fetchEmployees().then((employeesFromAirtable) => {
      setEmployees(employeesFromAirtable);
    });
  }, []);

  console.log({ sprints });
  console.log({ employees });
  console.log({ clients });

  // Attach event listeners to the window object to listen for keydown and keyup events
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // Event handler for keydown events
  function handleKeyDown(event) {
    // If the shift key is pressed, update the state
    if (event.key === "Alt") {
      setAltKeyDown(true);
    }
  }

  // Event handler for keyup events
  function handleKeyUp(event) {
    console.log({ event });
    // If the shift key is released, update the state
    if (event.key === "Alt") {
      setAltKeyDown(false);
    }
  }

  const handleClose = () => {
    setModalStatus(false);
    setAddEventModalStatus(false);
    setViewEventModalStatus(false);
    setEditStatus(false);
    setEventInput("");
  };

  const handleChange = (e) => {
    setEventInput(e.target.value);
  };

  const handleEditEvent = (e) => {
    setEventInput(e.target.value);
  };

  const handleScheduleJob = async (job, sprint) => {
    console.log("handleScheduleJob");
    console.log({ sprint, job });
    await addJobAndSprintToAirtable(job, sprint);
    fetchSprints().then((sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
    });
    // setEventInput(e.target.value);
  };

  const handleSave = (start, end, jobName, client, employee, timeAllocated) => {
    // POST data to airTable
    console.log("handleSave");
    console.log({
      start,
      end,
      jobName,
      client,
      employee,
      timeAllocated,
    });
    addJobToTable(start, end, jobName, client, employee, timeAllocated).then(
      (_) => {
        fetchEvents().then((updatedEvents) => {
          setEvents([...updatedEvents]);
          setAddEventModalStatus(false);
        });
        //setEvents((events) => [...events, addedEvent]);
      }
    );
  };

  const handleAddTimeToJob = (jobId, date, hours) => {
    console.log("handleAddTimeToJob");
    console.log({ jobId, date, hours });
    addTimeToTimeTrackingTable(jobId, date, hours).then((_) => {
      // fetchEvents().then((updatedEvents) => {
      //   setEvents([...updatedEvents]);
      //   setAddEventModalStatus(false);
      // });
      console.log("finished adding time");
    });
  };

  // handles editing an event
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

  // handles deleting an event
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

  // handles when a day is clicked (without event)
  const handleSlotSelectEvent = (slotInfo) => {
    setStartDate(new Date(`${slotInfo.start}`));
    setEndDate(new Date(`${slotInfo.end}`));
    setAddEventModalStatus(true);
    setEventInput("");
  };

  //move event handler
  const moveEventHandler = ({ event, start, end }) => {
    // let updatedEvents = [];
    // updatedEvents = events.filter((e) => {
    //   return e.id !== event.id;
    // });
    let { jobName, client, employee, timeAllocated } = event;
    console.log({ event });
    if (altKeyDown) {
      console.log("save it!");
      handleSave(
        start.toLocaleDateString(),
        end.toLocaleDateString(),
        jobName,
        client.id,
        employee.id,
        timeAllocated
      );
    }
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
    //setEditStatus(true);
    setStartDate(new Date(`${e.start}`));
    setEndDate(new Date(`${e.end}`));
    //setEventInput(e.title);
    setEventId(e.id);
    console.log(`selected event: ${e}`);
    //setModalStatus(true);
    setViewEventModalStatus(true);
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
      <div>
        {/* Display a message indicating whether the shift key is being held down or not */}
        <p>Alt key is {altKeyDown ? "down" : "up"}</p>
      </div>
      <DnDCalendar
        localizer={localizer}
        events={sprints}
        views={["month"]}
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
        resizable={false}
        onEventResize={resizeEventHandler}
        // onSelecting={slot => false}
        longPressThreshold={10}
      />
      {/* <MyModal
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
      /> */}
      <AddEventModal
        addEventModalStatus={addEventModalStatus}
        handleClose={handleClose}
        handleSave={handleSave}
        startDate={startDate}
        endDate={endDate}
        clients={clients}
        employees={employees}
        handleScheduleJob={handleScheduleJob}
      />
      <ViewEventModal
        viewEventModalStatus={viewEventModalStatus}
        handleClose={handleClose}
        event={selectedEvent}
        employees={employees}
        handleAddTimeToJob={handleAddTimeToJob}
      />
    </div>
  );
};

export default BasicCalendar;
