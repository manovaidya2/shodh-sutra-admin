import React, { useState, useEffect } from "react";
 import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateResultModal({ student, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(null);
 


  // Initialize formData when modal opens or student changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.result.name,
        rollNo: student.result.rollNo,
        enrollmentNo: student.result.enrollmentNo,
        fatherName: student.result.fatherName,
        course: student.result.course,
        srNo: student.result.srNo || "", 
        session: student.result.session,
        percentage: student.result.percentage,
        grade: student.result.grade,
        status: student.result.status,
        subjects: student.result.subjects.map(sub => ({ ...sub })), // deep copy
        totalFull: student.result.totalFull,
        totalPass: student.result.totalPass,
        totalObt: student.result.totalObt,
      });
    }
  }, [student]);

  if (!formData || !isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index][field] = field === "name" ? value : Number(value);

    // Update totals dynamically
    const totalFull = updatedSubjects.reduce((sum, s) => sum + (s.full || 0), 0);
    const totalPass = updatedSubjects.reduce((sum, s) => sum + (s.pass || 0), 0);
    const totalObt = updatedSubjects.reduce((sum, s) => sum + (s.obtained || 0), 0);

    setFormData(prev => ({
      ...prev,
      subjects: updatedSubjects,
      totalFull,
      totalPass,
      totalObt
    }));
  };

  const handleAddSubject = () => {
    const newSno = formData.subjects.length + 1;
    const newSubject = { sno: newSno, name: "", full: 0, pass: 0, obtained: 0 };
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject]
    }));
  };

  const handleSave = () => {
  // Validation example
  if (!formData.name.trim()) {
    toast.error("Student name is required");
    return;
  }
  if (!formData.rollNo.trim()) {
    toast.error("Roll No is required");
    return;
  }
  if (formData.subjects.length === 0) {
    toast.error("At least one subject is required");
    return;
  }
  for (let i = 0; i < formData.subjects.length; i++) {
    const sub = formData.subjects[i];
    if (!sub.name || sub.full === null || sub.obtained === null) {
      toast.error(`Subject ${i + 1} is incomplete`);
      return;
    }
  }

  onSave(student._id, formData);
  toast.success("Result updated successfully!");
  onClose();
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-indigo-800">Update Result</h2>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          {["name","rollNo","enrollmentNo","fatherName","course","srNo","session","percentage","grade","status"].map(key => (
            <label key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <input
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </label>
          ))}
        </div>

        {/* Subjects Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">S.No</th>
                <th className="border px-2 py-1">Subject</th>
                <th className="border px-2 py-1">Full Marks</th>
                <th className="border px-2 py-1">Passing Marks</th>
                <th className="border px-2 py-1">Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {formData.subjects.map((sub, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1 text-center">{sub.sno}</td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                      className="border rounded px-1 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="number"
                      value={sub.full}
                      onChange={(e) => handleSubjectChange(index, "full", e.target.value)}
                      className="border rounded px-1 py-1 w-full text-center"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="number"
                      value={sub.pass}
                      onChange={(e) => handleSubjectChange(index, "pass", e.target.value)}
                      className="border rounded px-1 py-1 w-full text-center"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="number"
                      value={sub.obtained}
                      onChange={(e) => handleSubjectChange(index, "obtained", e.target.value)}
                      className="border rounded px-1 py-1 w-full text-center"
                    />
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50">
                <td colSpan={2} className="border px-2 py-1 text-center">Total</td>
                <td className="border px-2 py-1 text-center">{formData.totalFull}</td>
                <td className="border px-2 py-1 text-center">{formData.totalPass}</td>
                <td className="border px-2 py-1 text-center">{formData.totalObt}</td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={handleAddSubject}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Add Subject
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700">Save</button>
        </div>
      </div>
    </div>
  );
}
