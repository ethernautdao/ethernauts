const ellipseAddress = (address = '', width = 10) => {
  if (!address) return '';
  return `${address.slice(0, width)}...${address.slice(-width)}`;
};

export default ellipseAddress;
