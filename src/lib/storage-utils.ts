/**
 * Enhanced localStorage utilities with compression and better error handling
 */

// Storage quota management
const STORAGE_QUOTA_WARNING = 5 * 1024 * 1024; // 5MB warning threshold
const MAX_STORAGE_ATTEMPTS = 3;

interface StorageStats {
  used: number;
  available: number;
  percentage: number;
}

export class StorageManager {
  private static instance: StorageManager;
  private compressionEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Get storage usage statistics
  public getStorageStats(): StorageStats {
    try {
      let used = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          used += (key.length + (value?.length || 0)) * 2; // UTF-16 encoding
        }
      }

      // Estimate available storage (browsers typically allow 5-10MB)
      const estimated = 10 * 1024 * 1024; // 10MB estimate
      const available = Math.max(0, estimated - used);
      const percentage = (used / estimated) * 100;

      return { used, available, percentage };
    } catch (error) {
      console.warn('Could not calculate storage stats:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  // Simple compression for JSON strings
  private compress(data: string): string {
    if (!this.compressionEnabled) return data;
    
    try {
      // Simple run-length encoding for repeated patterns
      return data.replace(/(.)\1{3,}/g, (match, char) => {
        return `${char}*${match.length}`;
      });
    } catch (error) {
      console.warn('Compression failed, using uncompressed data:', error);
      return data;
    }
  }

  private decompress(data: string): string {
    if (!this.compressionEnabled) return data;
    
    try {
      // Reverse the run-length encoding
      return data.replace(/(.)\*(\d+)/g, (_, char, count) => {
        return char.repeat(parseInt(count, 10));
      });
    } catch (error) {
      console.warn('Decompression failed:', error);
      return data;
    }
  }

  // Enhanced setItem with retry logic and quota management
  public setItem<T>(key: string, value: T, options: { compress?: boolean } = {}): boolean {
    const compress = options.compress ?? this.compressionEnabled;
    
    try {
      const serialized = JSON.stringify(value);
      const finalData = compress ? this.compress(serialized) : serialized;
      
      // Check storage quota before writing
      const stats = this.getStorageStats();
      const dataSize = (key.length + finalData.length) * 2;
      
      if (stats.used + dataSize > STORAGE_QUOTA_WARNING) {
        console.warn(`Storage quota warning: ${stats.percentage.toFixed(1)}% used`);
        this.cleanupOldEntries();
      }

      // Attempt to store with retry logic
      let attempts = 0;
      while (attempts < MAX_STORAGE_ATTEMPTS) {
        try {
          localStorage.setItem(key, finalData);
          return true;
        } catch (error: any) {
          attempts++;
          
          if (error.name === 'QuotaExceededError' && attempts < MAX_STORAGE_ATTEMPTS) {
            console.warn(`Storage quota exceeded, attempt ${attempts}. Cleaning up...`);
            this.cleanupOldEntries();
            continue;
          }
          
          throw error;
        }
      }
      
      return false;
    } catch (error) {
      console.error(`Failed to save to localStorage (${key}):`, error);
      return false;
    }
  }

  // Enhanced getItem with decompression
  public getItem<T>(key: string, defaultValue: T, options: { decompress?: boolean } = {}): T {
    const decompress = options.decompress ?? this.compressionEnabled;
    
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) {
        return defaultValue;
      }

      const decompressed = decompress ? this.decompress(stored) : stored;
      return JSON.parse(decompressed) as T;
    } catch (error) {
      console.warn(`Failed to parse localStorage item "${key}":`, error);
      return defaultValue;
    }
  }

  // Remove item safely
  public removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove localStorage item "${key}":`, error);
      return false;
    }
  }

  // Check if an item exists
  public hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      return false;
    }
  }

  // Cleanup old entries to free space
  private cleanupOldEntries(): void {
    try {
      const keysToRemove: string[] = [];
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('timestamp') || key.includes('savedAt'))) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const data = JSON.parse(value);
              const timestamp = data.savedAt || data.timestamp;
              if (timestamp && (now - timestamp) > maxAge) {
                keysToRemove.push(key);
              }
            } catch (error) {
              // Invalid JSON, mark for removal
              keysToRemove.push(key);
            }
          }
        }
      }

      // Remove old entries
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove old entry "${key}":`, error);
        }
      });

      if (keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} old localStorage entries`);
      }
    } catch (error) {
      console.error('Failed to cleanup localStorage:', error);
    }
  }

  // Clear all app-specific data
  public clearAppData(prefix: string = 'chainbreaker'): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      console.log(`Cleared ${keysToRemove.length} app data entries`);
    } catch (error) {
      console.error('Failed to clear app data:', error);
    }
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();

// Backwards compatibility exports
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  return storageManager.getItem(key, defaultValue);
};

export const saveToLocalStorage = <T>(key: string, value: T): boolean => {
  return storageManager.setItem(key, value);
};