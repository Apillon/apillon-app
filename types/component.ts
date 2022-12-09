export interface SocialInterface {
  name: string;
  link: string;
  icon?: string;
  iconName?: string;
}

export type FileListItem = {
  id: string;
  name: string;
  status: FileUploadStatus;
  percentage: number;
  size: number;
};
