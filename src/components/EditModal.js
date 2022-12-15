import { useState } from "react";
import moment from "moment";
import "moment-timezone";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

function EditModal({
  modalState,
  sprint,
  startDate,
  endDate,
  clients,
  employees,
  setModalState,
  handleClose,
  handleScheduleJob,
  handleEditSprintAndJob,
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [jobName, setJobName] = useState("");
  const [clientId, setClientId] = useState("");
  const [timeAllocated, setTimeAllocated] = useState(0);
  const [employeeId, setEmployeeId] = useState("");
  const [description, setDescription] = useState("");
  const [thirdPartyItem, setThirdPartyItem] = useState("");
  const [thirdPartyCost, setThirdPartyCost] = useState(0);

  useEffect(() => {
    if (!sprint) return;
    setStart(getStartDateText());
    setEnd(getEndDateText());
    setJobName(sprint.job.name);
    setClientId(sprint.job.client.id);
    setTimeAllocated(sprint.job.timeAllocated);
    setEmployeeId(sprint.employee.id);
  }, [sprint]);

  const getStartDateText = () => {
    return moment.utc(sprint.start).format("MM/DD/YYYY");
  };

  const getEndDateText = () => {
    return moment.utc(sprint.end).format("MM/DD/YYYY");
  };

  console.log({ clients });

  if (!sprint) {
    console.log("no sprint!");
    return (
      <>
        <Modal>No Sprint Data</Modal>
      </>
    );
  }

  console.log({ end });

  return (
    <>
      <Modal
        show={modalState === "edit-modal"}
        onHide={() => setModalState("view-modal")}
        centered
        className="edit-event-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{"Edit"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="clientInputEdit">
                  <Form.Label>Client</Form.Label>
                  <Form.Select
                    required
                    onChange={(e) => {
                      setClientId(e.target.value);
                    }}
                    defaultValue={sprint.job.client.id}
                    aria-label="Assign to Client"
                  >
                    <option>Select Client</option>
                    {clients &&
                      clients.map((client) => {
                        return (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="subBrandInputAdd">
                  <Form.Label>Sub Brand</Form.Label>
                  <Form.Select
                    disabled
                    onChange={(e) => {
                      //   setClient(e.target.value);
                    }}
                    aria-label="Assign to Sub Brand"
                  >
                    <option>Assign to Sub Brand</option>
                    {clients &&
                      clients.map((client) => {
                        return (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="startDateInputAdd">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onChange={(e) => {
                      setStart(e.target.value);
                    }}
                    defaultValue={getStartDateText()}
                    placeholder={getStartDateText()}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="endDateInputAdd">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setEnd(e.target.value);
                    }}
                    onFocus={(e) => (e.target.type = "date")}
                    defaultValue={getEndDateText()}
                    placeholder={getEndDateText()}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="jobCodeInputAdd">
                  <Form.Label>Job Code</Form.Label>
                  <Form.Control
                    disabled
                    type="text"
                    onChange={(e) => setJobName(e.target.value)}
                    defaultValue={""}
                    placeholder={"DIAXXXX"}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="jobNameInputAdd">
                  <Form.Label>Job Name</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setJobName(e.target.value)}
                    defaultValue={sprint.job.name}
                    placeholder={"Job Name"}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="timeAllocatedInputAdd">
                  <Form.Label> Estimated Time Allocated</Form.Label>
                  <Form.Control
                    type="number"
                    defaultValue={sprint.job.timeAllocated}
                    onChange={(e) => setTimeAllocated(e.target.value)}
                    placeholder={"5"}
                    min={0}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput3"
                >
                  <Form.Label>Assign to Employee</Form.Label>
                  <Form.Select
                    defaultValue={sprint.employee.id}
                    onChange={(e) => {
                      setEmployeeId(e.target.value);
                    }}
                    aria-label="Select Employee"
                  >
                    <option>Select Employee</option>
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
              </Col>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="descriptionInputAdd">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  as="textarea"
                  style={{ height: "100px" }}
                  onChange={(e) => setDescription(e.target.value)}
                  defaultValue={""}
                  placeholder={"Description"}
                />
              </Form.Group>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="thirdPartyItemInputAdd">
                  <Form.Label>Third Party Item</Form.Label>
                  <Form.Control
                    disabled
                    type="text"
                    onChange={(e) => setThirdPartyItem(e.target.value)}
                    defaultValue={""}
                    placeholder={"Third Party Item"}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="thirdPartyCost">
                  <Form.Label>Cost £</Form.Label>
                  <Form.Control
                    disabled
                    type="number"
                    onChange={(e) => setThirdPartyCost(e.target.value)}
                    defaultValue={""}
                    step={0.01}
                    min={0}
                    placeholder={"XX.XX"}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              const sprintData = {
                sprintId: sprint.id,
                start_date: start,
                end_date: end,
                employeeId,
              };
              const jobData = {
                jobId: sprint.job.id,
                jobName,
                clientId,
                timeAllocated: parseInt(timeAllocated, 10),
              };
              handleEditSprintAndJob(sprintData, jobData);
              setStart("");
              setEnd("");
              setJobName("");
              setTimeAllocated(0);
              setDescription("");
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditModal;
