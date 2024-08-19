import React from 'react';

const CurrencyFormatter = ({ value }) => {
  const formattedCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR', // Currency code for Euro
  }).format(value);

  return <span>{formattedCurrency}</span>;
};

export default CurrencyFormatter;
