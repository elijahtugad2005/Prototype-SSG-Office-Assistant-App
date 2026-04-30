import React, { useState, useEffect } from 'react';
import PDFList from './PDFList';
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import styles from './PDFDashboard.module.css';

function PDFDashboard() {
  const [pdf, setPdf] = useState({
    pdfName: "",
    pdfCreator: "",
    pdfDate: "",
    pdfCategory: "Memorandum",
    pdfStatus: "approved",
    pdfBase64: "",
    fileSize: 0,
    fileName: "",
  });

  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Load PDFs from Firestore with error handling
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "pdfs"), 
      (snapshot) => {
        const pdfsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort by upload date (newest first)
        pdfsData.sort((a, b) => {
          const dateA = new Date(a.uploadedAt || 0);
          const dateB = new Date(b.uploadedAt || 0);
          return dateB - dateA;
        });
        setPdfs(pdfsData);
      },
      (error) => {
        console.error("❌ Error loading PDFs:", error);
        alert("Failed to load PDFs. Please check your connection and try again.");
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPdf((prev) => ({ ...prev, [name]: value }));
  };

  // Handle PDF file upload and convert to Base64
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setPdf(prev => ({ ...prev, pdfBase64: "", fileName: "", fileSize: 0 }));
      setUploadProgress(null);
      return;
    }

    // Validate file type
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
      alert("⚠️ Please select a PDF file only.");
      e.target.value = "";
      return;
    }

    // Validate file size (1MB limit for Firestore)
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`⚠️ PDF file is too large (${(file.size / 1024 / 1024).toFixed(2)} MB).\n\nMaximum size: 1 MB\n\nPlease compress the PDF or use a smaller file.`);
      e.target.value = "";
      return;
    }

    setLoading(true);
    setUploadProgress("📖 Reading PDF file...");

    // Convert PDF to Base64
    const reader = new FileReader();
    
    reader.onloadstart = () => {
      setUploadProgress("📖 Reading PDF file...");
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(`📖 Loading... ${percentComplete}%`);
      }
    };

    reader.onload = (event) => {
      const base64String = event.target.result;
      
      // Double-check Base64 size
      if (base64String.length > 1.4 * maxSize) {
        alert("⚠️ File is too large after conversion. Please use a smaller PDF.");
        setLoading(false);
        setUploadProgress(null);
        e.target.value = "";
        return;
      }

      setPdf(prev => ({ 
        ...prev, 
        pdfBase64: base64String,
        fileName: file.name,
        fileSize: file.size
      }));
      
      setLoading(false);
      setUploadProgress(`✅ PDF loaded: ${file.name}`);
      
      setTimeout(() => setUploadProgress(null), 3000);
    };

    reader.onerror = () => {
      alert("❌ Error reading PDF file. Please try again.");
      setLoading(false);
      setUploadProgress(null);
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  // View PDF in new tab
  const viewPDF = (base64String) => {
    if (!base64String) {
      alert("⚠️ No PDF data available.");
      return;
    }
    
    try {
      const byteCharacters = atob(base64String.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        alert("⚠️ Pop-up blocked! Please allow pop-ups for this site to view PDFs in a new tab.");
      }
      
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("❌ Error viewing PDF:", error);
      alert("❌ Failed to open PDF. The file may be corrupted.");
    }
  };

  // Download PDF
  const downloadPDF = (base64String, fileName) => {
    if (!base64String) {
      alert("⚠️ No PDF data available for download.");
      return;
    }

    try {
      const byteCharacters = atob(base64String.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      alert("❌ Failed to download PDF. Please try again.");
    }
  };

  // Preview PDF in modal
  const previewPDF = (pdfData) => {
    setSelectedPdf(pdfData);
    setViewMode(true);
  };

  // Delete PDF from Firestore
  const handleDelete = async (id, pdfName) => {
    const confirmed = window.confirm(
      `🗑️ Delete this PDF?\n\n"${pdfName}"\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "pdfs", id));
      
      // If deleted PDF was being previewed, close preview
      if (selectedPdf?.id === id) {
        setSelectedPdf(null);
        setViewMode(false);
      }
      
      alert(`✅ "${pdfName}" deleted successfully!`);
    } catch (error) {
      console.error("❌ Error deleting PDF:", error);
      alert(`❌ Error deleting PDF: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Submit PDF to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!pdf.pdfBase64) {
      alert("⚠️ Please upload a PDF file first.");
      return;
    }

    if (!pdf.pdfName.trim()) {
      alert("⚠️ Please enter a PDF name.");
      return;
    }

    const pdfData = {
      pdfName: pdf.pdfName.trim(),
      pdfCreator: pdf.pdfCreator.trim() || "Unknown",
      pdfDate: pdf.pdfDate || new Date().toISOString().split('T')[0],
      pdfCategory: pdf.pdfCategory,
      pdfStatus: pdf.pdfStatus,
      pdfBase64: pdf.pdfBase64,
      fileName: pdf.fileName,
      fileSize: pdf.fileSize,
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    console.log("📤 Uploading PDF:", pdfData.pdfName);

    try {
      setLoading(true);
      setUploadProgress("📤 Uploading to database...");
      
      await addDoc(collection(db, "pdfs"), pdfData);
      
      alert(`✅ "${pdfData.pdfName}" uploaded successfully!`);
      
      // Reset form
      setPdf({
        pdfName: "",
        pdfCreator: "",
        pdfDate: "",
        pdfCategory: "Memorandum",
        pdfStatus: "approved",
        pdfBase64: "",
        fileSize: 0,
        fileName: "",
      });
      
      const fileInput = document.getElementById('pdfFileInput');
      if (fileInput) fileInput.value = "";
      
      setUploadProgress(null);
      
    } catch (error) {
      console.error("❌ Error uploading PDF:", error);
      alert(`❌ Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📄 PDF Management Dashboard</h1>
      
      <div className={styles.dashboardLayout}>
        {/* Left: Upload Form */}
        <div className={styles.uploadSection}>
          <h2>Upload New PDF</h2>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>PDF Name *</label>
              <input
                type="text"
                name="pdfName"
                placeholder="Enter PDF document name"
                value={pdf.pdfName}
                onChange={handleChange}
                required
                maxLength="100"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Creator/Author</label>
              <input
                type="text"
                name="pdfCreator"
                placeholder="Enter creator name"
                value={pdf.pdfCreator}
                onChange={handleChange}
                maxLength="50"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Document Date</label>
              <input
                type="date"
                name="pdfDate"
                value={pdf.pdfDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category *</label>
              <select
                name="pdfCategory"
                value={pdf.pdfCategory}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="Memorandum">Memorandum</option>
                <option value="Announcement">Announcement</option>
                <option value="Letter">Letter</option>
                <option value="Report">Report</option>
                <option value="Form">Form</option>
                <option value="Guideline">Guideline</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Status *</label>
              <select
                name="pdfStatus"
                value={pdf.pdfStatus}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="approved">✅ Approved</option>
                <option value="pending">⏳ Pending</option>
                <option value="completed">🏁 Completed</option>
                <option value="archived">📦 Archived</option>
                <option value="ongoing">🚧 Ongoing</option>
                <option value="draft">📝 Draft</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>PDF File * (Max 1MB)</label>
              <input
                id="pdfFileInput"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePDFUpload}
                className={styles.fileInput}
                disabled={loading}
              />
              <small className={styles.fileInfo}>
                {pdf.fileName 
                  ? `✓ Selected: ${pdf.fileName} (${formatFileSize(pdf.fileSize)})` 
                  : "No file selected"}
              </small>
            </div>

            {uploadProgress && (
              <div className={styles.uploadProgress}>
                {uploadProgress}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.uploadButton}
              disabled={loading || !pdf.pdfBase64}
            >
              {loading ? "📤 Uploading..." : "📥 Upload PDF"}
            </button>

            {pdf.pdfBase64 && !loading && (
              <div className={styles.uploadInfo}>
                <p>✅ PDF ready to upload</p>
                <button 
                  type="button" 
                  onClick={() => viewPDF(pdf.pdfBase64)}
                  className={styles.previewBtn}
                  disabled={loading}
                >
                  👁️ Preview Before Upload
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right: PDF List */}
        <div className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <h2>PDF Documents ({pdfs.length})</h2>
            {pdfs.length > 0 && (
              <div className={styles.viewControls}>
                <button 
                  onClick={() => {
                    if (viewMode) {
                      setViewMode(false);
                      setSelectedPdf(null);
                    } else if (pdfs.length > 0) {
                      setSelectedPdf(pdfs[0]);
                      setViewMode(true);
                    }
                  }}
                  className={styles.toggleViewBtn}
                  disabled={loading}
                >
                  {viewMode ? "📋 List View" : "👁️ Preview Mode"}
                </button>
              </div>
            )}
          </div>

          {viewMode && selectedPdf ? (
            <div className={styles.pdfPreviewContainer}>
              <div className={styles.pdfPreviewHeader}>
                <div>
                  <h3>{selectedPdf.pdfName}</h3>
                  <small>{selectedPdf.fileName} • {formatFileSize(selectedPdf.fileSize)}</small>
                </div>
                <button 
                  onClick={() => {
                    setViewMode(false);
                    setSelectedPdf(null);
                  }} 
                  className={styles.closeBtn}
                >
                  ✕ Close
                </button>
              </div>
              <div className={styles.pdfViewer}>
                {selectedPdf.pdfBase64 ? (
                  <iframe
                    src={selectedPdf.pdfBase64}
                    title={selectedPdf.pdfName}
                    className={styles.pdfFrame}
                  />
                ) : (
                  <div className={styles.noPreview}>
                    <p>📭 PDF content not available</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <PDFList 
              pdfs={pdfs} 
              onPreview={previewPDF}
              onView={viewPDF}
              onDownload={downloadPDF}
              onDelete={handleDelete}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total PDFs</h3>
          <p className={styles.statNumber}>{pdfs.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>By Category</h3>
          <p className={styles.statText}>
            {pdfs.filter(p => p.pdfCategory === "Memorandum").length} Memo • {' '}
            {pdfs.filter(p => p.pdfCategory === "Announcement").length} Announce • {' '}
            {pdfs.filter(p => p.pdfCategory === "Letter").length} Letters
          </p>
        </div>
        <div className={styles.statCard}>
          <h3>By Status</h3>
          <p className={styles.statText}>
            {pdfs.filter(p => p.pdfStatus === "approved").length} ✅ • {' '}
            {pdfs.filter(p => p.pdfStatus === "pending").length} ⏳ • {' '}
            {pdfs.filter(p => p.pdfStatus === "completed").length} 🏁
          </p>
        </div>
      </div>
    </div>
  );
}

export default PDFDashboard;