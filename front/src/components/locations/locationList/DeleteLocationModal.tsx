import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DeleteModalProps } from '../locationsTypes';

const DeleteLocationModal: React.FC<DeleteModalProps> = ({
  show, setShow, name, id, handleDelete,
}) => {
  const handleClose = (): void => {
    setShow(false);
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete
        {' '}
        {name}
        ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" type="button" onClick={handleClose}>Cancel</Button>
        <Button
          variant="outline-danger"
          type="button"
          id="confirmDelete"
          onClick={(): void => {
            setShow(false);
            handleDelete(id, name);
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteLocationModal;
