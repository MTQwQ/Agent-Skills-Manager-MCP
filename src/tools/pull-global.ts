import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { readOrInitConfig } from '../config/ide-config';
import { SKILLS_DIR, resolveSkillPath, isStandardFormatSkill, validateSkillName } from '../core/skill-manager';
import { PullSkillToGlobalArgs } from '../types';
import { ensureDirSync, resolveDestPath, copyDirectory } from '../utils/fs';

export function pullSkillToGlobal(args: PullSkillToGlobalArgs) {
    const { skill_name, ide_name } = args;
    validateSkillName(skill_name);

    const existPath = resolveSkillPath(skill_name);
    if (!existPath) {
        throw new Error(`Skill ${skill_name} not found in library.`);
    }

    const config = readOrInitConfig();
    const normalizedIde = ide_name.toLowerCase();
    const ideConfigMap = config[normalizedIde] || {
        project: `.${normalizedIde}/skills`,
        global: `~/.${normalizedIde}/skills`
    };

    const destDir = resolveDestPath(os.homedir(), ideConfigMap.global);
    ensureDirSync(destDir);

    if (isStandardFormatSkill(skill_name)) {
        const srcDir = path.join(SKILLS_DIR, skill_name);
        const nestedDestDir = path.join(destDir, skill_name);
        copyDirectory(srcDir, nestedDestDir);
    } else {
        // Flat file format: copy the single .md file
        const nestedDestDir = path.join(destDir, skill_name);
        ensureDirSync(nestedDestDir);
        fs.copyFileSync(existPath, path.join(nestedDestDir, 'SKILL.md'));
    }

    return {
        content: [{ type: "text", text: `Skill ${skill_name} pulled into global directory successfully.` }]
    };
}
