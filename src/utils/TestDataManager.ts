import * as fs from 'fs'
import * as path from 'path'

interface UserData {
  username: string;
  password: string;
  role: string;
  displayName: string;
}

interface UsersData {
  validUser: UserData;
  invalidUser: UserData;
  adminUser: UserData;
  readOnlyUser: UserData;
}

/**
 * Type guard to validate UserData structure
 */
function isValidUserData(data: unknown): data is UserData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const user = data as Record<string, unknown>;

  const requiredFields = ["username", "password", "role", "displayName"];
  for (const field of requiredFields) {
    if (typeof user[field] !== "string" || user[field] === "") {
      return false;
    }
  }

  return true;
}

/**
 * Type guard to validate UsersData structure
 */
function isValidUsersData(data: unknown): data is UsersData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const users = data as Record<string, unknown>;
  const requiredUsers = ["validUser", "invalidUser", "adminUser", "readOnlyUser"];

  for (const userKey of requiredUsers) {
    if (!isValidUserData(users[userKey])) {
      return false;
    }
  }

  return true;
}

export class TestDataManager {
  private static instance: TestDataManager;
  private usersData: UsersData;

  private constructor() {
    try {
      const usersPath = path.resolve(
        __dirname,
        "../../tests/test-data/users.json"
      );
      const rawData = fs.readFileSync(usersPath, "utf-8");
      const parsedData = JSON.parse(rawData);

      if (!isValidUsersData(parsedData)) {
        const errorMsg = this.generateValidationError(parsedData);
        throw new Error(errorMsg);
      }
      this.usersData = parsedData;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  /**
   * Generate detailed validation error message
   */
  private generateValidationError(data: unknown): string {
    if (typeof data !== "object" || data === null) {
      return "Data is not an object";
    }

    const users = data as Record<string, unknown>;
    const requiredUsers = ["validUser", "invalidUser", "adminUser", "readOnlyUser"];

    for (const userKey of requiredUsers) {
      if (!(userKey in users)) {
        return `Missing required key: "${userKey}"`;
      }

      const user = users[userKey];
      if (typeof user !== "object" || user === null) {
        return `"${userKey}" is not an object`;
      }

      const userObj = user as Record<string, unknown>;
      const requiredFields = ["username", "password", "role", "displayName"];

      for (const field of requiredFields) {
        if (!(field in userObj)) {
          return `Missing field "${field}" in "${userKey}"`;
        }

        if (typeof userObj[field] !== "string" || userObj[field] === "") {
          return `Field "${field}" in "${userKey}" must be a non-empty string`;
        }
      }
    }

    return "Unknown validation error";
  }

  /**
   * Get singleton instance
   */
  static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  /**
   * Get valid user credentials
   */
  getValidUser(): UserData {
    return this.usersData.validUser;
  }

  /**
   * Get invalid user credentials (for negative testing)
   */
  getInvalidUser(): UserData {
    return this.usersData.invalidUser;
  }

  /**
   * Get admin user credentials
   */
  getAdminUser(): UserData {
    return this.usersData.adminUser;
  }

  /**
   * Get read-only user credentials
   */
  getReadOnlyUser(): UserData {
    return this.usersData.readOnlyUser;
  }

  /**
   * Get overdraft user credentials (negative balance, for overdraft indicator testing)
   */
  getOverdraftUser(): UserData {
    const users = this.usersData as unknown as Record<string, UserData>;
    return users["overdraft_user"];
  }
  
  /**
   *  Get frozen user credentials
   */
  getFrozenUser(): UserData {
    const users = this.usersData as unknown as Record<string, UserData>;
    return users["frozen_user"];
  }

  /**
   * Get a random valid email for testing
   */
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    return `testuser_${timestamp}@testdomain.com`;
  }
}