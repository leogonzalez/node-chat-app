const moment = require('moment');

const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

const generateLocationMessage = (from, lat, lon) => {
  return {
    url: `https://www.google.com/maps/place/${lat},${lon}`,
    from,
    createdAt: moment().valueOf()
  };
};

module.exports = { generateMessage, generateLocationMessage };
