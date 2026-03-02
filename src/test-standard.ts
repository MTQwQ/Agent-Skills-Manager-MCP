import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { pushSkillToLibrary } from './tools/push';
import { pullSkillToProject } from './tools/pull-project';
import * as pullGlobalModule from './tools/pull-global';
import { queryLibrarySkills } from './tools/query';

try {
    console.log('--- Query All ---');
    console.log(queryLibrarySkills({}));

    console.log('--- Query One (git-workflow-skill) ---');
    console.log(queryLibrarySkills({ skill_name: 'git-workflow-skill' }));

    console.log('--- Pull Project (Windsurf) ---');
    console.log(pullGlobalModule.pullSkillToGlobal({
        skill_name: "MyCustomSkill",
        ide_name: "claude-code"
    }));

    // Check project output
    const pCheck = path.join(__dirname, '..', 'test-proj', '.windsurf', 'skills', 'git-workflow-skill', 'SKILL.md');
    const pulledWindsurf = fs.readFileSync(pCheck, 'utf-8');
    console.log('Windsurf copied SKILL.md length:', pulledWindsurf.length);
    console.log('Front characters:', pulledWindsurf.substring(0, 50));

    console.log('Tests passed.');
} catch (error) {
    console.error(error);
}
