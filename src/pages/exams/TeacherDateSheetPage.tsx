import React, { useState, useEffect } from 'react';
import { examsService } from '../../services/exams';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const TeacherDateSheetPage: React.FC = () => {
    const [dateSheets, setDateSheets] = useState<any[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.teacher?.classes) {
            // Assuming the teacher's classes are available in the user object
            // You might need to fetch this data differently
            user.teacher.classes.forEach((classInfo: any) => {
                // You would also need to know the current term ID
                // This is a simplified example
                const termId = 1; // Replace with actual term ID
                examsService.getDateSheet(classInfo.id, termId)
                    .then(response => {
                        setDateSheets(prev => [...prev, response.data]);
                    });
            });
        }
    }, [user]);

    return (
        <div>
            <h1>Your Class Date-sheets</h1>
            {dateSheets.map(ds => (
                <div key={ds.id}>
                    <h2>Class {ds.class_info.name} - Term {ds.term.name}</h2>
                    <ul>
                        {ds.entries.map((entry: any) => (
                            <li key={entry.id}>
                                {entry.subject.name} - {entry.exam_date} at {entry.start_time}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default TeacherDateSheetPage;