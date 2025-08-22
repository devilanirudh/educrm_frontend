import React, { useState, useEffect } from 'react';
import { examsService } from '../../services/exams';

const TermsAndStructuresPage: React.FC = () => {
    const [terms, setTerms] = useState<any[]>([]);
    const [newTerm, setNewTerm] = useState({ name: '', academic_year: '' });

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        const response = await examsService.getTerms();
        setTerms(response.data);
    };

    const handleCreateTerm = async () => {
        await examsService.createTerm(newTerm);
        fetchTerms();
        setNewTerm({ name: '', academic_year: '' });
    };

    return (
        <div>
            <h1>Exam Terms & Structures</h1>
            <div>
                <h2>Create New Term</h2>
                <input
                    type="text"
                    placeholder="Term Name"
                    value={newTerm.name}
                    onChange={(e) => setNewTerm({ ...newTerm, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Academic Year"
                    value={newTerm.academic_year}
                    onChange={(e) => setNewTerm({ ...newTerm, academic_year: e.target.value })}
                />
                <button onClick={handleCreateTerm}>Create Term</button>
            </div>
            <div>
                <h2>Existing Terms</h2>
                <ul>
                    {terms.map((term) => (
                        <li key={term.id}>{term.name} ({term.academic_year})</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TermsAndStructuresPage;