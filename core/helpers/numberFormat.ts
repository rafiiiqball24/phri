const formatNumber = (value: string | number) => {
  const number = Number(value);
  return number.toLocaleString('id-ID');
};

export const number = (value: string | number) => {
  return formatNumber(value);
};

export const toRupiah = (value: string | number) => {
  return 'Rp' + formatNumber(value);
};
