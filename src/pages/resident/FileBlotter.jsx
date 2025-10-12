import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import CreateBlotterModal from '../../components/modals/CreateBlotterModal';
import { showCustomToast } from '../../components/Toast/CustomToast';

const FileBlotter = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const handleClose = () => {
    navigate('/resident/blotter/my-cases');
  };

  const handleSuccess = () => {
    showCustomToast('Blotter filed successfully', 'success');
    navigate('/resident/blotter/my-cases');
  };

  return (
    <CreateBlotterModal
      isOpen={showModal}
      onClose={handleClose}
      onSuccess={handleSuccess}
      createdBy={currentUser?.id}
    />
  );
};

export default FileBlotter;
