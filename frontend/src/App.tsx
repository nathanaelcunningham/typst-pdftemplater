import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditorLayout } from './components/layout/EditorLayout';
import { TemplateList } from './pages/TemplateList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorLayout />} />
        <Route path="/editor/:templateId" element={<EditorLayout />} />
        <Route path="/templates" element={<TemplateList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
