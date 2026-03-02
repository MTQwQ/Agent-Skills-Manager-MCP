import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Ensures that a directory exists, creating it and any necessary parents if it does not.
 */
export function ensureDirSync(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Resolves a target path based on a base path and a configured IDE path.
 * Handles `~/` paths by resolving them to the user's home directory.
 */
export function resolveDestPath(basePath: string, configuredPath: string): string {
    if (configuredPath.startsWith('~/') || configuredPath.startsWith('~\\')) {
        return path.join(os.homedir(), configuredPath.substring(2));
    }
    if (path.isAbsolute(configuredPath)) {
        return configuredPath;
    }
    return path.join(basePath, configuredPath);
}

/**
 * Recursively copies a directory from a source to a destination.
 */
export function copyDirectory(src: string, dest: string, excludeFiles: string[] = []): void {
    ensureDirSync(dest);

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        if (excludeFiles.includes(entry.name)) {
            continue;
        }

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath, excludeFiles);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
