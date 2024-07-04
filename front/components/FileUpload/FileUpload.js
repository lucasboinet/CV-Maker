import React from 'react';
import styles from './FileUpload.module.scss';

const FileUpload = ({ onChange, mini }) => {
  return (
    <div
      className={`${styles['uploader']} ${mini ? styles['mini'] : null}`}
      onClick={(e) => e.stopPropagation()}
    >
      <label className={styles['uploader-label']} htmlFor="uploader">
        Insérez une image
      </label>
      <input
        className={styles['uploader-input']}
        type="file"
        id="uploader"
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
};

export default FileUpload;
