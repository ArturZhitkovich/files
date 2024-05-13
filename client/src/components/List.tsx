import { useEffect, useState } from 'react';
import { FIleWithSelected } from '../types/File';
import { getFiles } from '../packages/api/rest/files';
import DownloadButton from './DownloadButton';

const style = {
  width: '500px',
  display: 'flex',
  justifyContent: 'space-between',
};

const List = () => {
  const [files, setFiles] = useState<FIleWithSelected[]>([]);

  useEffect(() => {
    getFiles().then((data) => {
      setFiles(data.map((d) => ({ ...d, selected: false })));
    });
  }, []);

  const onChange = (id: number) => () => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === id) {
          return { ...file, selected: !file.selected };
        }

        return file;
      }),
    );
  };

  return (
    <section className='container'>
      <DownloadButton
        ids={files.filter((file) => file.selected).map((file) => file.id)}
      />

      {files.map((file) => {
        return (
          <div key={file.id} style={style}>
            <label htmlFor={String(file.id)}>
              <input
                type='checkbox'
                id={String(file.id)}
                checked={file.selected}
                onChange={onChange(file.id)}
              />
              {file.id} {file.fileName} {file.size} bytes
            </label>

            <a href={`/api/files/${file.fileName}`} download>
              download file
            </a>
          </div>
        );
      })}
    </section>
  );
};

export default List;
