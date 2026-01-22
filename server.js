import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./models/index.js";
import blogRoutes from "./routes/blogRoutes.js";
import setupSwagger from "./config/swagger.js";
import { createDatabase } from "pg-god";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(cors());
app.use(bodyParser.json());
app.use("/api", authRoutes);
app.use("/api", blogRoutes);
setupSwagger(app);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await createDatabase(
      {
        databaseName: process.env.DB_NAME,
        errorIfExist: false,
      },
      {
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
      }
    );
    console.log(`✅ Database '${process.env.DB_NAME}' ensured!`);

    await sequelize.authenticate();
    console.log("DB Connected!");

    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger Docs available at http://localhost:${PORT}/swagger`);
    });
  } catch (error) {
    console.error("DB Connection Error: ", error);
  }
};

startServer();
