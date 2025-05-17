import mongoose from 'mongoose';
const { Schema } = mongoose;

const documentSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
    default: 'Text',
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Untitled Document',
  },
  content: {
    type: Object, // Store Quill Delta as a JSON object
    default: { ops: [{ insert: '\n' }] }, // Default empty Delta
  },
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  isPublic: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});
const Document = mongoose.model('Document', documentSchema);
export default Document;