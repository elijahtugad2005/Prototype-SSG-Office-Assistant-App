import React, { useState } from 'react';
import Papa from 'papaparse';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';

function ClassUpload() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [classForm, setClassForm] = useState({
    className: '',
    classYear: 'First Year',
    schoolYear: '',
    classAdviser: '',
  });

  const [excelFile, setExcelFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ========================================
  // HANDLE FORM CHANGES
  // ========================================
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setClassForm(prev => ({ ...prev, [name]: value }));
  };

  // ========================================
  // HANDLE EXCEL FILE UPLOAD
  // ========================================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setParseError('');
    setStudents([]);

    if (!file) return;

    // Validate file type (CSV or Excel converted to CSV)
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      setParseError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    setExcelFile(file);
    parseFile(file);
  };

  // ========================================
  // PARSE FILE (CSV/Excel)
  // ========================================
  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            setParseError('File is empty. Please add student data.');
            return;
          }

          // Format student data
          const formattedStudents = results.data.map((row, index) => {
            // Flexible header matching
            const studentName = 
              row['Student Name'] || 
              row['Name'] || 
              row['student name'] || 
              row['name'] || 
              '';

            const studentAge = 
              row['Student Age'] || 
              row['Age'] || 
              row['student age'] || 
              row['age'] || 
              '';

            const studentGender = 
              row['Student Gender'] || 
              row['Gender'] || 
              row['student gender'] || 
              row['gender'] || 
              '';

            const studentID = 
              row['Student ID'] || 
              row['ID'] || 
              row['student id'] || 
              row['id'] || 
              '';

            const studentAddress = 
              row['Student Address'] || 
              row['Address'] || 
              row['student address'] || 
              row['address'] || 
              '';

            const studentContact = 
              row['Student Contact Number'] || 
              row['Contact Number'] || 
              row['Contact'] || 
              row['Phone'] || 
              row['student contact number'] || 
              row['contact number'] || 
              '';

            // Validate required fields
            if (!studentName || !studentID) {
              throw new Error(`Row ${index + 2}: Student Name and Student ID are required`);
            }

            return {
              studentName: String(studentName).trim(),
              studentAge: studentAge ? String(studentAge).trim() : 'N/A',
              studentGender: String(studentGender).trim(),
              studentID: String(studentID).trim(),
              studentAddress: studentAddress ? String(studentAddress).trim() : 'N/A',
              studentContact: studentContact ? String(studentContact).trim() : 'N/A',
              studentSection: '',
            };
          });

          setStudents(formattedStudents);
          setParseError('');
          console.log('✅ Parsed students:', formattedStudents);

        } catch (error) {
          console.error('Error parsing file:', error);
          setParseError(error.message || 'Error parsing file. Please check the format.');
          setStudents([]);
        }
      },
      error: (error) => {
        console.error('PapaParse error:', error);
        setParseError('Error reading file: ' + error.message);
      }
    });
  };

  // ========================================
  // HANDLE SUBMIT (Prepare for Firebase)
  // ========================================
  const handleSubmit = async () => {
  // Validate form
  if (!classForm.className.trim()) {
    alert('Please enter a class name');
    return;
  }

  if (!classForm.schoolYear.trim()) {
    alert('Please enter a school year');
    return;
  }

  if (!classForm.classAdviser.trim()) {
    alert('Please enter a class adviser');
    return;
  }

  if (students.length === 0) {
    alert('Please upload a CSV/Excel file with student data');
    return;
  }

  setLoading(true);

  try {
    // Add section to each student
    const studentsWithSection = students.map(student => ({
      ...student,
      studentSection: classForm.className
    }));

    // Step 1: Create the Class/Section document
    const classData = {
      className: classForm.className,
      classYear: classForm.classYear,
      schoolYear: classForm.schoolYear,
      classAdviser: classForm.classAdviser,
      totalStudents: studentsWithSection.length,
      createdAt: new Date().toISOString(),
    };

      console.log('🔵 handleSubmit called!');
  console.log('📋 Form data:', classForm);
  console.log('👥 Students:', students);
    console.log('📦 Creating class document...');
    const classRef = await addDoc(collection(db, 'classes'), classData);
    console.log('✅ Class created with ID:', classRef.id);

    // Step 2: Upload all students in batches
    const batchSize = 500;
    let uploadedCount = 0;

    for (let i = 0; i < studentsWithSection.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchStudents = studentsWithSection.slice(i, i + batchSize);

      batchStudents.forEach((student) => {
        const studentRef = doc(collection(db, 'students'));
        batch.set(studentRef, {
          ...student,
          classId: classRef.id,
          className: classForm.className,
          createdAt: new Date().toISOString(),
        });
      });

      await batch.commit();
      uploadedCount += batchStudents.length;
      console.log(`✅ Uploaded ${uploadedCount}/${studentsWithSection.length} students`);
    }

    alert(`🎉 Success!\n\n` +
          `Class: ${classForm.className}\n` +
          `Students Uploaded: ${studentsWithSection.length}\n` +
          `Class ID: ${classRef.id}\n\n` +
          `All data has been saved to Firebase!`);
    
    setUploadSuccess(true);
    setLoading(false);

    // Reset form after 2 seconds
    setTimeout(() => {
      resetForm();
    }, 2000);

  } catch (error) {
    console.error('❌ Error uploading to Firebase:', error);
    alert('Error uploading data to Firebase:\n' + error.message);
    setLoading(false);
  }
};

  // ========================================
  // RESET FORM
  // ========================================
  const resetForm = () => {
    setClassForm({
      className: '',
      classYear: ' ',
      schoolYear: '',
      classAdviser: '',
    });
    setExcelFile(null);
    setStudents([]);
    setParseError('');
    setUploadSuccess(false);
  };

  // ========================================
  // DOWNLOAD TEMPLATE
  // ========================================
  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = `Student Name,Student Age,Student Gender,Student ID,Student Address,Student Contact Number
Juan Dela Cruz,20,Male,2023-00001,123 Main St City,09123456789
Maria Santos,19,Female,2023-00002,456 Oak Ave City,09198765432`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'Student_List_Template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.mainTitle}>Add Class with Students</h2>
        <p style={styles.headerSubtitle}>Upload Excel file to import student data</p>
      </div>

      {uploadSuccess && (
        <div style={styles.successBanner}>
          ✅ Class and students processed successfully!
        </div>
      )}

      {/* DOWNLOAD TEMPLATE BUTTON */}
      <div style={styles.templateSection}>
        <button 
          onClick={downloadTemplate}
          style={styles.templateButton}
        >
          📥 Download CSV Template
        </button>
        <p style={styles.templateText}>
          Download this template to see the required format (works with Excel too)
        </p>
      </div>

      {/* CLASS INFORMATION FORM */}
      <div style={styles.formWrapper}>
        <h3 style={styles.sectionTitle}>Class Information</h3>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Class Name *</label>
            <input
              type="text"
              name="className"
              value={classForm.className}
              onChange={handleFormChange}
              placeholder="e.g., BSIT - 1A"
              style={styles.input}
              required
            />
            <p style={styles.helperText}>
              This will be used as the section for all students
            </p>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Class Year *</label>
              <select
                name="classYear"
                value={classForm.classYear}
                onChange={handleFormChange}
                style={styles.select}
                required
              >
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>School Year *</label>
              <input
                type="text"
                name="schoolYear"
                value={classForm.schoolYear}
                onChange={handleFormChange}
                placeholder="e.g., 2023-2024"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Class Adviser *</label>
            <input
              type="text"
              name="classAdviser"
              value={classForm.classAdviser}
              onChange={handleFormChange}
              placeholder="e.g., Junnie Boy Oner"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Upload Student List (CSV/Excel) *</label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              style={styles.fileInput}
              required
            />
            <p style={styles.helperText}>
              Upload CSV or Excel file. Required columns: Student Name, Student Age, Student Gender, Student ID, Student Address, Student Contact Number
            </p>
          </div>

          {/* PARSE ERROR */}
          {parseError && (
            <div style={styles.errorBox}>
              <strong>❌ Error:</strong> {parseError}
            </div>
          )}

          {/* STUDENTS PREVIEW */}
          {students.length > 0 && (
            <div style={styles.previewSection}>
              <h4 style={styles.previewTitle}>
                ✅ Found {students.length} student(s) in Excel file
              </h4>
              
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableHeader}>Name</th>
                      <th style={styles.tableHeader}>ID</th>
                      <th style={styles.tableHeader}>Age</th>
                      <th style={styles.tableHeader}>Gender</th>
                      <th style={styles.tableHeader}>Contact</th>
                      <th style={styles.tableHeader}>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 5).map((student, index) => (
                      <tr key={index} style={styles.tableRow}>
                        <td style={styles.tableCell}>{student.studentName}</td>
                        <td style={styles.tableCell}>{student.studentID}</td>
                        <td style={styles.tableCell}>{student.studentAge}</td>
                        <td style={styles.tableCell}>{student.studentGender}</td>
                        <td style={styles.tableCell}>{student.studentContact}</td>
                        <td style={styles.tableCell}>{student.studentAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {students.length > 5 && (
                <p style={styles.moreText}>
                  + {students.length - 5} more student(s)...
                </p>
              )}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div style={styles.buttonGroup}>
            <button
              onClick={handleSubmit}
              disabled={loading || students.length === 0}
              style={{
                ...styles.submitButton,
                ...(loading || students.length === 0 ? styles.submitButtonDisabled : {})
              }}
            >
              {loading ? 'Processing...' : '📤 Upload Class & Students'}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={styles.resetButton}
            >
              🔄 Reset Form
            </button>
          </div>
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div style={styles.instructionsBox}>
        <h4 style={styles.instructionsTitle}>📋 Instructions:</h4>
        <ol style={styles.instructionsList}>
          <li>Download the CSV template above</li>
          <li>Open in Excel or Google Sheets and fill in student information</li>
          <li>Save as CSV or keep as Excel format (.xlsx)</li>
          <li>Required columns: Student Name, Student ID (must be filled)</li>
          <li>Optional columns: Age, Gender, Address, Contact Number</li>
          <li>Upload the completed file</li>
          <li>Review the student list preview</li>
          <li>Click "Upload Class & Students" to save to database</li>
        </ol>
      </div>
    </div>
  );
}

// ========================================
// STYLES
// ========================================
const styles = {
  container: {
    width: '100%',
    maxWidth: '100%',
    padding: '1.5rem',
    backgroundColor: '#4c1515',
    borderRadius: '1rem',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '2rem',
  },
  mainTitle: {
    fontSize: '2rem',
    color: '#fe5c03',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: '1rem',
    color: '#c0c0c0',
  },
  successBanner: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '1rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  templateSection: {
    backgroundColor: '#5a1a1a',
    padding: '1.5rem',
    borderRadius: '1rem',
    marginBottom: '2rem',
    textAlign: 'center',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  templateButton: {
    padding: '1rem 2rem',
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  templateText: {
    color: '#c0c0c0',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  formWrapper: {
    backgroundColor: '#5a1a1a',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#fe5c03',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    borderBottom: '2px solid rgba(254, 92, 3, 0.3)',
    paddingBottom: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#f1f1f1',
    marginBottom: '0.4rem',
    fontWeight: '600',
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
  },
  select: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
  },
  fileInput: {
    padding: '0.7rem',
    border: '2px dashed #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  helperText: {
    fontSize: '0.8rem',
    color: '#c0c0c0',
    marginTop: '0.4rem',
  },
  errorBox: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '1rem',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
  },
  previewSection: {
    backgroundColor: '#732020',
    padding: '1.5rem',
    borderRadius: '0.8rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  previewTitle: {
    fontSize: '1.2rem',
    color: '#4caf50',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#8a2a2a',
    borderRadius: '0.5rem',
  },
  tableHeaderRow: {
    backgroundColor: '#9a3a3a',
  },
  tableHeader: {
    padding: '0.8rem',
    textAlign: 'left',
    color: '#fe5c03',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    borderBottom: '2px solid #fe5c03',
  },
  tableRow: {
    borderBottom: '1px solid rgba(254, 92, 3, 0.1)',
  },
  tableCell: {
    padding: '0.8rem',
    color: '#f1f1f1',
    fontSize: '0.85rem',
  },
  moreText: {
    color: '#c0c0c0',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.8rem',
    flexWrap: 'wrap',
    marginTop: '1rem',
  },
  submitButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '200px',
  },
  submitButtonDisabled: {
    backgroundColor: '#7a2a2a',
    cursor: 'not-allowed',
    opacity: '0.6',
  },
  resetButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: 'transparent',
    color: '#c0c0c0',
    border: '2px solid #7a2a2a',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '200px',
  },
  instructionsBox: {
    backgroundColor: '#5a1a1a',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  instructionsTitle: {
    fontSize: '1.2rem',
    color: '#fe5c03',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  instructionsList: {
    color: '#f1f1f1',
    fontSize: '0.95rem',
    lineHeight: '1.8',
    paddingLeft: '1.5rem',
  },
};

export default ClassUpload;