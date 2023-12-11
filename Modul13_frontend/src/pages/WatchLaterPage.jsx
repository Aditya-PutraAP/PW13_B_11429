import React, { useEffect, useState } from "react";
import {
  Container,
  Spinner,
  Alert,
  Row,
  Col,
  Button,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { getThumbnail } from "../api";
import { DeleteWatchLater, GetAllWatchLater } from "../api/apiWatchLater";

const WatchLaterPage = () => {
  const [watchLaters, setWatchLater] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [idWatchLater, setIdWatchLater] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(
    "Semua video watch later"
  );

  const handleDeleteClick = (id) => {
    setIdWatchLater(id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = () => {
    setShowModal(false);
    deleteWatchLater(idWatchLater);
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0'); 
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const deleteWatchLater = (id) => {
    DeleteWatchLater(id)
      .then((response) => {
        setIsLoading(false);
        toast.success(response.message);
        fetchWatchLater();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        toast.dark(err.message);
      });
  };

  const fetchWatchLater = async (id) => {
    setIsLoading(true);
    GetAllWatchLater(id)
      .then((response) => {
        setWatchLater(response);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchWatchLater(selectedFilter);
  }, [selectedFilter]);

  return (
    <Container className="mt-4">
      <Row>
        <Col xs={9} style={{ flex: '0 0 78%' }}>
          <h1 className="h4 fw-bold mb-0 text-nowrap">Watch Later Videos</h1>
          <hr className="border-top border-light opacity-50 w-100" />
        </Col>
        <Col>
          <Dropdown className="mt-4">
            <Dropdown.Toggle className="text-start" variant="dark"  style={{  width:"250px" }}>
              {selectedFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu >
              <Dropdown.Item
                onClick={() => setSelectedFilter("Semua video watch later")}
              >
                Semua video watch later
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter("Hari ini")}>
                Hari ini
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter("Kemarin")}>
                Kemarin
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter("Bulan ini")}>
                Bulan ini
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter("Tahun ini")}>
                Tahun ini
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      {isLoading ? (
        <div className="text-center">
          <Spinner
            as="span"
            animation="border"
            variant="primary"
            size="lg"
            role="status"
            aria-hidden="true"
          />
          <h6 className="mt-2 mb-0">Loading...</h6>
        </div>
      ) : watchLaters?.length > 0 ? (
        <>
          {watchLaters?.map((watchLater) => (
            <div
              className="card text-white"
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "10px",
              }}
            >
              <img
                src={getThumbnail(watchLater.content.thumbnail)}
                className="card-img w-10 h-10 object-fit-cover bg-light"
                alt="..."
                style={{ flex: "0 0 auto", width: "250px", height: "150px" }}
              />
              <div
                className="card-body"
                style={{ flex: "1 1 auto", padding: "1rem" }}
              >
                <h5 className="card-title text-truncate">
                  {watchLater.content.title}
                </h5>

                <p className="card-text">{watchLater.content.description}</p>
              </div>
              <div
                className="card-body"
                style={{ flex: "2 2 auto", padding: "1rem" }}
              >
                <p className="card-text text-end">
                  Tanggal Ditambahkan: {formatDate(watchLater.data_added)}
                </p>
                <div className="text-end mt-5">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(watchLater.id)}
                  >
                    <FaTrash className="mx-1 mb-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <Alert variant="dark" className="text-center mt-3">
          Belum ada video di Watch Later, yuk tambah Video!
        </Alert>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>
          Apakah kamu yakin ingin menghapus ini dari watch later?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default WatchLaterPage;
