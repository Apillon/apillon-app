export interface SocialInterface {
  name: string;
  link: string;
  icon?: string;
  iconName?: string;
}

export type FileListItemType = {
  id: string;
  name: string;
  status: FileUploadStatus;
  percentage: number;
  size: number;
  timestamp: number;
  progress?: any;
  uploadSpeed?: number;
};
