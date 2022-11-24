import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function MyModal({
  modalStatus,
  handleClose,
  handleSave,
  handleChange,
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
                onChange={(e) => setStart(e.target.value)}
                placeholder={startDate.toLocaleString("en-US")}
                style={{ wordSpacing: "3px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setEnd(e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
                placeholder={endDate.toLocaleString("en-US")}
                style={{ wordSpacing: "3px" }}
              />
            </Form.Group>

            {/* for creating  new event */}
            {!editStatus && (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Event title</Form.Label>
                <Form.Control
                  type="textarea"
                  rows={3}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ boxShadow: "none" }}
                />
              </Form.Group>
            )}

            {!editStatus && (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>Job Name</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder={"Job Name"}
                  style={{ wordSpacing: "3px" }}
                />
              </Form.Group>
            )}

            {!editStatus && (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>Client</Form.Label>
                <Form.Select
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
            )}

            {!editStatus && (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>Employee</Form.Label>
                <Form.Select
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
            )}

            {!editStatus && (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ContorolInputTimeAllocated"
              >
                <Form.Label>Time Allocated</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setTimeAllocated(e.target.value)}
                  placeholder={"5"}
                  min={0}
                  style={{ wordSpacing: "3px" }}
                />
              </Form.Group>
            )}

            {/* for editing created event  */}
            {editStatus && (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Event title</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={eventInput}
                  onChange={handleEditEvent}
                  style={{ boxShadow: "none" }}
                />
              </Form.Group>
            )}
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
                  start,
                  end,
                  title,
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
              onClick={handleEdited}
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
