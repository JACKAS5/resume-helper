import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ResumeList from './pages/ResumeList';
import CoverLetterPreview from './pages/CoverLetterPreview';
import ApplicationTracker from './pages/ApplicationTracker';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="resumes" element={<ResumeList />} />
          <Route path="coverletters" element={<CoverLetterPreview />} />
          <Route path="tracker" element={<ApplicationTracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
