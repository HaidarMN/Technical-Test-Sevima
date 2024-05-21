export type GlobalInputType = {
  name: string;
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  primary?: boolean | false;
  disabled?: boolean | false;
  control?: any;
  passValue?: (e: any) => void;
};

export type RadioInputType = GlobalInputType & {
  options: { value: string; label: string }[];
};

export type SelectInputType = GlobalInputType & {
  options: object[];
  multi?: boolean;
};

export type CheckboxInputType = GlobalInputType & {
  options: { value: string; label: string }[];
};

export type DatepickerInputType = GlobalInputType & {
  dateFormat?: string;
  time?: boolean;
};

export type FileInputType = GlobalInputType & {
  typeFile?: string | string[];
};

export type TextareaInputType = GlobalInputType & {
  rows?: number;
};

export type CaptchaInputType = {
  passValue: (e: any) => void;
};
