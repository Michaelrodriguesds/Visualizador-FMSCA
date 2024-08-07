import React from 'react';

const GroupBySelector = ({ groupBy, setGroupBy }) => {
  return (
    <div>
      <select onChange={e => setGroupBy(e.target.value)} value={groupBy}>
        <option value="none">Nenhum</option>
        <option value="month">Mês</option>
        <option value="week">Semana</option>
        <option value="year">Ano</option>
      </select>
    </div>
  );
};

export default GroupBySelector;
