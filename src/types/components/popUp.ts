export type ModalType = {
  modalTitle: string;
  children: React.ReactNode;
  buttonTrigger: React.ReactElement;
  buttonClose: React.ReactElement;
  buttonAction: React.ReactElement;
  onButtonAction: () => void;
  width?: "sm" | "md" | "lg" | "xl";
};
