import { useState } from "react";
import moment from "moment";
import "moment-timezone";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

function AddEventModal({
  addEventModalStatus,
  modalState,
  startDate,
  endDate,
  clients,
  employees,
  handleClose,
  handleSave,
  handleScheduleJob,
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
    setStart(getStartDateText());
    setEnd(getEndDateText());
  }, [startDate, endDate]);

  //   console.log({ startDate });
  //   console.log({ start });

  const getStartDateText = () => {
    return moment.utc(startDate).format("MM/DD/YYYY");
  };

  const getEndDateText = () => {
    return moment.utc(endDate).format("MM/DD/YYYY");
  };

  //   const convertDateForAirtable = (dateStrDDMMYYYY) => {
  //     var dateParts = dateStrDDMMYYYY.split("/");
  //     // month is 0-based, that's why we need dataParts[1] - 1
  //     var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  //     return dateObject;
  //   };

  addEventModalStatus && console.log("render");
  return (
    <>
      <Modal
        show={modalState === "add-modal"}
        onHide={handleClose}
        centered
        className="add-event-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{"Schedule A Job"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="clientInputAdd">
                  <Form.Label>Client</Form.Label>
                  <Form.Select
                    required
                    onChange={(e) => {
                      setClientId(e.target.value);
                    }}
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
                    onChange={(e) => setEnd(e.target.value)}
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
                    defaultValue={""}
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
                    defaultValue={0}
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
                    defaultValue={""}
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
              const sprint = {
                start,
                end,
                employeeId,
              };
              const job = {
                jobName,
                clientId,
                timeAllocated: parseInt(timeAllocated, 10),
              };
              handleScheduleJob(job, sprint);
              setStart("");
              setEnd("");
              setJobName("");
              setTimeAllocated(0);
              setDescription("");
            }}
          >
            Add Job
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddEventModal;
