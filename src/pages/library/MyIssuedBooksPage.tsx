import React from 'react';
import { useQuery } from 'react-query';
import { Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getBookIssues } from '../../services/library';

const MyIssuedBooksPage: React.FC = () => {
  const { data, error, isLoading } = useQuery('myBookIssues', getBookIssues); // TODO: This should be filtered by member

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error fetching issued books</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Issued Books
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book ID</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Return Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((issue: any) => (
              <TableRow key={issue.id}>
                <TableCell>{issue.book_id}</TableCell>
                <TableCell>{issue.issue_date}</TableCell>
                <TableCell>{issue.due_date}</TableCell>
                <TableCell>{issue.return_date || 'Not returned'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyIssuedBooksPage;