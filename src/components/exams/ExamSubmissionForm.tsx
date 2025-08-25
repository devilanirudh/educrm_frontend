import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { examsService } from '../../services/exams';

interface ExamSubmissionFormProps {
  open: boolean;
  onClose: () => void;
  examId: number;
  examTitle: string;
}

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options?: string[];
  points: number;
  order_number: number;
}

interface Answer {
  text?: string;
  option?: string;
}

const ExamSubmissionForm: React.FC<ExamSubmissionFormProps> = ({ 
  open, 
  onClose, 
  examId, 
  examTitle 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: Answer}>({});
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch exam questions
  const { data: questionsData, isLoading, error: questionsError } = useQuery(
    ['exam-questions', examId],
    () => examsService.getExamQuestions(examId),
    {
      enabled: open,
    }
  );

  // Submit exam mutation
  const submitMutation = useMutation({
    mutationFn: (data: { answers: any[]; time_taken_minutes: number; notes?: string }) =>
      examsService.submitExam(examId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-exams'] });
      onClose();
    },
  });

  const questions = questionsData?.questions || [];

  // Timer effect
  useEffect(() => {
    if (open && !timeStarted) {
      setTimeStarted(new Date());
    }

    const timer = setInterval(() => {
      if (timeStarted) {
        const elapsed = Math.floor((new Date().getTime() - timeStarted.getTime()) / 1000);
        setTimeElapsed(elapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [open, timeStarted]);

  const handleAnswerChange = (questionId: number, value: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const answersArray = Object.entries(answers).map(([questionId, answer]: [string, Answer]) => ({
        question_id: parseInt(questionId),
        answer_text: answer.text || null,
        selected_option: answer.option || null,
      }));

      const timeTakenMinutes = Math.floor(timeElapsed / 60);

      await submitMutation.mutateAsync({
        answers: answersArray,
        time_taken_minutes: timeTakenMinutes,
      });
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to submit exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index: number) => {
    const questionId = questions[index]?.id;
    return answers[questionId] ? 'answered' : 'unanswered';
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (questionsError) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">
            Failed to load exam questions: {(questionsError as any).message || 'Unknown error'}
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{examTitle}</Typography>
          <Chip 
            label={`Time: ${formatTime(timeElapsed)}`} 
            color="primary" 
            variant="outlined"
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Question Navigation */}
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" mb={1}>Question Navigation</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {questions.map((question: Question, index: number) => (
                <Chip
                  key={question.id}
                  label={`Q${index + 1}`}
                  color={getQuestionStatus(index) === 'answered' ? 'success' : 'default'}
                  variant={currentQuestion === index ? 'filled' : 'outlined'}
                  onClick={() => setCurrentQuestion(index)}
                  size="small"
                />
              ))}
            </Box>
          </Paper>

          {/* Current Question */}
          {currentQuestionData && (
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Question {currentQuestion + 1} of {questions.length}
                </Typography>
                <Chip 
                  label={`${currentQuestionData.points} points`} 
                  color="secondary" 
                  size="small"
                />
              </Box>

              <Typography variant="body1" mb={3}>
                {currentQuestionData.question_text}
              </Typography>

              {/* Question Type Specific Input */}
              {currentQuestionData.question_type === 'mcq' && currentQuestionData.options && (
                <FormControl component="fieldset">
                  <FormLabel component="legend">Select your answer:</FormLabel>
                  <RadioGroup
                    value={answers[currentQuestionData.id]?.option || ''}
                    onChange={(e) => handleAnswerChange(currentQuestionData.id, { option: e.target.value })}
                  >
                    {currentQuestionData.options.map((option: string, index: number) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              {currentQuestionData.question_type === 'true_false' && (
                <FormControl component="fieldset">
                  <FormLabel component="legend">Select your answer:</FormLabel>
                  <RadioGroup
                    value={answers[currentQuestionData.id]?.option || ''}
                    onChange={(e) => handleAnswerChange(currentQuestionData.id, { option: e.target.value })}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="True" />
                    <FormControlLabel value="false" control={<Radio />} label="False" />
                  </RadioGroup>
                </FormControl>
              )}

              {(currentQuestionData.question_type === 'short_answer' || currentQuestionData.question_type === 'essay') && (
                <TextField
                  fullWidth
                  multiline
                  rows={currentQuestionData.question_type === 'essay' ? 6 : 3}
                  label="Your answer"
                  value={answers[currentQuestionData.id]?.text || ''}
                  onChange={(e) => handleAnswerChange(currentQuestionData.id, { text: e.target.value })}
                  placeholder="Type your answer here..."
                />
              )}
            </Paper>
          )}

          {/* Progress Summary */}
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" mb={1}>Progress Summary</Typography>
            <Box display="flex" gap={2}>
              <Chip 
                label={`Answered: ${Object.keys(answers).length}`} 
                color="success" 
                size="small"
              />
              <Chip 
                label={`Remaining: ${questions.length - Object.keys(answers).length}`} 
                color="default" 
                size="small"
              />
            </Box>
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handlePreviousQuestion} 
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        {currentQuestion < questions.length - 1 ? (
          <Button 
            onClick={handleNextQuestion} 
            variant="contained"
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </Button>
        )}
        
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExamSubmissionForm;
