import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import Blog from "./Blog.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "blogs", key: "id" }
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT, allowNull: false }
  },
  {
    tableName: "comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Associations
Comment.belongsTo(Blog, { foreignKey: "blogId", as: "blog" });
Blog.hasMany(Comment, { foreignKey: "blogId", as: "comments" });

export default Comment;
