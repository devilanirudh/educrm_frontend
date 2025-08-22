import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReportCardTemplate, useStudentsByClass, useReportCards } from '../../hooks/useReportCards';

interface ReportCardField {
  name: string;
  label: string;
  type: string;
}

const TeacherReportCardPage: React.FC = () => {
  const { templateId, classId } = useParams<{ templateId: string; classId: string }>();
  const { template, isTemplateLoading } = useReportCardTemplate(templateId!);
  const { students, isStudentsLoading } = useStudentsByClass(classId!);
  const { submit, isSubmitting } = useReportCards();
  const [gridData, setGridData] = useState<{ [studentId: string]: { [fieldName: string]: any } }>({});

  const handleInputChange = (studentId: string, fieldName: string, value: any) => {
    setGridData(prevData => ({
      ...prevData,
      [studentId]: {
        ...prevData[studentId],
        [fieldName]: value,
      },
    }));
  };

  const handleSubmit = async (studentId: string) => {
    const reportCardData = {
      template_id: parseInt(templateId!),
      student_id: parseInt(studentId),
      class_id: parseInt(classId!),
      term_id: 1, // This should be dynamic
      data: gridData[studentId],
    };
    await submit(reportCardData);
  };

  if (isTemplateLoading || isStudentsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fill Report Card</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Student Name</th>
            {template?.fields.map((field: ReportCardField) => (
              <th key={field.name} className="py-2">{field.label}</th>
            ))}
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student: any) => (
            <tr key={student.id}>
              <td className="border px-4 py-2">{student.name}</td>
              {template?.fields.map((field: ReportCardField) => (
                <td key={field.name} className="border px-4 py-2">
                  <input
                    type={field.type}
                    onChange={e => handleInputChange(student.id, field.name, e.target.value)}
                  />
                </td>
              ))}
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleSubmit(student.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherReportCardPage;