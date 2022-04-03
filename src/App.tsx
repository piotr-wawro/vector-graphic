import Canvas from 'components/canvas/Canvas';
import Toolbox from 'components/toolbox/Toolbox';
import './App.css';

function App() {
  return (
    <div className='container'>
        <Toolbox />
        <Canvas />
    </div>
  );
}

export default App;
