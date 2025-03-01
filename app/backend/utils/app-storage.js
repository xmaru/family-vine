class LocalStorageUtil {
    static set(key, value) {
      const data = typeof value === "object" ? JSON.stringify(value) : value;
      localStorage.setItem(key, data);
    }
  
    static get(key) {
      const data = localStorage.getItem(key);
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
  }
  
  class AppStorage extends LocalStorageUtil {
    static KEYS = {
      LAST_VISIT: "last_visit",
      USERNAME: "username",
      NAME: "name"
    };
  
    static setLastVisit() {
      this.set(this.KEYS.LAST_VISIT, new Date().toISOString());
    }
  
    static getLastVisit() {
      return this.get(this.KEYS.LAST_VISIT);
    }
  
    static setUsername(username) {
      this.set(this.KEYS.USERNAME, username);
    }
  
    static getUsername() {
      return this.get(this.KEYS.USERNAME);
    }
  
    static setName(name) {
      this.set(this.KEYS.NAME, name);
    }
  
    static getName() {
      return this.get(this.KEYS.NAME);
    }
  }