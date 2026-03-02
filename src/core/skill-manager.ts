import * as fs from 'fs';
import * as path from 'path';
import { ensureDirSync } from '../utils/fs';

export const SKILLS_DIR = path.join(__dirname, '..', '..', 'data', 'skills');

let skillsDirInitialized = false;

/**
 * Ensures the skills directory exists. Called lazily on first use.
 */
function ensureSkillsDir(): void {
    if (!skillsDirInitialized) {
        ensureDirSync(SKILLS_DIR);
        skillsDirInitialized = true;
    }
}

/**
 * Validates a skill name to prevent path traversal attacks.
 * Throws if the name contains invalid characters or would escape SKILLS_DIR.
 */
export function validateSkillName(skillName: string): void {
    if (!skillName || typeof skillName !== 'string') {
        throw new Error('Skill name is required and must be a non-empty string.');
    }
    if (!/^[a-zA-Z0-9_\-]+$/.test(skillName)) {
        throw new Error(`Skill name contains invalid characters: ${skillName}. Only letters, digits, hyphens and underscores are allowed.`);
    }
    const resolved = path.resolve(SKILLS_DIR, skillName);
    if (!resolved.startsWith(path.resolve(SKILLS_DIR))) {
        throw new Error(`Invalid skill name: ${skillName}`);
    }
}

/**
 * Resolves the absolute path for a skill, checking both standard directory format and flat file format.
 * Returns null if the skill is not found.
 */
export function resolveSkillPath(skillName: string): string | null {
    ensureSkillsDir();

    // Check if it's a standard directory skill
    const dirPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
    if (fs.existsSync(dirPath)) {
        return dirPath;
    }

    // Check if it's a flat file skill
    const filePath = path.join(SKILLS_DIR, `${skillName}.md`);
    if (fs.existsSync(filePath)) {
        return filePath;
    }

    return null;
}

/**
 * Checks if a skill exists as a standard format directory.
 */
export function isStandardFormatSkill(skillName: string): boolean {
    const possibleStandardDir = path.join(SKILLS_DIR, skillName);
    return fs.existsSync(possibleStandardDir) && fs.statSync(possibleStandardDir).isDirectory();
}
