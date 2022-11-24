import axios from "axios";

export const addJobToTable = (
  start,
  end,
  title,
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
  }).then((response) => {
    console.log("response", response);
    const fetchedEvent = response.data;
    const fields = fetchedEvent.fields;
    const displayTitle = `Client: ${fields.client_name[0]} | Job: ${fields.job_name} | ${fields.employee_first_name[0]}`;
    const formattedEvent = {
      id: fetchedEvent.id,
      title: displayTitle,
      start: new Date(fetchedEvent.fields.start_date),
      end: new Date(fetchedEvent.fields.end_date),
    };
    console.log("formattedEvent: ", formattedEvent);
    return formattedEvent;
  });
};

//response.data
/*
{
    "id": "recJVogD00SUyBXT2",
    "createdTime": "2022-11-24T00:27:18.000Z",
    "fields": {
        "id": 11,
        "job_name": "another",
        "start_date": "2022-11-17",
        "end_date": "2022-11-19",
        "time_allocated": 5,
        "status": "Closed",
        "employee": [
            "recHcnNS2mgR5j5nf"
        ],
        "client": [
            "recZ1PJSTPf2W6HHA"
        ],
        "created_at": "2022-11-24T00:27:18.000Z",
        "employee_first_name": [
            "Employee2"
        ],
        "client_name": [
            "Client 3"
        ]
    }
}
*/
