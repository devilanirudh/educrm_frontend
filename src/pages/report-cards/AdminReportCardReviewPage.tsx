import React from 'react';
import { useReportCards } from '../../hooks/useReportCards';

const AdminReportCardReviewPage: React.FC = () => {
  const { submittedReportCards, isSubmittedReportCardsLoading, approve, generatePdf } = useReportCards();

  const handleApprove = async (reportCardId: string) => {
    await approve(reportCardId);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Review Submitted Report Cards</h1>
      {isSubmittedReportCardsLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submittedReportCards?.map((reportCard: any) => (
            <div key={reportCard.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold">{reportCard.student.name}</h2>
              <p>Class: {reportCard.class_info.name}</p>
              <p>Submitted by: {reportCard.submitted_by.full_name}</p>
              <div className="mt-4">
                <button
                  onClick={() => handleApprove(reportCard.id)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => generatePdf(reportCard.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Generate PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReportCardReviewPage;