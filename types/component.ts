export {};
declare global {
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

  interface MainNavItemInterface {
    name: string;
    icon: string;
    link?: string;
    soon?: boolean;
    new?: boolean;
    disabled?: boolean;
  }
  interface MainNavInterface {
    [key: string]: {
      disabled: boolean;
      items: Array<MainNavItemInterface>;
    };
  }
}
