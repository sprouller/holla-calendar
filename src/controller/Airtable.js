import axios from "axios";
import Airtable from "airtable";

var base = new Airtable({ apiKey: process.env.REACT_APP_API_KEY }).base(
  "appZSbj9h1nqMu4gX"
);

export async function fetchSprints() {
  const sprintsTableId = process.env.REACT_APP_SPRINTS_TABLE_ID;
  const sprints = await base(sprintsTableId)
    .select({
      view: "Grid view",
    })
    .all();
  console.log("airtable");
  console.log({ sprints });
  return sprints.map((sprint) => {
    let sprintObj = {
      id: sprint.get("id"),
      start: sprint.get("start_date"),
      end: sprint.get("end_date"),
      title: "Default Title",
      employee: {
        id: sprint.get("Employees")[0],
        firstName: sprint.get("first_name (from Employees)")[0],
        surname: sprint.get("surname (from Employees)")[0],
        colour: sprint.get("colour (from Employees)")[0],
      },
      job: {
        id: sprint.get("Jobs")[0],
        name: sprint.get("job_name (from Jobs)")[0],
        timeAllocated: sprint.get("time_allocated (from Jobs)")[0],
        client: {
          id: sprint.get("Clients (from Jobs)")[0],
          name: sprint.get("name (from Clients) (from Jobs)")[0],
        },
      },
    };
    sprintObj.title = `Client: ${sprintObj.job.client.name} | Job: ${sprintObj.job.name} | ${sprintObj.employee.firstName}`;
    return sprintObj;
  });
}

export async function fetchEmployees() {
  const employeesTableId = process.env.REACT_APP_EMPLOYEES_TABLE_ID;
  const employees = await base(employeesTableId).select().all();
  return employees.map((employee) => {
    return {
      id: employee.get("id"),
      firstName: employee.get("first_name"),
      surname: employee.get("surname"),
      colour: employee.get("colour"),
    };
  });
}

export async function fetchClients() {
  const clientsTableId = process.env.REACT_APP_CLIENTS_TABLE_ID;
  const clients = await base(clientsTableId).select().all();
  return clients.map((client) => {
    return {
      id: client.get("id"),
      name: client.get("name"),
    };
  });
}

export async function fetchWorkItemsByJobId(jobId) {
  const workItemsTableId = process.env.REACT_APP_WORK_ITEMS_TABLE_ID;
  const workItems = await base(workItemsTableId)
    .select({
      filterByFormula: `{Jobs (from sprint)} = '${jobId}'`,
    })
    .all();
  console.log("Airtable");
  console.log({ workItems });
  return workItems.map((workItem) => {
    return {
      id: workItem.get("id"),
      dateOfWork: workItem.get("date_of_work"),
      hours: workItem.get("hours"),
      employee: {
        id: workItem.get("Employees (from sprint)")[0],
        firstName: workItem.get("first_name (from Employees) (from sprint)")[0],
        surname: workItem.get("surname (from Employees) (from sprint)")[0],
        colour: workItem.get("colour (from Employees) (from sprint)")[0],
      },
    };
  });
}

export async function addJobAndSprintToAirtable(job, sprint) {
  let { jobName, clientId, timeAllocated } = job;
  let { employeeId, start, end } = sprint;
  try {
    let returnedJobRecord = await base(
      process.env.REACT_APP_JOBS_TABLE_ID
    ).create({
      job_name: jobName,
      time_allocated: timeAllocated,
      status: "Closed",
      Clients: [clientId],
    });
    let jobId = returnedJobRecord.getId();
    console.log(`job ${jobId} added to Airtable. Adding sprint now...`);
    let returnedSprintRecord = await base(
      process.env.REACT_APP_SPRINTS_TABLE_ID
    ).create({
      start_date: start,
      end_date: end,
      Employees: [employeeId],
      Jobs: [jobId],
    });
    console.log(`sprint ${returnedSprintRecord.getId()} added to Airtable`);
  } catch (error) {
    console.log(error);
  }
}

export const addWorkItemToAirtable = async (sprintId, date, hours) => {
  const workItemToAdd = {
    date_of_work: date,
    hours: hours,
    sprint: [sprintId],
  };
  try {
    let createdWorkItem = await base(
      process.env.REACT_APP_WORK_ITEMS_TABLE_ID
    ).create(workItemToAdd);
    console.log({ createdWorkItem });
    return createdWorkItem;
  } catch (error) {
    console.log({ error });
  }
};

// export const addTimeToTimeTrackingTable = (jobId, date, hours) => {
//   const timeToAdd = {
//     fields: {
//       created_at: new Date(),
//       date_of_work: date,
//       hours: 5,
//       job: [jobId],
//     },
//   };
//   console.log({ timeToAdd });
//   const timeTrackingTableId = process.env.REACT_APP_TIME_TRACKING_TABLE_ID;
//   return axios({
//     method: "post",
//     url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${timeTrackingTableId}`,
//     headers: {
//       authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
//     },
//     data: timeToAdd,
//   });
// };

export const editSprintInTable = async (sprintData) => {
  const { sprintId, start, end, employeeId } = sprintData;
  const sprint = {
    id: sprintId,
    fields: {
      start_date: start,
      end_date: end,
      Employees: [employeeId],
    },
  };
  const sprintsTableId = process.env.REACT_APP_SPRINTS_TABLE_ID;
  try {
    return await base(sprintsTableId).update(sprint.id, sprint.fields);
  } catch (error) {
    console.log({ error });
  }
};

export const editJobInTable = async (jobData) => {
  const { jobId, jobName, clientId, timeAllocated } = jobData;
  const job = {
    id: jobId,
    fields: {
      job_name: jobName,
      time_allocated: timeAllocated,
      status: "Closed",
      Clients: [clientId],
    },
  };
  const jobsTableId = process.env.REACT_APP_JOBS_TABLE_ID;
  try {
    return await base(jobsTableId).update(job.id, job.fields);
  } catch (error) {
    console.log({ error });
  }
};

// export const editJobInTable = (
//   eventId,
//   start,
//   end,
//   jobName,
//   client,
//   employee,
//   timeAllocated
// ) => {
//   const job = {
//     id: eventId,
//     fields: {
//       job_name: jobName,
//       client: [client],
//       start_date: start,
//       end_date: end,
//       time_allocated: parseInt(timeAllocated, 10),
//       //status: "Closed",
//       employee: [employee],
//     },
//   };
//   const jobsTableId = process.env.REACT_APP_JOBS_TABLE_ID;
//   return axios({
//     method: "patch",
//     url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${jobsTableId}`,
//     headers: {
//       authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
//     },
//     data: { records: [job] },
//   });
// };

export const deleteJobFromTable = (id) => {
  const jobsTableId = process.env.REACT_APP_JOBS_TABLE_ID;
  return axios({
    method: "delete",
    url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${jobsTableId}/${id}`,
    headers: {
      authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  });
};
