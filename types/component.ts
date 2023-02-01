export {};
declare global {
  export interface SocialInterface {
    name: string;
    link: string;
    icon?: string;
    iconName?: string;
  }

  export interface FileListItemType extends NFileInfo {
    percentage: number;
    size: number;
    timestamp: number;
    progress?: any;
    uploadSpeed?: number;
    onFinish: any;
    onError: any;
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
}
