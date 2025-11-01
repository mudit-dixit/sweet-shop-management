import mongoose from 'mongoose';

// Interface for TypeScript
export interface ISweet extends mongoose.Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Sweet = mongoose.model<ISweet>('Sweet', sweetSchema);
export default Sweet;