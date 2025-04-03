export interface EasyPaginationOptions {
  type?: string;
  title?: {
    enable?: boolean;
    text?: string;
    align?: string;
    alignClass?: string;
    padding?: string;
  };
  height?: string;
  width?: string;
  data?: any[];
  dataRow?: number;
  columns?: any[];
  navigation?: {
    align?: string,
    alignClass?: string,
    backButton?: {
      text?: string;
    },
    nextButton?: {
      text?: string;
    },
  }
}
