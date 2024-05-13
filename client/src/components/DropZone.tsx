import { uploadFiles } from '../packages/api/rest/files';
import { useDropzone } from 'react-dropzone';

const style = { border: 'dotted' };

const DropZone = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      'application/zip': ['.zip'],
    },
  });

  const files = acceptedFiles.map((file) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { path, size } = file;

    return (
      <li key={path}>
        {path} - {size} bytes
      </li>
    );
  });

  const sendFile = async () => {
    try {
      const data = new FormData();
      data.append('zipfile', acceptedFiles[0]);
      await uploadFiles({ data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className='container'>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop '.zip' file here, or click to select file</p>
      </div>
      <aside>
        <h4>File</h4>
        <ul>{files}</ul>
      </aside>
      <button onClick={sendFile} disabled={acceptedFiles.length === 0}>
        Send
      </button>
    </section>
  );
};

export default DropZone;
