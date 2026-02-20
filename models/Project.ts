import mongoose, { Schema, model, models } from "mongoose";

export interface IProject {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Avoid recompiling model in Next.js hot-reload
const Project = models.Project ?? model<IProject>("Project", ProjectSchema);

export default Project;
