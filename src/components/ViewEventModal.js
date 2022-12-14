import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import CloseButton from "react-bootstrap/CloseButton";
import { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { fetchTimeTrackingInfoByJobId } from "../controller/Airtable";

function ViewEventModal({
  viewEventModalStatus,
  handleClose,
  event,
  handleAddTimeToJob,
  clients,
  employees,
}) {
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [hours, setHours] = useState(0);
  const [employee, setEmployee] = useState((event && event.employee) || "");
  const [timeTrackingLineItems, setTimeTrackingLineItems] = useState([]);

  useEffect(() => {
    if (!event) return;
    console.log("called set Employee event is ", event);
    setEmployee((event && event.employee) || "");

    console.log(`fetching timeTrack records for job ${event.id}`);
    fetchTimeTrackingInfoByJobId(event.id).then((response) => {
      console.log(`event.id: ${event.id}`);
      response.eachPage((records, fetchNextPage) => {
        console.log("Page of records: ", records);
        const timeTrackingRecords = records.map((record) => {
          return {
            employee_first_name: record.fields.employee_first_name_from_job[0],
            date_of_work: record.fields.date_of_work,
            hours: record.fields.hours,
          };
        });
        setTimeTrackingLineItems(timeTrackingRecords);
        //fetchNextPage();
      });
    });
  }, [event]);

  console.log({ timeTrackingLineItems });

  if (!event)
    return (
      <>
        <Modal>No Job Data</Modal>
      </>
    );

  console.log({ event });

  return (
    <>
      <Modal
        show={viewEventModalStatus}
        onHide={handleClose}
        centered
        className="view-event-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{event.jobName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="jobInformation"
            id="view-event-modal-tabs"
            className="mb-3"
          >
            <Tab eventKey="jobInformation" title="Job Information">
              <Row className="mb-2">
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Client: </strong>
                    <div>{event.client.name}</div>
                  </Stack>
                </Col>
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Job Code:</strong>
                    <div>{"DIAXXXX"}</div>
                  </Stack>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Sub Brand: </strong>
                    <div>{"subbrand"}</div>
                  </Stack>
                </Col>
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Job Name:</strong>
                    <div>{event.jobName}</div>
                  </Stack>
                </Col>
              </Row>
              <hr></hr>
              <Row className="mb-2">
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Date From: </strong>
                    <div>{event.start}</div>
                  </Stack>
                </Col>
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Date To:</strong>
                    <div>{event.end}</div>
                  </Stack>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Time Allocated: </strong>
                    <div>{event.timeAllocated} hours</div>
                  </Stack>
                </Col>
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Employee:</strong>
                    <div>{event.employee.firstName}</div>
                  </Stack>
                </Col>
              </Row>
              <Row className="p-2">
                <Alert variant="secondary">
                  <div>{"Description here"}</div>
                </Alert>
              </Row>
            </Tab>
            <Tab eventKey="timeTracking" title="Time Tracking">
              <Row>
                <Col>
                  <Form>
                    <Form.Group
                      className="mb-2"
                      controlId="addTimeFormEmployee"
                    >
                      <Form.Label className="mb-0">
                        <strong>Employee:</strong>
                      </Form.Label>
                      <Form.Select
                        disabled
                        defaultValue={event.employee.id}
                        onChange={(e) => {
                          setEmployee(e.target.value);
                        }}
                        aria-label="Select Employee"
                      >
                        {employees &&
                          employees.map((employee) => {
                            return (
                              <option key={employee.id} value={employee.id}>
                                {`${employee.first_name} ${employee.surname}`}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="addTimeFormDate">
                      <Form.Label className="mb-0">
                        <strong>Date:</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        onFocus={(e) => (e.target.type = "date")}
                        onChange={(e) => {
                          setDate(e.target.value);
                        }}
                        defaultValue={date}
                        placeholder={date}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="addTimeFormHours">
                      <Form.Label className="mb-0">
                        <strong>Hours:</strong>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        defaultValue={0}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder={0}
                        min={0}
                      />
                    </Form.Group>
                  </Form>

                  <Button
                    variant="success"
                    onClick={() => {
                      handleAddTimeToJob(event.id, date, hours);
                    }}
                  >
                    Add Time
                  </Button>
                </Col>
                {/* Time Worked Graph Col */}
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Time Worked: </strong>
                    <div>
                      {timeTrackingLineItems.reduce((acc, val) => {
                        return acc + val.hours;
                      }, 0)}{" "}
                      hours
                    </div>
                  </Stack>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Time Allocated: </strong>
                    <div>{event.timeAllocated} hours</div>
                  </Stack>
                </Col>
              </Row>
              <hr></hr>
              <Row>
                {timeTrackingLineItems &&
                  timeTrackingLineItems.map((lineItem) => {
                    return (
                      <Stack className="mb-2" direction="horizontal" gap={4}>
                        <strong>{lineItem.employee_first_name}: </strong>
                        <div>
                          {new Date(lineItem.date_of_work).toLocaleDateString()}
                        </div>
                        <div>{lineItem.hours} hours</div>
                        <CloseButton />
                      </Stack>
                    );
                  })}
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ViewEventModal;
