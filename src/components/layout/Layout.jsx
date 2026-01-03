import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { UNIDADES } from '../../utils/constants';

export default function Layout({ children, title, subtitle }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const  unidades  = UNIDADES;

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar menuOpen={menuOpen} unidades={unidades} />

      <main className="flex-1 overflow-auto">
        <Header 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen}
          title={title}
          subtitle={subtitle}
        />

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}