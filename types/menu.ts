export {};

declare global {
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
