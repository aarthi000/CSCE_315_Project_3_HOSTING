import logo from './images/revs.png';
import './AppTest.css';

function App1() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div class="btn-group">
          <button class="role-button">Test</button>
          <button class="role-button">Test</button>
          <button class="role-button">Test</button>
        </div>
      </header>
    </div>
  );
}

export default App1;
