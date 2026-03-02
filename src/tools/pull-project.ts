import * as fs from 'fs';
import * as path from 'path';
import { readOrInitConfig } from '../config/ide-config';
import { SKILLS_DIR, resolveSkillPath, isStandardFormatSkill, validateSkillName } from '../core/skill-manager';
import { PullSkillToProjectArgs } from '../types';
import { ensureDirSync, resolveDestPath, copyDirectory } from '../utils/fs';

export function pullSkillToProject(args: PullSkillToProjectArgs) {
    const { skill_name, ide_name, project_path } = args;
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

    const destDir = resolveDestPath(project_path, ideConfigMap.project);
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
        content: [{ type: "text", text: `Skill ${skill_name} pulled into project workspace successfully.` }]
    };
}
