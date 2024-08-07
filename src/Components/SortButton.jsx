import React from 'react';

const SortButton = ({ sortDirection, setSortDirection }) => {
  return (
    <button onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
      Classificar {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
    </button>
  );
};

export default SortButton;
