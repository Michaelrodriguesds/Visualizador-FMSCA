import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicTable from './Components/DynamicTableConfig';
import { Typography, Container, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { format, startOfMonth, startOfWeek, startOfYear, endOfMonth, endOfWeek, endOfYear } from 'date-fns';
import Pagination from '@mui/material/Pagination';

const App = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortedColumn, setSortedColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDateRange, setFilterDateRange] = useState('all'); // All, Month, Week, Year
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://sheets.googleapis.com/v4/spreadsheets/1hB_LjBT9ezZigXnC-MblT2PXZledkZqBnvV23ssfSuE/values/FMSCA_records%20(2)!A1:K1000?key=AIzaSyCCi9ppThJhtnbYdEi_J62r3GVTAwO6UQU');
        
        const rows = response.data.values.slice(1);
        const headers = response.data.values[0];

        setColumns(headers.map(header => ({ id: header, label: header, minWidth: 100 })));
        setData(rows.map(row => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = header.includes('DT') ? format(new Date(row[index] || ''), 'dd/MM/yyyy') : row[index] || '';
          });
          return rowData;
        }));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (columnId) => {
    const isAsc = sortedColumn === columnId && sortOrder === 'asc';
    setSortedColumn(columnId);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDateRangeChange = (event) => {
    setFilterDateRange(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter(row => {
    const isMatchingSearch = Object.values(row).some(value =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filterDateRange === 'all') {
      return isMatchingSearch;
    }

    const dateField = row['Criado_DT']; // Adjust if you use a different date field
    if (!dateField) return isMatchingSearch;

    const date = new Date(dateField);

    switch (filterDateRange) {
      case 'month':
        return date >= startOfMonth(new Date()) && date <= endOfMonth(new Date()) && isMatchingSearch;
      case 'week':
        return date >= startOfWeek(new Date()) && date <= endOfWeek(new Date()) && isMatchingSearch;
      case 'year':
        return date >= startOfYear(new Date()) && date <= endOfYear(new Date()) && isMatchingSearch;
      default:
        return isMatchingSearch;
    }
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortedColumn) {
      if (sortOrder === 'asc') {
        return a[sortedColumn] > b[sortedColumn] ? 1 : -1;
      }
      return a[sortedColumn] < b[sortedColumn] ? 1 : -1;
    }
    return 0;
  });

  const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Visualizador FMSCA
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Pesquisar</InputLabel>
        <TextField
          variant="outlined"
          value={filter}
          onChange={handleSearch}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Filtrar por Data</InputLabel>
        <Select
          value={filterDateRange}
          onChange={handleDateRangeChange}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="month">Mês Atual</MenuItem>
          <MenuItem value="week">Semana Atual</MenuItem>
          <MenuItem value="year">Ano Atual</MenuItem>
        </Select>
      </FormControl>
      <DynamicTable 
        data={paginatedData} 
        columns={columns} 
        onSort={handleSort} 
        sortedColumn={sortedColumn} 
        sortOrder={sortOrder}
      />
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>
    </Container>
  );
};

export default App;
