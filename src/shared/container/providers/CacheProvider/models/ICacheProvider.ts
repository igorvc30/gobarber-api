export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  recover<T>(key: String): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
