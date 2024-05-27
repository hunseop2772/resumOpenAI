import React, { useState } from 'react';
import './App.css';

function App() {
  const [sections, setSections] = useState({
    "growth_background": "",
    "education": "",
    "projects": "",
    "strengths_and_weaknesses": "",
    "certifications": "",
    "job_position": "",
    "job_description": ""
  });
  const [resume, setResume] = useState('');
  const [error, setError] = useState(null);

  const handleSectionChange = (event) => {
    const { name, value } = event.target;
    setSections(prevSections => ({
      ...prevSections,
      [name]: value
    }));
  }

  const handleJobPositionChange = (event) => {
    setSections(prevSections => ({
      ...prevSections,
      job_position: event.target.value
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/generate_resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: 1 }) // 예제용 user_id
      });
      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }
      const data = await response.json();
      setResume(data.resume);
    } catch (error) {
      setError(error.message);
    }
  }

  const handleUpdateSection = async (sectionName) => {
    try {
      const response = await fetch('http://localhost:5000/update_section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: 1, section_name: sectionName, section_text: sections[sectionName] }) // 예제용 user_id
      });
      if (!response.ok) {
        throw new Error('Failed to update section');
      }
      const data = await response.json();
      if (data.success) {
        console.log(`${sectionName} updated successfully.`);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  const handleClearSections = async () => {
    try {
      const response = await fetch('http://localhost:5000/clear_sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: 1 }) // 예제용 user_id
      });
      if (!response.ok) {
        throw new Error('Failed to clear sections');
      }
      const data = await response.json();
      if (data.success) {
        setSections({
          "growth_background": "",
          "education": "",
          "projects": "",
          "strengths_and_weaknesses": "",
          "certifications": "",
          "job_position": "",
          "job_description": ""
        });
        console.log('Sections cleared successfully.');
      }
    } catch (error) {
      setError(error.message);
    }
  }

  const handleDownloadResume = () => {
    const element = document.createElement("a");
    const file = new Blob([resume], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = "resume.pdf";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>이력서 생성기</h1>
      </header>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          직무:
          <select value={sections.job_position} onChange={handleJobPositionChange}>
            <option value="">선택하세요</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
            {/* 추가 직무 옵션 */}
          </select>
        </label>
        {Object.entries(sections).map(([sectionName, sectionText]) => (
          sectionName !== "job_position" && (
            <textarea key={sectionName} name={sectionName} value={sectionText} onChange={handleSectionChange} placeholder={`Enter ${sectionName.replace('_', ' ').toLowerCase()}...`} />
          )
        ))}
        <button type="submit">이력서 생성</button>
      </form>
      <button onClick={handleClearSections}>섹션 초기화</button>
      {resume && (
        <div className="Resume">
          <h2>생성된 이력서</h2>
          <p>{resume}</p>
          <button onClick={handleDownloadResume}>이력서 다운로드</button>
        </div>
      )}
      <footer>
        <p>백엔드와 프론트엔드 코드를 함께 사용하여 이력서 생성기를 구현했습니다.</p>
      </footer>
    </div>
  );
}

export default App;
