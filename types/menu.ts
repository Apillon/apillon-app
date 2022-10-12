export interface MainNavItemInterface {
  name: string;
  icon: string;
  link?: string | null;
  new?: boolean | null;
}
export default interface MainNavInterface {
  [key: string]: Array<MainNavItemInterface>;
}
