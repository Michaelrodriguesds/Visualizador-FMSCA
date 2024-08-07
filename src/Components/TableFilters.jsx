import React from 'react';
import { FormGroup, FormControlLabel, Checkbox, Typography, Paper, TextField } from '@mui/material';

const TableFilters = ({ columns, onFilterChange }) => {
  const [filters, setFilters] = React.useState({});

  const handleFilterChange = (columnId, value) => {
    const newFilters = { ...filters, [columnId]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Paper style={{ padding: '16px', margin: '16px' }}>
      <Typography variant="h6">Filtros de Tabela</Typography>
      {columns.map(column => (
        <TextField
          key={column.id}
          label={column.label}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          onChange={(e) => handleFilterChange(column.id, e.target.value)}
        />
      ))}
    </Paper>
  );
};

export default TableFilters;
