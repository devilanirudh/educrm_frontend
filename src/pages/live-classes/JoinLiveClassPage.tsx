import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useJoinLiveClass } from '../../hooks/useLiveClasses';

const JoinLiveClassPage: React.FC = () => {
  const { id } = useParams();
  const joinLiveClassMutation = useJoinLiveClass();
  const [meetingUrl, setMeetingUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [iframeError, setIframeError] = useState<boolean>(false);

  useEffect(() => {
    const join = async () => {
      try {
        if (!id) return;
        const res = await joinLiveClassMutation.mutateAsync(parseInt(id, 10));
        setMeetingUrl(res.meeting_url);
      } catch (e: any) {
        setError(e?.response?.data?.detail || 'Failed to join live class');
      }
    };
    join();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold text-red-600">{error}</h1>
        </div>
      </div>
    );
  }

  if (!meetingUrl) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Preparing your meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-5xl h-[70vh]">
        {!iframeError ? (
          <iframe
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            src={meetingUrl}
            className="w-full h-full border-0 rounded-xl shadow-soft"
            title="Live Class Meeting"
            onError={() => setIframeError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-50 rounded-xl border border-surface-200">
            <div className="text-center">
              <p className="text-surface-700 mb-4">Unable to embed the meeting. This server may block embedding.</p>
              <a
                href={meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700"
              >
                Open Meeting in New Tab
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinLiveClassPage;


