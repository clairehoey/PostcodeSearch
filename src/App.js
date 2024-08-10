import './App.css';
import PostCodeForm from './components/PostCodeForm';

function App() {
  return (
    <div className="App">
      <header>
        <h3>Postcode Lookup</h3>  
        <p style={{ marginBottom: 20 }}>Enter a UK post code to retrieve geographical information.</p>  
      </header>  
      <PostCodeForm></PostCodeForm>
    </div>
  );
}

export default App;
