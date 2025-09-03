import React from "react";
import Leftsidebar from "../Leftsidebar/Leftsidebar";
import WHLvideolist from "./WHLvideolist";
import { useSelector, useDispatch } from "react-redux";
import { clearhistory } from "../../action/history";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const WHL = ({ page, videolist }) => {
  const currentuser = useSelector((state) => state.currentuserreducer);
  const dispatch = useDispatch();
  const userId = currentuser?.result?._id;

  const handleClearHistory = () => {
    if (userId && page === "History") {
      const confirmClear = window.confirm(
        "Are you sure you want to clear your watch history?"
      );
      if (confirmClear) dispatch(clearhistory({ userid: userId }));
    }
  };

  // Normalize videolist in case it comes from Redux as { data: [...] }
  const videos = videolist?.data || videolist || [];

  return (
    <Container fluid className="d-flex">
      {/* Sidebar */}
      <Col xs={2} className="p-0">
        <Leftsidebar />
      </Col>

      {/* Main Section */}
      <Col xs={10} className="p-3">
        <Row className="mb-3">
          <Col md={6}>
            <Card className="shadow-sm bg-dark text-white p-3 h-100">
              <Card.Body>
                <Card.Title as="h2" className="fw-bold">
                  Your {page} Shown Here
                </Card.Title>
                {page === "History" && (
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="mt-3"
                    onClick={handleClearHistory}
                  >
                    Clear History
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="d-flex align-items-center">
            <h1 className="fw-bold text-decoration-underline text-white mb-0">
              {page || "My Videos"}
            </h1>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="shadow-sm bg-dark text-white">
              <Card.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {videos?.length > 0 ? (
                  <WHLvideolist
                    page={page}
                    currentuser={userId}
                    videolist={videos}
                  />
                ) : (
                  <p className="text-center text-muted mb-0">
                    No videos available.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Container>
  );
};

export default WHL;
