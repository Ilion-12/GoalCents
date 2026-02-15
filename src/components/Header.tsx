import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
  showUserProfile?: boolean;
  showMenu?: boolean;
}

// OOP Class for User Profile Menu Management
class UserProfileMenuManager {
  private isOpen: boolean = false;
  private onToggle: (state: boolean) => void;

  constructor(onToggle: (state: boolean) => void) {
    this.onToggle = onToggle;
  }

  open() {
    this.isOpen = true;
    this.onToggle(true);
  }

  close() {
    this.isOpen = false;
    this.onToggle(false);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.onToggle(this.isOpen);
  }

  getState() {
    return this.isOpen;
  }
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBackClick, 
  showUserProfile = true,
  showMenu = false 
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [menuManager] = React.useState(() => new UserProfileMenuManager(setIsDropdownOpen));
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        menuManager.close();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, menuManager]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <header className="header">
      {onBackClick && (
        <button className="back-button" onClick={onBackClick} aria-label="Go back">
          <iconify-icon icon="lucide:arrow-left"></iconify-icon>
        </button>
      )}
      {showMenu && (
        <button className="menu-button" aria-label="Open menu">
          <iconify-icon icon="lucide:menu"></iconify-icon>
        </button>
      )}
      <h1 className="page-title">{title}</h1>
      {showUserProfile && (
        <div className="user-profile-container" ref={dropdownRef}>
          <div className="user-profile" onClick={() => menuManager.toggle()}>
            <iconify-icon icon="mdi:account"></iconify-icon>
          </div>
          {isDropdownOpen && (
            <div className="user-dropdown-menu">
              <button className="logout-button" onClick={handleLogout}>
                <iconify-icon icon="lucide:log-out"></iconify-icon>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
