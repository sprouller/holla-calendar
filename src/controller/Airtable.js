import axios from "axios";

export function fetchEvents() {
  const jobsTableId = process.env.REACT_APP_JOBS_TABLE_ID;
  return axios({
    method: "get",
    url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${jobsTableId}`,
    headers: {
      authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  }).then((response) => {
    const fetchedEvents = response.data.records;

    return fetchedEvents.map((event) => {
      const { client_name, job_name, employee_first_name } = event.fields;
      const displayTitle = `Client: ${client_name} | Job: ${job_name} | ${employee_first_name}`;
      return {
        id: event.id,
        title: displayTitle,
        start: event.fields.start_date,
        end: event.fields.end_date,
        jobName: event.fields.job_name,
        client: {
          id: event.fields.client[0],
          name: event.fields.client_name[0],
        },
        employee: {
          id: event.fields.employee[0],
          firstName: event.fields.employee_first_name[0],
          surname: event.fields.employee_surname[0],
        },
        timeAllocated: event.fields.time_allocated,
      };
    });
  });
}

export function fetchClients() {
  const clientsTableId = process.env.REACT_APP_CLIENTS_TABLE_ID;
  return axios({
    method: "get",
    url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${clientsTableId}`,
    headers: {
      authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  }).then((response) => {
    const fetchedClients = response.data.records;

    return fetchedClients.map((client) => {
      const { name, client_since, jobs } = client.fields;
      return {
        id: client.id,
        name,
        jobs,
        client_since,
      };
    });
  });
}

export function fetchEmployees() {
  const employeesTableId = process.env.REACT_APP_EMPLOYEES_TABLE_ID;
  return axios({
    method: "get",
    url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${employeesTableId}`,
    headers: {
      authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  }).then((response) => {
    const fetchedEmployees = response.data.records;

    return fetchedEmployees.map((employee) => {
      const { first_name, surname, colour, jobs } = employee.fields;
      return {
        id: employee.id,
        first_name,
        surname,
        colour,
        jobs,
      };
    });
  });
}

export const addJobToTable = (
  start,
  end,
  jobName,
  client,
  employee,
  timeAllocated
) => {
  const job = {
    fields: {
      job_name: jobName,
      client: [client],
      start_date: start,
      end_date: end,
      time_allocated: parseInt(timeAllocated, 10),
      status: "Closed",
      employee: [employee],
    },
  };
  const jobsTableId = process.env.REACT_APP_JOBS_TABLE_ID;
  return axios({
    method: "post",
    url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${jobsTableId}`,
    headers: {
      authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
    data: job,
  });
  // .then((response) => {
  //   const fetchedEvent = response.data;
  //   const fields = fetchedEvent.fields;
  //   const displayTitle = `Client: ${fields.client_name[0]} | Job: ${fields.job_name} | ${fields.employee_first_name[0]}`;
  //   const formattedEvent = {
  //     id: fetchedEvent.id,
  //     title: displayTitle,
  //     start: new Date(fetchedEvent.fields.start_date),
  //     end: new Date(fetchedEvent.fields.end_date),
  //   };
  //   return formattedEvent;
  //   fetchEvents();
  // });
};

export const editJobInTable = (
  eventId,
  start,
  end,
  jobName,
  client,
  employee,
  timeAllocated
) => {
  const job = {
    id: eventId,
    fields: {
      job_name: jobName,
      client: [client],
      start_date: start,
      end_date: end,
      time_allocated: parseInt(timeAllocated, 10),
      //status: "Closed",
      employee: [employee],
    },
  };
  console.log(job);
  const jobsTableId = process.env.REACT_APP_JOBS_TABLE_ID;
  return axios({
    method: "patch",
    url: `https://api.airtable.com/v0/appZSbj9h1nqMu4gX/${jobsTableId}`,
    headers: {
      authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
    data: { records: [job] },
  });
};

//response.data
/*
"records": [
    {
      "id": "recbAngApDPwVv4ju",
      "fields": {
        "job_name": "Job 1",
        "client": [
          "recbncvmVfMbEDNtr"
        ],
        "start_date": "2022-11-01T07:00:00.000Z",
        "end_date": "2022-11-08T08:00:00.000Z",
        "time_allocated": 5,
        "status": "Closed",
        "employee": [
          "recS2YiW7Go7G29vA"
        ]
      }
    },
*/
