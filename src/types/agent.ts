export interface AgentQuery {
  deploymentStatus: string;
  category?: string;
  $text?: { $search: string };
}

export interface AgentSortQuery {
  [key: string]: 1 | -1;
}

export interface AgentData {
  name: string;
  description: string;
  creationMethod: string;
  category: string;
  creator: {
    name: string;
    email: string;
  };
  tags: string[];
  deploymentStatus: string;
  metrics: {
    views: number;
    runs: number;
    likes: number;
  };
  [key: string]: unknown; // For additional dynamic properties
}