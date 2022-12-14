import { useState } from "react";
import moment from "moment";
import "moment-timezone";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";

//moment.tz.setDefault("Etc/GMT");

function MyModal({
  modalStatus,
  handleClose,
  handleSave,
  handleChange,
  eventId,
  event,
  startDate,
  endDate,
  eventInput,
  handleEditEvent,
  handleEdited,
  editStatus,
  handleDelete,
  clients,
  employees,
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [title, setTitle] = useState("");
  const [jobName, setJobName] = useState("");
  const [client, setClient] = useState("");
  const [employee, setEmployee] = useState("");
  const [timeAllocated, setTimeAllocated] = useState(0);

  useEffect(() => {
    setStart(getStartDateText());
    setEnd(getEndDateText());
  }, [startDate, endDate]);

  const getStartDateText = () => {
    return moment.utc(startDate).format("DD/MM/YYYY");
  };

  const getEndDateText = () => {
    return moment.utc(endDate).format("DD/MM/YYYY");
  };

  const convertDateForAirtable = (dateStrDDMMYYYY) => {
    var dateParts = dateStrDDMMYYYY.split("/");
    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return dateObject;
  };

  return (
    <>
      <Modal
        show={modalStatus}
        onHide={handleClose}
        centered
        className="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editStatus ? "Edit Event" : "Create New Event"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="text"
                onFocus={(e) => (e.target.type = "date")}
                onChange={(e) => {
                  setStart(e.target.value);
                }}
                defaultValue={getStartDateText()}
                placeholder={getStartDateText()}
                style={{ wordSpacing: "3px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setEnd(e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
                defaultValue={getEndDateText()}
                placeholder={getEndDateText()}
                style={{ wordSpacing: "3px" }}
              />
            </Form.Group>

            {
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>Job Name</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setJobName(e.target.value)}
                  defaultValue={editStatus ? event.jobName : ""}
                  placeholder={editStatus ? event.title : "Job Name"}
                  style={{ wordSpacing: "3px" }}
                />
              </Form.Group>
            }

            {
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>Client</Form.Label>
                <Form.Select
                  defaultValue={editStatus ? event.client.id : ""}
                  onChange={(e) => {
                    setClient(e.target.value);
                  }}
                  aria-label="Select Client"
                >
                  <option>Client</option>
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
            }

            {
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>Employee</Form.Label>
                <Form.Select
                  defaultValue={editStatus ? event.employee.id : ""}
                  onChange={(e) => {
                    setEmployee(e.target.value);
                  }}
                  aria-label="Select Employee"
                >
                  <option>Employee</option>
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
            }

            {
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ContorolInputTimeAllocated"
              >
                <Form.Label>Time Allocated</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={editStatus ? event.timeAllocated : ""}
                  onChange={(e) => setTimeAllocated(e.target.value)}
                  placeholder={"5"}
                  min={0}
                  style={{ wordSpacing: "3px" }}
                />
              </Form.Group>
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* for deleted created event  */}
          {editStatus && (
            <Button
              variant="secondary"
              onClick={handleDelete}
              style={{ boxShadow: "none" }}
            >
              <i className="fi fi-rr-trash"></i>
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ boxShadow: "none" }}
          >
            Close
          </Button>

          {/* for creating  new event */}
          {!editStatus && (
            <Button
              variant="success"
              onClick={() => {
                handleSave(
                  convertDateForAirtable(start).toLocaleDateString(),
                  convertDateForAirtable(end).toLocaleDateString(),
                  jobName,
                  client,
                  employee,
                  timeAllocated
                );
                setStart("");
                setEnd("");
                setTitle("");
                setJobName("");
              }}
              style={{ boxShadow: "none" }}
            >
              Save Changes
            </Button>
          )}

          {/* for editing created event  */}
          {editStatus && (
            <Button
              variant="success"
              onClick={() => {
                handleEdited(
                  start || event.start,
                  end || event.end,
                  jobName || event.jobName,
                  client || event.client.id,
                  employee || event.employee.id,
                  timeAllocated || event.timeAllocated
                );
                setStart("");
                setEnd("");
                setTitle("");
                setJobName("");
              }}
              style={{ boxShadow: "none" }}
            >
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyModal;
