export interface DatabaseClient {
  isConnectedToDatabase(): boolean;
  connect(uri: string): Promise<void>;
  disconnect(): Promise<void>;
}
