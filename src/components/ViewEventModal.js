import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import { useEffect } from "react";
import { Alert } from "react-bootstrap";

function ViewEventModal({
  viewEventModalStatus,
  handleClose,
  handleSave,
  event,
  //   startDate,
  //   endDate,
  clients,
  employees,
}) {
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
              <div>Time Tracking Tab</div>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ViewEventModal;
