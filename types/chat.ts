export {};

declare global {
  /**
   * Chat
   */
  interface ChatInterface extends BaseObjectInterface {
    space_uuid: string;
    project_uuid: string;
    about: string | null;
    image: string | null;
    tags: string | null;
    spaceId: number | null;
  }

  interface ChatResponse extends GeneralResponse<ChatInterface> {}
  interface ChatsResponse extends GeneralItemsResponse<ChatInterface> {}
}
