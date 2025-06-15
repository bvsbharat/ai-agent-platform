import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
  name: string;
  description: string;
  creationMethod: 'prompt' | 'custom-llm';
  category: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  prompt?: string;
  customLLMConfig?: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    apiEndpoint?: string;
  };
  tags: string[];
  metrics: {
    views: number;
    runs: number;
    likes: number;
  };
  deploymentStatus: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const AgentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  creationMethod: {
    type: String,
    enum: ['prompt', 'custom-llm'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Assistant', 'Automation', 'Analytics', 'Content', 'Customer Service', 'Development', 'Education', 'Finance', 'Healthcare', 'Marketing', 'Other']
  },
  creator: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  prompt: {
    type: String,
    required: function(this: IAgent) {
      return this.creationMethod === 'prompt';
    }
  },
  customLLMConfig: {
    model: String,
    temperature: { type: Number, min: 0, max: 2 },
    maxTokens: { type: Number, min: 1, max: 4000 },
    systemPrompt: String,
    apiEndpoint: String,
    required: function(this: IAgent) {
      return this.creationMethod === 'custom-llm';
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  metrics: {
    views: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  deploymentStatus: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date
}, {
  timestamps: true
});

// Indexes for better query performance
AgentSchema.index({ category: 1, deploymentStatus: 1 });
AgentSchema.index({ 'creator.id': 1 });
AgentSchema.index({ tags: 1 });
AgentSchema.index({ 'metrics.views': -1 });
AgentSchema.index({ 'metrics.runs': -1 });
AgentSchema.index({ createdAt: -1 });
AgentSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);