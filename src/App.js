import logo from './images/revs.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div class="btn-group">
          <button>Customer</button>
          <button>Server</button>
          <button>Manager</button>
        </div>
      </header>
    </div>
  );
}

export default App;
