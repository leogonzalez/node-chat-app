const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (from, lat, lon) => {
  return {
    url: `https://www.google.com/maps/place/@${lat},${lon}`,
    from,
    createdAt: new Date().getTime()
  };
};

module.exports = { generateMessage, generateLocationMessage };
