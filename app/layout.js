import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Arminia-Frauen-Allesfahrer Shop',
  description: 'Offizielles Fanclub Merchandise',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body style={{ 
        margin: 0, 
        backgroundColor: '#f4f6f8', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        minHeight: '100vh',
        position: 'relative'
      }}>
        <CartProvider>
          {/* Halbtansparentes Hintergrund-Logo */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            backgroundImage: 'url("/allesfahrer logo.png")',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            opacity: 0.04,
            pointerEvents: 'none',
            zIndex: 0
          }} />

          <Navbar />
          
          <main style={{ maxWidth: '1000px', margin: '36px auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
