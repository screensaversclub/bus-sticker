const express = require("express");
const router = express.Router();
const qr = require("qrcode");
const { BSA, BSI } = require("../controllers/fetch-bus-stop-arrivals");

router.get("/info", (req, res) => {
	BSI()
	.then((results) => {
		res.json(results);
	});
});


router.get("/:busStopCode", (req, res) => {
	BSA(req.params.busStopCode)
		.then((results) => {
			let busStopInfoResults = results[0];
			let arrivalResults = results[1];

			var thisBusStop = busStopInfoResults.find((a) => {
				return parseInt(a.BusStopCode) == parseInt(req.params.busStopCode);
			});


			if (!!thisBusStop) {
				res.render("bus-stop-arrivals", {
					arrivals: arrivalResults.data,
					info: thisBusStop,
					title: `Bus Stop ${arrivalResults.data.BusStopCode}`,
				});
			} else {
				res.render("invalid-bus-stop");
			}
		})
		.catch((err) => {
			res.render("error", { err });
		});
});

router.get("/generate/:busStopCode", (req, res) => {
	let bsc = req.params.busStopCode;
	let url = `${process.env.SITEROOT}/bus-stop/${bsc}`;
	qr.toDataURL(url, { width: 500 }, (err, url) => {
		if (err) {
			res.end();
		} else {
			res.render("show-qr-code", { qrcode: url });
		}
	});
});

module.exports = router;
