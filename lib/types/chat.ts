export enum SocialChains {
  SOCIAL = 1,
  X_SOCIAL = 2,
}

export enum SocialTransactionType {
  SPACE = 1,
  POST = 2,
}

export enum SpaceStatus {
  FAILED = 100,
}

export enum PostType {
  REGULAR = 1,
  SHARED = 2,
  COMMENT = 3,
}

export enum SocialStatus {
  DRAFT = 1,
  INCOMPLETE = 2,
  INACTIVE = 3,
  ACTIVE = 5,
  BLOCKED = 7,
  MARKED_FOR_DELETION = 8,
  DELETED = 9,
  FAILED = 100,
}

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

  /**
   * Post
   */
  interface PostInterface extends BaseObjectInterface {
    body: string;
    postId: number | null;
    postType: number;
    post_uuid: string;
    project_uuid: string;
    tags: string | null;
    title: string;
  }

  interface PostResponse extends GeneralResponse<PostInterface> {}
  interface PostsResponse extends GeneralItemsResponse<PostInterface> {}
}
