import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="container mx-auto p-8 flex-grow">
        <Outlet /> 
      </main>

      <Footer />
    </div>
  )
}

export default App;