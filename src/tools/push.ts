import * as fs from 'fs';
import * as path from 'path';
import { stripStandardFrontmatter, buildStandardFrontmatter } from '../core/skill-formatter';
import { SKILLS_DIR, validateSkillName } from '../core/skill-manager';
import { PushSkillToLibraryArgs } from '../types';
import { ensureDirSync } from '../utils/fs';

export function pushSkillToLibrary(args: PushSkillToLibraryArgs) {
    const { project_file_path, target_skill_name } = args;
    validateSkillName(target_skill_name);

    if (!fs.existsSync(project_file_path)) {
        throw new Error(`Project file ${project_file_path} not found.`);
    }

    const rawContent = fs.readFileSync(project_file_path, 'utf-8');
    const cleanContent = stripStandardFrontmatter(rawContent);
    const standardFrontmatter = buildStandardFrontmatter(target_skill_name);

    // Create standard directory format
    const destDir = path.join(SKILLS_DIR, target_skill_name);
    ensureDirSync(destDir);

    const destPath = path.join(destDir, `SKILL.md`);
    fs.writeFileSync(destPath, standardFrontmatter + cleanContent, 'utf-8');

    return {
        content: [{ type: "text", text: `Skill pushed successfully to central library as ${target_skill_name} (Standard Format).` }]
    };
}
