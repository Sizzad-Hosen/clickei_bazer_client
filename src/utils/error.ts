interface TErrorSource {
  path: string;
  message: string;
}

interface ErrorData {
  errorSources?: TErrorSource[];
  // You can add other properties here if needed
}

export function hasDataProperty(obj: unknown): obj is { data: unknown } {
  return typeof obj === 'object' && obj !== null && 'data' in obj;
}

export  function isErrorData(obj: unknown): obj is ErrorData {
  return typeof obj === 'object' && obj !== null && 'errorSources' in obj;
}
