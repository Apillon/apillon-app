declare global {
  interface ProductHuntComment {
    id: number;
    url: string;
    username: string;
    user_uuid: string;
  }

  interface ProductHuntCommentResponse extends GeneralResponse<ProductHuntComment> {}
}
