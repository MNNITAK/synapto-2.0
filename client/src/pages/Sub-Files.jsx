import { useState, useEffect } from "react";
import { useFileContext } from "../context/Filecontext.jsx";
import { useGoogle } from "../context/googleapi.jsx";
import "./Sub-Files.css";

export default function SubjectFileManager() {
  const { SummaryGenerator,quizGenerator} = useGoogle();  
  const { uploadFile, fetchFilesBySubject, files } = useFileContext();
  const subjectsList = ["Mathematics", "Physics", "Chemistry"];
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newFileTitles, setNewFileTitles] = useState({});
  const [file, setFile] = useState(null);
  console.log("file",file)

  useEffect(() => {
    if (selectedSubject) {
      fetchFilesBySubject(selectedSubject);
    }
  }, [selectedSubject]);

  

  // const handleGenerateQuiz = (fileName) => {
  //   alert(`Generating quiz for ${fileName}`);
  // };

  const handleAddFile = async (subjectName) => {
    const newFileTitle = newFileTitles[subjectName] || "";
    if (!file) return alert("Please choose a file.");
   

    try {
      await uploadFile({
        file,
        title: newFileTitle,
        subject: subjectName,
      });

      if (selectedSubject === subjectName) {
        fetchFilesBySubject(subjectName); // refresh list
      }

      setNewFileTitles({ ...newFileTitles, [subjectName]: "" });
      setFile(null);
    } catch (err) {
      alert("Upload failed.");
    }
  };

  return (
    <div className="container full-screen">
      {/* Sidebar */}
      <div className="sidebar">
        {subjectsList.map((subject) => (
          <div key={subject} className="subject-card">
            <div
              className="subject-name"
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </div>
            <div className="file-count">
              {/* Files count based on actual data */}
              {selectedSubject === subject && files.length} files uploaded
            </div>
            <div className="add-file-form">
              <input
                type="text"
                placeholder="Enter title (e.g. Notes.pdf)"
                value={newFileTitles[subject] || ""}
                onChange={(e) =>
                  setNewFileTitles({
                    ...newFileTitles,
                    [subject]: e.target.value,
                  })
                }
                className="file-input"
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block text-sm"
              />
              <button
                onClick={() => handleAddFile(subject)}
                className="action-button"
              >
                Add File
              </button>
            </div>
            <button
              className="view-button"
              onClick={() => setSelectedSubject(subject)}
            >
              View Files
            </button>
          </div>
        ))}
      </div>

      {/* Right Side - Display Area */}
      <div className="display-area">
        {selectedSubject ? (
          <div className="subject-detail">
            <h2>{selectedSubject} Files</h2>
            <div className="file-list vertical-list">
              {files.map((file, index) => (
                <div key={index} className="file-card organized large">
                  <div className="file-name">
                    📄{" "}
                    <a
                      href={"https://drive.google.com/drive/u/3/home"}
                      target="_blank"
                      rel="noopener noreferrer"
                    
                    >
                      {file.title.replace(/\.pdf$/, "")}
                    </a>
                  </div>
                  <div className="file-actions">
                    <button
                      className="action-button"
                      onClick={() => SummaryGenerator(file?._id)}
                    >
                      Summary
                    </button>
                    <button
                      className="action-button"
                      onClick={() => quizGenerator(file?._id)}
                    >
                      Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="placeholder">Select a subject to view files</p>
        )}
      </div>
    </div>
  );
}
