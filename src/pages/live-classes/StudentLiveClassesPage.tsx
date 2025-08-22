import React from 'react';

interface LiveClass {
  id: number;
  topic: string;
  start_time: string;
  duration: number;
}

const upcomingClasses: LiveClass[] = [
  { id: 1, topic: 'Introduction to Algebra', start_time: '2025-09-01T10:00:00Z', duration: 60 },
  { id: 2, topic: 'World War II History', start_time: '2025-09-02T14:00:00Z', duration: 90 },
];

const StudentLiveClassesPage: React.FC = () => {
  const handleJoinClass = async (classId: number) => {
    try {
      const response = await fetch(`/api/v1/live-classes/${classId}/join`, {
        method: 'POST',
      });
      if (response.ok) {
        // Navigate to the video call page
        console.log(`Successfully joined class ${classId}`);
      }
    } catch (error) {
      console.error('Error joining class:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Upcoming Live Classes</h1>
      <ul>
        {upcomingClasses.map((liveClass) => (
          <li key={liveClass.id} className="mb-4 p-4 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold">{liveClass.topic}</p>
              <p>Start Time: {new Date(liveClass.start_time).toLocaleString()}</p>
              <p>Duration: {liveClass.duration} minutes</p>
            </div>
            <button
              onClick={() => handleJoinClass(liveClass.id)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Join Class
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentLiveClassesPage;