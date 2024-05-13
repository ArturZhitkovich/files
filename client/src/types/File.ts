type FileType = {
  id: number;
  fileName: string;
  size: string;
  lastModified: Date;
  createdDate: Date;
  updatedDate: Date;
};

type FIleWithSelected = FileType & {
  selected: boolean;
};

export type { FileType, FIleWithSelected };
