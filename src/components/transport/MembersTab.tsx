import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { TransportMember } from '../../types/transport';

interface MembersTabProps {
  members: TransportMember[] | undefined;
  isLoading: boolean;
  createMember: (member: Omit<TransportMember, 'id'>) => void;
  updateMember: (args: { id: number; transportMember: Omit<TransportMember, 'id'> }) => void;
  deleteMember: (id: number) => void;
}

const MembersTab: React.FC<MembersTabProps> = ({ members, isLoading, createMember, updateMember, deleteMember }) => {
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Transport Members
      </Typography>
      <Button variant="contained" onClick={() => createMember({ user_id: 1, route_id: 1, stop_id: 1 })}>
        Add Member
      </Button>
      <ul>
        {members?.map(member => (
          <li key={member.id}>
            User ID: {member.user_id} - Route ID: {member.route_id} - Stop ID: {member.stop_id}
            <Button onClick={() => updateMember({ id: member.id, transportMember: { user_id: 1, route_id: 1, stop_id: 1 } })}>
              Update
            </Button>
            <Button onClick={() => deleteMember(member.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default MembersTab;