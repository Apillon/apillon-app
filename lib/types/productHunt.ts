declare global {
  interface ProductHuntComment {
    id: number;
    url: string;
    user_uuid: string;
  }

  interface ProductHuntCommentResponse extends GeneralResponse<ProductHuntComment> {}
}
