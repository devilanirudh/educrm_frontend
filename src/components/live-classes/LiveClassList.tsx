import React from 'react';

interface LiveClass {
  id: number;
  topic: string;
  start_time: string;
  duration: number;
  status: string;
  recording_url?: string;
}

interface LiveClassListProps {
  title: string;
  classes: LiveClass[];
}

const LiveClassList: React.FC<LiveClassListProps> = ({ title, classes }) => {
  return (
    <div className="mb-6 p-4 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <ul>
        {classes.map((liveClass) => (
          <li key={liveClass.id} className="mb-2 p-2 border-b">
            <p className="font-bold">{liveClass.topic}</p>
            <p>Start Time: {new Date(liveClass.start_time).toLocaleString()}</p>
            <p>Duration: {liveClass.duration} minutes</p>
            <p>Status: {liveClass.status}</p>
            {liveClass.recording_url && (
              <p>
                Recording: <a href={liveClass.recording_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Watch here</a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveClassList;