const axios = require("axios");

const BSA = (busStopCode) => {
	let busStopEndpoint = `http://datamall2.mytransport.sg/ltaodataservice/BusStops`;
	let arrivalEndpoint = `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`;

	return Promise.all([
		Promise.resolve(),
		axios.get(arrivalEndpoint, {
			headers: {
				AccountKey: process.env.DATAMALLKEY,
				accept: "application/json",
			},
		}),
	]);
};

module.exports = BSA;
