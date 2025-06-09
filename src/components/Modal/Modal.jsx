import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './Modal.module.css';

const Modal = ({
    onClose,
    onSubmit,
    title,
    description,
    hideCloseButton = false,
    hideSubmitButton = false,
    closeButtonText = 'بستن',
    submitButtonText = 'تایید',
    children
}) => {
    const { theme } = useContext(ThemeContext);

    return createPortal(
        <div className={styles.root}>
            <div className={`${styles.modal} ${styles[theme]}`}>
                {title && <h2 className={styles.title}>{title}</h2>}
                {description && <div className={styles.description}>{description}</div>}
                {children}
                <div className={styles.buttonContainer}>
                    {!hideCloseButton && (
                        <button 
                            className={`${styles.button} ${styles.closeButton}`}
                            onClick={onClose}
                        >
                            {closeButtonText}
                        </button>
                    )}
                    {!hideSubmitButton && (
                        <button 
                            className={`${styles.button} ${styles.submitButton}`}
                            onClick={onSubmit}
                        >
                            {submitButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.node,
    hideCloseButton: PropTypes.bool,
    hideSubmitButton: PropTypes.bool,
    closeButtonText: PropTypes.string,
    submitButtonText: PropTypes.string,
    children: PropTypes.node
};

export default Modal;