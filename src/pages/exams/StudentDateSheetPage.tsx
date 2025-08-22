import React, { useState, useEffect } from 'react';
import { examsService } from '../../services/exams';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const StudentDateSheetPage: React.FC = () => {
    const [dateSheet, setDateSheet] = useState<any>(null);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.student?.current_class_id) {
            // You would also need to know the current term ID
            // This is a simplified example
            const termId = 1; // Replace with actual term ID
            examsService.getDateSheet(user.student.current_class_id, termId)
                .then(response => {
                    setDateSheet(response.data);
                });
        }
    }, [user]);

    return (
        <div>
            <h1>Your Date-sheet</h1>
            {dateSheet && (
                <div>
                    <h2>Class {dateSheet.class_info.name} - Term {dateSheet.term.name}</h2>
                    <ul>
                        {dateSheet.entries.map((entry: any) => (
                            <li key={entry.id}>
                                {entry.subject.name} - {entry.exam_date} at {entry.start_time}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StudentDateSheetPage;