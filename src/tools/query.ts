import * as fs from 'fs';
import * as path from 'path';
import { extractDescription } from '../core/skill-formatter';
import { SKILLS_DIR, resolveSkillPath, validateSkillName } from '../core/skill-manager';
import { QueryLibrarySkillsArgs } from '../types';

export function queryLibrarySkills(args: QueryLibrarySkillsArgs) {
    const { skill_name } = args;

    if (skill_name) {
        validateSkillName(skill_name);
        const skillPath = resolveSkillPath(skill_name);
        if (skillPath) {
            const content = fs.readFileSync(skillPath, 'utf-8');
            return {
                content: [{ type: "text", text: content }]
            };
        } else {
            throw new Error(`Skill ${skill_name} not found in library.`);
        }
    }

    // List all skills (both .md files and directories containing SKILL.md)
    const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
    const skillsList: string[] = [];

    for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
            const name = entry.name.slice(0, -3);
            const desc = extractDescription(path.join(SKILLS_DIR, entry.name));
            skillsList.push(`- **${name}**: ${desc}`);
        } else if (entry.isDirectory()) {
            const skillMd = path.join(SKILLS_DIR, entry.name, 'SKILL.md');
            if (fs.existsSync(skillMd)) {
                const desc = extractDescription(skillMd);
                skillsList.push(`- **${entry.name}** (Standard Format): ${desc}`);
            }
        }
    }

    return {
        content: [{ type: "text", text: `Available skills in library:\n${skillsList.join('\n')}` }]
    };
}
