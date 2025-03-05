  /* 
  
    - CookieHandler will be for data less than 4KB. 

    - If the data being persisted may exceed the memory limit, use 
    AppStorage class to storage, retrieve, and update the data.

  */

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

  const CookieHandler = {
    set: (key, value, days) => {
      let expires = "";
      if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = key + "=" + encodeURIComponent(value) + expires + "; path=/";
    },
  
    get: (key) => {
      let keyEQ = key + "=";
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(keyEQ) === 0) {
          return decodeURIComponent(c.substring(keyEQ.length));
        }
      }
      return null;
    },
  
    delete: (key) => {
      document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  };
  