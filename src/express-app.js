const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require('morgan')
const {
  authRoutes,
  skillRoutes,
  assessmentRoutes,
  questionRoutes,
  topicRoutes,
  optionRoutes,
  candidateRoutes,
  proctorRoutes,
  answerRoutes,
  appRoutes,
  reportRoutes,
} = require("./routes");
const { concatenateAndSaveVideo } = require("./utils/video");
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

module.exports = async (app) => {
  app.use(morgan('tiny'));
  app.use(cors(corsOptions));
  app.use(bodyParser.urlencoded({ extended: false, limit: "100mb" }));
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(cookieParser());
 
  app.use("/api/auth", authRoutes);
  app.use("/api/skill", skillRoutes);
  app.use("/api/assessment", assessmentRoutes);
  app.use("/api/question", questionRoutes);
  app.use("/api/topic", topicRoutes);
  app.use("/api/option", optionRoutes);
  app.use("/api/candidate", candidateRoutes);
  app.use("/api/proctor", proctorRoutes);
  app.use("/api/answer", answerRoutes);
  app.use("/api/app", appRoutes);
  app.use("/api/report", reportRoutes);
  app.use("/api", (req, res) => {
    res.send("hello");
  });

  app.use((error, req, res, next) => {
    if (error) {
      try {
        return res.status(error.status || 500).json({
          status: "error",
          message: error.message,
        });
      } catch (error) {
        console.log(
          "--------------------- ERROR IN ERROR ---------------------",
          error
        );
      }
    } else {
      next();
    }
  });
  process.on("uncaughtException", (err) => {
    console.log(err);
  });
};
