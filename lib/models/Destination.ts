import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDestinationDocument extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;       // Cloudinary URL
  tag: string;         // e.g. "Beach", "Heritage"
  tagColor: string;    // hex color for the tag badge
  order: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<IDestinationDocument>(
  {
    name:        { type: String, required: true, unique: true, trim: true },
    slug:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    image:       { type: String, default: "" },
    tag:         { type: String, default: "" },
    tagColor:    { type: String, default: "#FE8100" },
    order:       { type: Number, default: 0 },
    isFeatured:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

DestinationSchema.index({ order: 1 });
DestinationSchema.index({ isFeatured: 1 });

const DestinationModel: Model<IDestinationDocument> =
  (mongoose.models.Destination as Model<IDestinationDocument>) ||
  mongoose.model<IDestinationDocument>("Destination", DestinationSchema);

export default DestinationModel;
