import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Blog = sequelize.define("Blog", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    content: { type: DataTypes.TEXT },
    author: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING }
}, {
    tableName: "blogs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default Blog;
