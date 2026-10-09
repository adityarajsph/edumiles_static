import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFormSubmissionDocument extends Document {
  formName: string;
  formSlug: string;
  data: Record<string, string | number | boolean>;
  sourcePage: string;
  packageRef: string;
  status: "new" | "read" | "contacted" | "closed";
  notes: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const FormSubmissionSchema = new Schema<IFormSubmissionDocument>(
  {
    formName:   { type: String, required: true, trim: true },
    formSlug:   { type: String, required: true, trim: true, lowercase: true },
    data:       { type: Schema.Types.Mixed, default: {} },
    sourcePage: { type: String, default: "" },
    packageRef: { type: String, default: "" },
    status:     { type: String, enum: ["new", "read", "contacted", "closed"], default: "new" },
    notes:      { type: String, default: "" },
    ipAddress:  { type: String, default: "" },
    userAgent:  { type: String, default: "" },
  },
  { timestamps: true }
);

FormSubmissionSchema.index({ formSlug: 1, status: 1 });
FormSubmissionSchema.index({ formSlug: 1 });
FormSubmissionSchema.index({ status: 1 });
FormSubmissionSchema.index({ createdAt: -1 });

const FormSubmissionModel: Model<IFormSubmissionDocument> =
  (mongoose.models.FormSubmission as Model<IFormSubmissionDocument>) ||
  mongoose.model<IFormSubmissionDocument>("FormSubmission", FormSubmissionSchema);

export default FormSubmissionModel;
