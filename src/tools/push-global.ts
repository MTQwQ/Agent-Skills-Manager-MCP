import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { readOrInitConfig } from '../config/ide-config';
import { SKILLS_DIR, validateSkillName } from '../core/skill-manager';
import { PushSkillFromGlobalArgs } from '../types';
import { ensureDirSync, resolveDestPath, copyDirectory } from '../utils/fs';

export function pushSkillFromGlobal(args: PushSkillFromGlobalArgs) {
    const { skill_name, ide_name } = args;
    validateSkillName(skill_name);

    const config = readOrInitConfig();
    const normalizedIde = ide_name.toLowerCase();
    const ideConfigMap = config[normalizedIde] || {
        project: `.${normalizedIde}/skills`,
        global: `~/.${normalizedIde}/skills`
    };

    const globalDir = resolveDestPath(os.homedir(), ideConfigMap.global);
    const srcDir = path.join(globalDir, skill_name);

    if (!fs.existsSync(srcDir)) {
        throw new Error(`Skill directory ${srcDir} not found in global tool configuration.`);
    }

    const destDir = path.join(SKILLS_DIR, skill_name);
    ensureDirSync(destDir);

    copyDirectory(srcDir, destDir);

    return {
        content: [{ type: "text", text: `Skill ${skill_name} pushed from global directory successfully.` }]
    };
}
