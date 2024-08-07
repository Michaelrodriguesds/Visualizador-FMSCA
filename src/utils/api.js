import axios from 'axios';

// Substitua pela sua chave de API
const apiKey = 'AIzaSyCCi9ppThJhtnbYdEi_J62r3GVTAwO6UQU';

// Substitua pelo ID da sua planilha
const spreadsheetId = '1hB_LjBT9ezZigXnC-MblT2PXZledkZqBnvV23ssfSuE';

// Nome da aba
const sheetName = 'FMSCA_records (2)'; // Certifique-se de que o nome da aba está correto

export const fetchDataFromGoogleSheets = async () => {
  try {
    const range = `${sheetName}!A1:K1000`; // Defina o intervalo de células
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    const response = await axios.get(url);

    const rows = response.data.values || [];
    if (rows.length > 0) {
      const headers = rows[0]; // Cabeçalhos da planilha
      const data = rows.slice(1).map(row => {
        return headers.reduce((obj, header, index) => {
          obj[header] = row[index] || '';
          return obj;
        }, {});
      });
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar dados da planilha:', error);
    return [];
  }
};
