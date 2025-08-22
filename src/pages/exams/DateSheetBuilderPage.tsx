import React, { useState } from 'react';
import { examsService } from '../../services/exams';

const DateSheetBuilderPage: React.FC = () => {
    const [dateSheet, setDateSheet] = useState<any>({ entries: [] });
    const [classId, setClassId] = useState('');
    const [termId, setTermId] = useState('');

    const handleFetchDateSheet = async () => {
        if (classId && termId) {
            const response = await examsService.getDateSheet(parseInt(classId), parseInt(termId));
            setDateSheet(response.data || { entries: [] });
        }
    };

    const handleSaveDateSheet = async () => {
        if (dateSheet.id) {
            await examsService.updateDateSheet(dateSheet.id, dateSheet);
        } else {
            await examsService.createDateSheet(dateSheet);
        }
        alert('Date-sheet saved!');
    };

    const handlePublishDateSheet = async () => {
        if (dateSheet.id) {
            await examsService.publishDateSheet(dateSheet.id);
            alert('Date-sheet published!');
        }
    };

    const handleAddEntry = () => {
        setDateSheet({
            ...dateSheet,
            entries: [...dateSheet.entries, { subject_id: '', exam_date: '', start_time: '', end_time: '', room_number: '', max_marks: 100, exam_type: 'Theory' }]
        });
    };

    return (
        <div>
            <h1>Date-sheet Builder</h1>
            <div>
                <input type="text" placeholder="Class ID" value={classId} onChange={(e) => setClassId(e.target.value)} />
                <input type="text" placeholder="Term ID" value={termId} onChange={(e) => setTermId(e.target.value)} />
                <button onClick={handleFetchDateSheet}>Load Date-sheet</button>
            </div>
            <div>
                {dateSheet.entries.map((entry: any, index: number) => (
                    <div key={index}>
                        <input type="text" placeholder="Subject ID" value={entry.subject_id} />
                        <input type="date" value={entry.exam_date} />
                        <input type="time" value={entry.start_time} />
                        <input type="time" value={entry.end_time} />
                        <input type="text" placeholder="Room" value={entry.room_number} />
                    </div>
                ))}
                <button onClick={handleAddEntry}>Add Entry</button>
            </div>
            <button onClick={handleSaveDateSheet}>Save as Draft</button>
            <button onClick={handlePublishDateSheet}>Publish</button>
        </div>
    );
};

export default DateSheetBuilderPage;