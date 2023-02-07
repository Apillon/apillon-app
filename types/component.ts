export {};
declare global {
  interface SocialInterface {
    name: string;
    link: string;
    icon?: string;
    iconName?: string;
  }

  interface FileListItemType extends NFileInfo {
    percentage: number;
    size: number;
    timestamp: number;
    path?: string;
    progress?: any;
    uploadSpeed?: number;
    onFinish: any;
    onError: any;
  }

  interface UploadFileType {
    contentType: string;
    fileName: string;
    path: string;
  }

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

  type TagType = 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning';
}
