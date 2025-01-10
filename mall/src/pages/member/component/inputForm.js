import React from 'react';
import styles from './inputForm.module.css'

const InputForm = ({ fields, errorMessage, buttonText, onSubmit, className = '' }) => {
  return (
    <div className={`${styles.inputForm} ${className}`}>
      {fields.map((field, index) => (
        <div key={index} className={styles.inputField}>
          <input
            type={field.type}
            id={field.id}
            placeholder={field.placeholder}
            value={field.value}
            onChange={field.onChange}
            required={field.required || false}
          />
          {field.error && <p className={styles.fieldError}>{field.error}</p>}
        </div>
      ))}
      {errorMessage && <p className={styles.formError}>{errorMessage}</p>}
      <div className={styles.inputBtnDiv}>
        <button type="button" className={styles.submitButton} onClick={onSubmit}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default InputForm;