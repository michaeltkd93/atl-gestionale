import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'ATL Gestionale', description: 'Gestione ATL' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it"><body>
      <div className="container">
        <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>ATL Gestionale</h2>
          <nav style={{display:'flex',gap:12}}>
            <Link href="/">Dashboard</Link>
            <Link href="/members">Atleti</Link>
            <Link href="/subscriptions">Abbonamenti</Link>
            <Link href="/certificates">Certificati</Link>
            <Link href="/reports">Report</Link>
            <Link href="/settings">Impostazioni</Link>
          </nav>
        </header>
        {children}
        <footer style={{color:'#707888',fontSize:12,padding:24,textAlign:'center'}}>© ASD Accademia Taekwondo Lombardia</footer>
      </div>
    </body></html>
  );
}
