export interface SearchFilter {
  deploymentStatus: string;
  category?: string;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
    tags?: { $in: RegExp[] };
  }>;
}

export interface SortObject {
  [key: string]: 1 | -1;
}