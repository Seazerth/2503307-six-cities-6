export interface FileWriter {
  write(row: string): Promise<unknown>;
  close(): Promise<void>;
}
