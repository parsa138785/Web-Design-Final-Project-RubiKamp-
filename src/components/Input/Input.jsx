import { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './Input/Input.module.css';

const Input = ({
    type = 'text',
    error,
    errorMessage,
    className,
    ...props
}) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div>
            <input
                type={type}
                className={`${styles.input} ${styles[theme]} ${error ? styles.error : ''} ${className || ''}`}
                {...props}
            />
            {error && errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
            )}
        </div>
    );
};

Input.propTypes = {
    type: PropTypes.string,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    id: PropTypes.string,
    autoComplete: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    pattern: PropTypes.string,
    required: PropTypes.bool,
    readOnly: PropTypes.bool
};

export default Input;