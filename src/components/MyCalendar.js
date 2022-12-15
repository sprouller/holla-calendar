import { Calendar, momentLocalizer } from "react-big-calendar";
import { useState } from "react";
import moment from "moment";
import moment_timezone from "moment-timezone";
import AddEventModal from "./AddEventModal";
import ViewSprintModal from "./ViewSprintModal";
import EditModal from "./EditModal";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { useEffect } from "react";
import {
  addJobAndSprintToAirtable,
  addSprintToExistingJobInTable,
  deleteJobFromTable,
  deleteSprintFromTable,
  editJobInTable,
  editSprintInTable,
  fetchClients,
  fetchEmployees,
  fetchSprints,
} from "../controller/Airtable";

moment.tz.setDefault("Etc/GMT");
const localizer = momentLocalizer(moment);
localizer.segmentOffset = 0;

const DnDCalendar = withDragAndDrop(Calendar);

// react BasicCalendar component
const BasicCalendar = () => {
  const [sprints, setSprints] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);

  //states for creating event
  const [modalState, setModalState] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //state for on select event
  const [sprintId, setSprintId] = useState("");
  const [altKeyDown, setAltKeyDown] = useState(false);

  useEffect(() => {
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
  // console.log({ employees });
  // console.log({ clients });

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
    setModalState("close");
  };

  const handleScheduleJob = async (job, sprint) => {
    console.log("handleScheduleJob");
    console.log({ sprint, job });
    await addJobAndSprintToAirtable(job, sprint);
    fetchSprints().then((sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
      setModalState("close");
    });
  };

  const handleEditSprintAndJob = async (sprintData, jobData) => {
    console.log("handleEditSprintAndJob");
    console.log({ sprintData, jobData });
    await editSprintInTable(sprintData);
    await editJobInTable(jobData);
    fetchSprints().then((sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
      setModalState("view-modal");
    });
  };

  const handleDeleteSprint = async (sprintId) => {
    let jobId = selectedSprint.job.id;
    let shouldDeleteJob = false;
    if (sprints.filter((sprint) => sprint.job.id === jobId).length <= 1) {
      alert(
        "This is the last sprint in the job. Deleting this sprint also deletes the job."
      );
      shouldDeleteJob = true;
    }
    try {
      await deleteSprintFromTable(sprintId);
      if (shouldDeleteJob) {
        await deleteJobFromTable(jobId);
      }
      fetchSprints().then(async (sprintsFromAirtable) => {
        setSprints(sprintsFromAirtable);
        setModalState("close");
      });
    } catch (error) {
      console.error(error);
    }
  };

  // handles when a day is clicked (without event)
  const handleSlotSelectEvent = (slotInfo) => {
    setStartDate(new Date(`${slotInfo.start}`));
    setEndDate(new Date(`${slotInfo.end}`));
    setModalState("add-modal");
  };

  //move event handler
  const moveEventHandler = async ({ event: sprint, start, end }) => {
    // let sprint = event;
    let sprintId = sprint.id;
    console.log({ sprint });
    let endDate = new Date(end);
    let minusOneEnd = new Date(end);
    minusOneEnd.setDate(endDate.getDate() - 1);
    let sprintData = {
      sprintId,
      start_date: start,
      end_date: minusOneEnd,
      employeeId: sprint.employee.id,
    };
    try {
      if (altKeyDown) {
        console.log("dnd sprint duplicate!");
        await addSprintToExistingJobInTable(sprintData, sprint.job.id);
      } else {
        console.log("dnd sprint edit!");
        const tempSprints = sprints.filter((sprint) => sprint.id !== sprintId);
        setSprints(tempSprints);
        await editSprintInTable(sprintData);
      }
    } catch (error) {
      console.error(error);
    }
    fetchSprints().then(async (sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
    });
  };

  //resize event handler
  // const resizeEventHandler = ({ event, start, end }) => {
  //   let updatedEvents = [];
  //   updatedEvents = events.filter((e) => {
  //     return e.id !== event.id;
  //   });
  //   setEvents([
  //     ...updatedEvents,
  //     {
  //       id: `${event.id}`,
  //       title: `${event.title}`,
  //       start: new Date(`${start}`),
  //       end: new Date(`${end}`),
  //     },
  //   ]);
  // };

  //on select event handler
  const hanldeOnSelectEvent = (e) => {
    console.log({ e });
    setStartDate(new Date(`${e.start}`));
    setEndDate(new Date(`${e.end}`));
    setSprintId(e.id);
    setModalState("view-modal");
  };

  const selectedSprint =
    sprints.length &&
    sprints.find((sprint) => {
      return sprint.id === sprintId;
    });

  console.log({ selectedSprint });

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
        startAccessor={(e) => {
          let startDate = new Date(e.start);
          return startDate;
          // if (!e) return "start";
          // console.log({ e });
          // let startDate = new Date(e.start);
          // console.log({ startDate });
          // return startDate;
        }}
        endAccessor={(e) => {
          let addOneDay = new Date(e.end);
          addOneDay.setDate(addOneDay.getDate() + 1);
          return addOneDay;
          //return endDate;
          // if (!e) return "end";
          // const addOneDay = new Date();
          // let endDate = new Date(e.end);
          // addOneDay.setDate(endDate.getDate() + 1);
          // return addOneDay;
        }}
        allDayAccessor="allDay"
        selectable
        onSelectSlot={handleSlotSelectEvent}
        onSelectEvent={hanldeOnSelectEvent}
        onEventDrop={moveEventHandler}
        resizable={false}
        // onEventResize={resizeEventHandler}
        // onSelecting={slot => false}
        longPressThreshold={10}
      />
      <AddEventModal
        modalState={modalState}
        startDate={startDate}
        endDate={endDate}
        clients={clients}
        employees={employees}
        handleClose={handleClose}
        handleScheduleJob={handleScheduleJob}
      />
      <ViewSprintModal
        modalState={modalState}
        sprint={selectedSprint}
        employees={employees}
        setModalState={setModalState}
        handleClose={handleClose}
        handleDeleteSprint={handleDeleteSprint}
      />
      <EditModal
        modalState={modalState}
        sprint={selectedSprint}
        startDate={startDate}
        endDate={endDate}
        clients={clients}
        employees={employees}
        setModalState={setModalState}
        handleClose={handleClose}
        handleEditSprintAndJob={handleEditSprintAndJob}
      />
    </div>
  );
};

export default BasicCalendar;
