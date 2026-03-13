import type { Identity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createActorWithConfig } from "../config";

const SESSION_KEY = "ks_current_user";
const storageKey = (username: string) => `ks_identity_${username}`;

type LocalAuthContextType = {
  identity?: Identity;
  isAuthenticated: boolean;
  isInitializing: boolean;
  currentUsername?: string;
  register: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    username: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  clear: () => void;
};

const LocalAuthContext = createContext<LocalAuthContextType | null>(null);

async function getAnonActor() {
  return createActorWithConfig();
}

export function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [currentUsername, setCurrentUsername] = useState<string | undefined>(
    undefined,
  );
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem(SESSION_KEY);
    if (storedUser) {
      const stored = localStorage.getItem(storageKey(storedUser));
      if (stored) {
        try {
          const id = Ed25519KeyIdentity.fromJSON(stored);
          setIdentity(id);
          setCurrentUsername(storedUser);
        } catch {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    }
    setIsInitializing(false);
  }, []);

  const register = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const anonActor = await getAnonActor();
      let exists = false;
      try {
        exists = await (anonActor as any).usernameExists(username);
      } catch {
        // ignore – treat as not exists
      }
      if (exists) {
        return {
          success: false,
          error: "Username already taken. Please choose another.",
        };
      }
      const id = Ed25519KeyIdentity.generate();
      localStorage.setItem(storageKey(username), JSON.stringify(id.toJSON()));
      let ok = false;
      try {
        const actorWithId = await createActorWithConfig({
          agentOptions: { identity: id },
        });
        ok = await (actorWithId as any).register(username, password);
      } catch (backendErr) {
        localStorage.removeItem(storageKey(username));
        const msg =
          backendErr instanceof Error
            ? backendErr.message
            : "Backend error. Please try again.";
        return { success: false, error: msg };
      }
      if (!ok) {
        localStorage.removeItem(storageKey(username));
        return {
          success: false,
          error: "Registration failed. Username may already exist.",
        };
      }
      setIdentity(id);
      setCurrentUsername(username);
      sessionStorage.setItem(SESSION_KEY, username);
      return { success: true };
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "An error occurred. Please try again.";
      return { success: false, error: msg };
    }
  };

  const login = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const anonActor = await getAnonActor();
      let ok = false;
      try {
        ok = await (anonActor as any).authenticateUser(username, password);
      } catch (backendErr) {
        const msg =
          backendErr instanceof Error
            ? backendErr.message
            : "Backend error. Please try again.";
        return { success: false, error: msg };
      }
      if (!ok) {
        return { success: false, error: "Invalid username or password." };
      }
      const stored = localStorage.getItem(storageKey(username));
      if (!stored) {
        return {
          success: false,
          error:
            "Account data not found on this device. Please register again or use the same device you registered on.",
        };
      }
      const id = Ed25519KeyIdentity.fromJSON(stored);
      setIdentity(id);
      setCurrentUsername(username);
      sessionStorage.setItem(SESSION_KEY, username);
      return { success: true };
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "An error occurred. Please try again.";
      return { success: false, error: msg };
    }
  };

  const changePassword = async (
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const anonActor = await getAnonActor();
      let verified = false;
      try {
        verified = await (anonActor as any).authenticateUser(
          username,
          oldPassword,
        );
      } catch {
        return { success: false, error: "Could not verify current password." };
      }
      if (!verified) {
        return { success: false, error: "Current password is incorrect." };
      }
      const stored = localStorage.getItem(storageKey(username));
      if (!stored) {
        return {
          success: false,
          error: "Account data not found on this device.",
        };
      }
      const id = Ed25519KeyIdentity.fromJSON(stored);
      let ok = false;
      try {
        const actorWithId = await createActorWithConfig({
          agentOptions: { identity: id },
        });
        ok = await (actorWithId as any).changePassword(
          username,
          oldPassword,
          newPassword,
        );
      } catch (backendErr) {
        const msg =
          backendErr instanceof Error
            ? backendErr.message
            : "Failed to change password.";
        return { success: false, error: msg };
      }
      if (!ok) {
        return {
          success: false,
          error: "Failed to change password. Please try again.",
        };
      }
      return { success: true };
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "An error occurred. Please try again.";
      return { success: false, error: msg };
    }
  };

  const clear = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIdentity(undefined);
    setCurrentUsername(undefined);
  };

  return React.createElement(
    LocalAuthContext.Provider,
    {
      value: {
        identity,
        isAuthenticated: !!identity,
        isInitializing,
        currentUsername,
        register,
        login,
        changePassword,
        clear,
      },
    },
    children,
  );
}

export function useLocalAuth(): LocalAuthContextType {
  const ctx = useContext(LocalAuthContext);
  if (!ctx)
    throw new Error("useLocalAuth must be used within LocalAuthProvider");
  return ctx;
}
