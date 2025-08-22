import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getReportCardTemplates,
  getReportCardTemplate,
  createReportCardTemplate,
  publishReportCard,
  submitReportCard,
  generateReportCardPdf,
  getStudentsByClass,
  getSubmittedReportCards,
  approveReportCard,
  getStudentReportCard,
} from '../services/reportCards';

export const useReportCards = () => {
  const queryClient = useQueryClient();

  const { data: templates, isLoading: isTemplatesLoading } = useQuery(
    'reportCardTemplates',
    getReportCardTemplates
  );

  const { data: submittedReportCards, isLoading: isSubmittedReportCardsLoading } = useQuery(
    'submittedReportCards',
    getSubmittedReportCards
  );

  const { mutate: createTemplate, isLoading: isCreatingTemplate } = useMutation(
    (data: any) => createReportCardTemplate(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('reportCardTemplates');
      },
    }
  );

  const { mutate: publish, isLoading: isPublishing } = useMutation(
    (data: any) => publishReportCard(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('submittedReportCards');
      },
    }
  );

  const { mutate: submit, isLoading: isSubmitting } = useMutation(
    (data: any) => submitReportCard(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('submittedReportCards');
      },
    }
  );

  const { mutate: generatePdf, isLoading: isGeneratingPdf } = useMutation(
    (id: string) => generateReportCardPdf(id)
  );

  const { mutate: approve, isLoading: isApproving } = useMutation(
    (id: string) => approveReportCard(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('submittedReportCards');
      },
    }
  );

  return {
    templates,
    isTemplatesLoading,
    submittedReportCards,
    isSubmittedReportCardsLoading,
    createTemplate,
    isCreatingTemplate,
    publish,
    isPublishing,
    submit,
    isSubmitting,
    generatePdf,
    isGeneratingPdf,
    approve,
    isApproving,
  };
};

export const useReportCardTemplate = (id: string) => {
  const { data: template, isLoading: isTemplateLoading } = useQuery(
    ['reportCardTemplate', id],
    () => getReportCardTemplate(id)
  );

  return {
    template,
    isTemplateLoading,
  };
};

export const useStudentsByClass = (classId: string) => {
  const { data: students, isLoading: isStudentsLoading } = useQuery(
    ['studentsByClass', classId],
    () => getStudentsByClass(classId)
  );

  return {
    students,
    isStudentsLoading,
  };
};

export const useStudentReportCard = (studentId: string) => {
  const { data: reportCard, isLoading: isReportCardLoading } = useQuery(
    ['studentReportCard', studentId],
    () => getStudentReportCard(studentId)
  );

  return {
    reportCard,
    isReportCardLoading,
  };
};