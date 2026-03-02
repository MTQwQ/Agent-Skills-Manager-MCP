import * as fs from 'fs';
import * as path from 'path';
import { SKILLS_DIR, resolveSkillPath, isStandardFormatSkill, validateSkillName } from '../core/skill-manager';
import { DeleteSkillFromLibraryArgs } from '../types';
import { isDeletionEnabled } from '../utils/env';

export function deleteSkillFromLibrary(args: DeleteSkillFromLibraryArgs) {
    if (!isDeletionEnabled()) {
        throw new Error("Deletion is disabled. To enable, set AGENT_SKILLS_ENABLE_DELETE=true in the MCP configuration.");
    }

    const { skill_name } = args;
    validateSkillName(skill_name);

    const skillPath = resolveSkillPath(skill_name);
    if (!skillPath) {
        throw new Error(`Skill ${skill_name} not found in library.`);
    }

    const isStandardFormat = isStandardFormatSkill(skill_name);
    const possibleStandardDir = path.join(SKILLS_DIR, skill_name);

    // Safely remove the target payload
    if (isStandardFormat) {
        fs.rmSync(possibleStandardDir, { recursive: true, force: true });
    } else {
        const flatFilePath = path.join(SKILLS_DIR, `${skill_name}.md`);
        if (fs.existsSync(flatFilePath)) {
            fs.unlinkSync(flatFilePath);
        }
    }

    return {
        content: [{ type: "text", text: `Skill ${skill_name} has been successfully deleted from the central library.` }]
    };
}
