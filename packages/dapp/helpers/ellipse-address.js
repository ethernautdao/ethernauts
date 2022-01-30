const ellipseAddress = (address = '', width = 4) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-width)}`;
};

export default ellipseAddress;
