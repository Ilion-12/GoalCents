import React from 'react';

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
  showUserProfile?: boolean;
  showMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBackClick, 
  showUserProfile = true,
  showMenu = false 
}) => {
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
        <div className="user-profile">
          <iconify-icon icon="mdi:account"></iconify-icon>
        </div>
      )}
    </header>
  );
};

export default Header;
