import { root } from '../constants';
import { downloadFiles } from '../packages/api/rest/files';

const style = {
  marginBottom: '20px',
};

const DownloadButton = ({ ids }: { ids: number[] }) => {
  const handleDownload = async () => {
    await downloadFiles({ data: ids }).then((fileName) => {
      const fileUrl = root.files + '/' + fileName;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', 'filename');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <button style={style} onClick={handleDownload} disabled={ids.length === 0}>
      Download File
    </button>
  );
};

export default DownloadButton;
