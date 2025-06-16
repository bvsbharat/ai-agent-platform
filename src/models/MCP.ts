import mongoose, { Schema, Document } from 'mongoose';

export interface IMCP extends Document {
  id: string;
  name: string;
  link: string;
  description: string;
  logo: string;
  company_id: string;
  slug: string;
  active: boolean;
  plan: string;
  order: number;
  fts: string;
  config: any;
  owner_id: string;
  created_at: Date;
  updatedAt: Date;
  installCount?: number;
  category?: string;
  tags?: string[];
}

const MCPSchema: Schema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  company_id: {
    type: String,
    required: false
  },
  slug: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  plan: {
    type: String,
    default: 'standard'
  },
  order: {
    type: Number,
    default: 0
  },
  fts: {
    type: String,
    default: ''
  },
  config: {
    type: Schema.Types.Mixed,
    default: null
  },
  owner_id: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  installCount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: 'General'
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Create indexes for better performance
MCPSchema.index({ category: 1 });
MCPSchema.index({ installCount: -1 });
MCPSchema.index({ createdAt: -1 });
MCPSchema.index({ id: 1 });

export default mongoose.models.MCP || mongoose.model<IMCP>('MCP', MCPSchema);