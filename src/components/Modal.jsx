import { useState, useEffect } from 'react';
import '../styles/modal.css';

// eslint-disable-next-line react/prop-types
const Modal = ({ isOpen, onClose, children }) => {

  
    if (!isOpen) return null;
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [modalVisible, setModalVisible] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isOpen) {
      // Delay para asegurar que la clase active se aplique después de que el modal se monte en el DOM
      setTimeout(() => {
        setModalVisible(true);
      }, 50);
    } else {
      setModalVisible(false);
    }
  }, [isOpen]);
  return (
    <>
    {modalVisible && (
      <div className="modal-background" onClick={onClose}></div>
    )}
    <div className={`modal ${modalVisible ? 'active' : ''}`}>
      <div className="modal-content">
       
        {children}
      </div>
    </div>
  </>
);
};

export default Modal;
