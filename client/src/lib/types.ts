export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface CorrelationData {
  [variable: string]: {
    [otherVariable: string]: number;
  };
}

export interface ForecastData {
  dates: string[];
  values: number[];
  confidence: {
    upper: number[];
    lower: number[];
  };
}

export interface VariableImpact {
  [variable: string]: number;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface DragEvent {
  nodeId: string;
  position: NodePosition;
}

export interface ConnectionEvent {
  sourceId: string;
  targetId: string;
}
