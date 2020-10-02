require("dotenv").config();
const express = require("express");
const app = express();
const exphbs = require("exphbs");
const winston = require("winston");

const logger = winston.createLogger({
	level: "info",
	transports: [new winston.transports.File({ filename: "usage.log" })],
});

app.engine("hbs", exphbs);
app.set("view engine", "hbs");
app.set("view options", { layout: "main" });

app.use((req, res, next) => {
	if (req.url.indexOf("bus-stop") > -1) {
		logger.log("info", { url: req.url, date: new Date() });
	}
	next();
});

app.use("/", express.static("static"));
app.use("/bus-stop", require("./routes/bus-stop"));

exphbs.handlebars.registerHelper("estWait", (a) => {
	let dateNow = new Date();
	let dateThen = new Date(a);
	let wait = Math.floor((dateThen - dateNow) / 1000 / 60);

	if (!isNaN(wait)) {
		if (wait <= 0) {
			return "arriving";
		}
		return wait == 1 ? wait + " min" : wait + " mins";
	} else {
		return "-";
	}
});

const _port = process.env.PORT || 3000;
app.listen(_port, () => {
	console.log(`listening on port ${_port}`);
});
