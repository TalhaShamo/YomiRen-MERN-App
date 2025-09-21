import { useState, useEffect, useRef } from 'react'; // Import new hooks for state and references
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { User, BookMarked, Library, LogOut } from 'lucide-react'; // Import new Logout icon

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Local state to manage whether the dropdown is open or closed.
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // A ref to get a direct reference to the dropdown menu's DOM element.
  const dropdownRef = useRef(null);

  const { token, user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  // This effect handles closing the dropdown if the user clicks outside of it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown exists and the click was outside of it, close it.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    // Add the event listener when the dropdown is open.
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to={token ? '/dashboard' : '/'} className="text-2xl font-bold text-primary">
          YomiRen
        </Link>

        <nav>
          <ul className="flex items-center space-x-4 md:space-x-6">
            {token ? (
              // --- LOGGED-IN USER VIEW ---
              <>
                <li className="hidden sm:block">
                  <Link to="/deck" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <BookMarked size={18} /> My Deck
                  </Link>
                </li>
                <li className="hidden sm:block">
                  <Link to="/resources" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Library size={18} /> Resources
                  </Link>
                </li>
                
                {/* --- THIS IS THE DROPDOWN --- */}
                <li className="relative" ref={dropdownRef}>
                  {/* This button now toggles the dropdown's visibility. */}
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-secondary text-secondary-foreground p-2 rounded-full hover:opacity-90 transition-opacity"
                    aria-label="Open user menu"
                  >
                    <User size={20} />
                  </button>

                  {/* The dropdown menu is conditionally rendered based on state. */}
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg">
                      {/* Placeholder for future "Settings" link */}
                      <div className="px-4 py-2 text-muted-foreground border-b border-border">
                        Signed in as <strong>{user?.username || 'User'}</strong>
                      </div>
                      <button 
                        onClick={onLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-muted-foreground hover:bg-background"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              // --- LOGGED-OUT USER VIEW ---
              <>
                <li>
                  <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="bg-primary hover:opacity-90 text-primary-foreground font-bold py-2 px-4 rounded-lg"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;