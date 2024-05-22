export type ButtonType = {
  type?: "submit" | "button";
  primary?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
};
