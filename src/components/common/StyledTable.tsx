import React, { useState } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
}

interface StyledTableProps {
  columns: Column[];
  data: any[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  renderRow?: (row: any, visibleColumns: string[]) => React.ReactNode;
  externalVisibleColumns?: string[];
  onVisibleColumnsChange?: (columns: string[]) => void;
  maxHeight?: number | string;
}

const StyledTable: React.FC<StyledTableProps> = ({
  columns,
  data,
  total,
  page,
  rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    renderRow,
    externalVisibleColumns,
    onVisibleColumnsChange,
    maxHeight = 600,
  }) => {
  const [internalVisibleColumns, setInternalVisibleColumns] = useState<string[]>(columns.map(c => c.id));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Use external visible columns if provided, otherwise use internal state
  const visibleColumns = externalVisibleColumns || internalVisibleColumns;

  const handleColumnToggle = (columnId: string) => {
    const newVisibleColumns = visibleColumns.includes(columnId) 
      ? visibleColumns.filter(id => id !== columnId) 
      : [...visibleColumns, columnId];
    
    if (onVisibleColumnsChange) {
      onVisibleColumnsChange(newVisibleColumns);
    } else {
      setInternalVisibleColumns(newVisibleColumns);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, flexShrink: 0 }}>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>Visible Columns</Typography>
          {columns.map(column => (
            <MenuItem key={column.id} onClick={() => handleColumnToggle(column.id)}>
              <Checkbox checked={visibleColumns.includes(column.id)} />
              {column.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <TableContainer sx={{ 
        flex: 1, 
        width: '100%',
        maxWidth: '100%',
        overflow: 'auto', 
        '&::-webkit-scrollbar': { 
          width: 8, 
          height: 8 
        }, 
        '&::-webkit-scrollbar-track': { 
          background: '#f1f1f1',
          borderRadius: 4
        }, 
        '&::-webkit-scrollbar-thumb': { 
          background: '#888', 
          borderRadius: 4,
          '&:hover': {
            background: '#555'
          }
        },
        '&::-webkit-scrollbar-corner': {
          background: '#f1f1f1'
        }
      }}>
        <Table stickyHeader sx={{ tableLayout: 'fixed', minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              {columns
                .filter(c => visibleColumns.includes(c.id))
                .map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ width: column.minWidth || 150, minWidth: column.minWidth || 150 }}
                    sx={{ backgroundColor: 'background.paper', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row =>
              renderRow ? (
                renderRow(row, visibleColumns)
              ) : (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ height: '48px' }}>
                  {columns
                    .filter(c => visibleColumns.includes(c.id))
                    .map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} sx={{ height: '48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: column.minWidth || 150, minWidth: column.minWidth || 150 }}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ flexShrink: 0 }}
      />
    </Paper>
  );
};

export default StyledTable;