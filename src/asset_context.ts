import { createContext, useContext } from "react";

/** Maps a path from the theme file to a URL the browser can load. */
type AssetResolver = (path: string | undefined) => string | undefined;

const REMOTE = /^(https?:|data:|blob:|\/)/i;

function createAssetResolver(files: Map<string, string>): AssetResolver {
  return (path) => {
    if (!path || REMOTE.test(path)) return path;
    const key = path.replace(/^\.\//, "").replace(/\\/g, "/");
    return files.get(key) ?? path;
  };
}

const AssetContext = createContext<AssetResolver>((path) => path);

function useAssetResolver(): AssetResolver {
  return useContext(AssetContext);
}

export { AssetContext, createAssetResolver, useAssetResolver };
export type { AssetResolver };
