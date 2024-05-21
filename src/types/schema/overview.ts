export type CardTotalType = {
  title: string;
  isLoading: boolean;
  total: number | undefined;
};

export type ListTotalParams = {
  unresolved: number;
  overview: number;
  open: number;
  on_hold: number;
};

export type DataChartParams = {
  month: string;
  high: number;
  normal: number;
  low: number;
};
