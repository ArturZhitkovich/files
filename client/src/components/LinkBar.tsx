import { Link } from 'react-router-dom';

const style = {
  width: '400px',
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  margin: '0 auto 20px',
};

const LinkBar = () => {
  return (
    <div style={style}>
      <Link to={'/'}>Main</Link>
      <Link to={'/files'}>Files</Link>
    </div>
  );
};

export default LinkBar;
