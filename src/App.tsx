import Canvas from 'components/Canvas/Canvas';
import Toolbox from 'components/Toolbox/Toolbox';
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
