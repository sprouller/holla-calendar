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
import {
  addWorkItemToAirtable,
  deleteWorkItemFromTable,
  fetchWorkItemsByJobId,
} from "../controller/Airtable";
import moment from "moment-timezone";

function ViewSprintModal({
  modalState,
  handleClose,
  sprint,
  setModalState,
  employees,
  handleDeleteSprint,
}) {
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [hours, setHours] = useState(0);
  const [employee, setEmployee] = useState(
    (sprint && sprint.employee.id) || ""
  );
  const [workItems, setworkItems] = useState([]);

  useEffect(() => {
    if (!sprint) return;
    console.log({ sprint });
    setEmployee((sprint && sprint.employee.id) || "");
    console.log(`fetching timeTrack records for job ${sprint.job.id}`);
    fetchWorkItemsByJobId(sprint.job.id).then((workItems) => {
      console.log({ workItems });
      setworkItems(workItems);
    });
  }, [sprint]);

  const getUTCDate = (date) => {
    return moment.utc(date).format("MM/DD/YYYY");
  };

  if (!sprint) {
    console.log("no sprint!");
    return (
      <>
        <Modal>No Sprint Data</Modal>
      </>
    );
  }

  const handleAddWorkItem = async (sprintId, date, hours) => {
    console.log("handleAddWorkItem");
    console.log({ sprintId, date, hours });
    await addWorkItemToAirtable(sprintId, date, hours);
    fetchWorkItemsByJobId(sprint.job.id).then((workItems) => {
      setworkItems(workItems);
    });
  };

  const handleDeleteWorkItem = async (workItemId) => {
    console.log("handleDeleteWorkItem");
    console.log({ workItemId });
    await deleteWorkItemFromTable(workItemId);
    fetchWorkItemsByJobId(sprint.job.id).then((workItems) => {
      setworkItems(workItems);
    });
  };

  return (
    <>
      <Modal
        show={modalState === "view-modal"}
        onHide={handleClose}
        centered
        className="view-sprint-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{sprint.job.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="jobInformation"
            id="view-sprint-modal-tabs"
            className="mb-3"
          >
            {/* Job Info Tab */}
            <Tab eventKey="jobInformation" title="Job Information">
              <Row className="mb-2">
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Client: </strong>
                    <div>{sprint.job.client.name}</div>
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
                    <div>{sprint.job.name}</div>
                  </Stack>
                </Col>
              </Row>
              <hr></hr>
              <Row className="mb-2">
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Date From: </strong>
                    <div>{sprint.start}</div>
                  </Stack>
                </Col>
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Date To:</strong>
                    <div>{sprint.end}</div>
                  </Stack>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Time Allocated: </strong>
                    <div>{sprint.job.timeAllocated} hours</div>
                  </Stack>
                </Col>
                <Col>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Employee:</strong>
                    <div>{sprint.employee.firstName}</div>
                  </Stack>
                </Col>
              </Row>
              <Row className="p-2">
                <Alert variant="secondary">
                  <div>{"Description here"}</div>
                </Alert>
              </Row>
            </Tab>
            {/* Time Tracking Tab */}
            <Tab eventKey="timeTracking" title="Time Tracking">
              <Row>
                {/* Add Work Item Form */}
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
                        defaultValue={sprint.employee.id}
                        onChange={(e) => {
                          setEmployee(e.target.value);
                        }}
                        aria-label="Select Employee"
                      >
                        {employees &&
                          employees.map((employee) => {
                            return (
                              <option key={employee.id} value={employee.id}>
                                {`${employee.firstName} ${employee.surname}`}
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
                        onChange={(e) => setHours(parseInt(e.target.value), 0)}
                        placeholder={0}
                        min={0}
                      />
                    </Form.Group>
                  </Form>

                  <Button
                    variant="success"
                    onClick={() => {
                      handleAddWorkItem(sprint.id, date, hours);
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
                      {workItems.reduce((acc, val) => {
                        return acc + val.hours;
                      }, 0)}{" "}
                      hours
                    </div>
                  </Stack>
                  <Stack direction="horizontal" gap={2}>
                    <strong>Time Allocated: </strong>
                    <div>{sprint.job.timeAllocated} hours</div>
                  </Stack>
                </Col>
              </Row>
              <hr></hr>
              <Row>
                {workItems &&
                  workItems.map((workItem) => {
                    return (
                      <Stack
                        key={workItem.id}
                        className="mb-2"
                        direction="horizontal"
                        gap={4}
                      >
                        <strong>{workItem.employee.firstName}: </strong>
                        <div>{getUTCDate(workItem.dateOfWork)}</div>
                        <div>{workItem.hours} hours</div>
                        <CloseButton
                          onClick={() => handleDeleteWorkItem(workItem.id)}
                        />
                      </Stack>
                    );
                  })}
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setModalState("edit-modal")}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteSprint(sprint.id)}
          >
            <i className="fi fi-rr-trash"></i>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewSprintModal;
