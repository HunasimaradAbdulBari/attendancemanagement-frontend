import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';
import '../styles/variable.css';
import '../styles/layout.css';
import '../styles/components/Common.css';
import '../styles/components/Announcement.css';
import '../styles/components/Attendance.css';
import '../styles/components/Dashboard.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}