import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { pushSkillToLibrary } from './tools/push';
import { pullSkillToProject } from './tools/pull-project';
import * as pullGlobalModule from './tools/pull-global';
import { queryLibrarySkills } from './tools/query';
import * as deleteModule from './tools/delete';

const projectTestFile = path.join(__dirname, '..', 'test.mdc');
const frontmatter = `---
description: Test skill
globs: *
---
# Test Skill
This is just a test payload.
`;
fs.writeFileSync(projectTestFile, frontmatter, 'utf-8');

try {
    console.log('--- Push ---');
    console.log(pushSkillToLibrary({
        project_file_path: projectTestFile,
        target_skill_name: 'test_skill'
    }));

    console.log('--- Query All ---');
    console.log(queryLibrarySkills({}));

    console.log('--- Query One ---');
    console.log(queryLibrarySkills({ skill_name: 'test_skill' }));

    console.log('--- Pull Project (Windsurf) ---');
    console.log(pullSkillToProject({
        skill_name: 'test_skill',
        ide_name: 'windsurf',
        project_path: path.join(__dirname, '..', 'test-proj')
    }));

    console.log('--- Pull Global (Trae) ---');
    deleteModule.deleteSkillFromLibrary({
        skill_name: "AnotherTestSkill"
    });

    fs.unlinkSync(projectTestFile);

    const pulledWindsurf = fs.readFileSync(path.join(__dirname, '..', 'test-proj', '.windsurf', 'rules', 'test_skill.md'), 'utf-8');
    console.log('Windsurf generated rule:\n', pulledWindsurf);

    const pulledTrae = fs.readFileSync(path.join(os.homedir(), '.trae', 'rules', 'test_skill.mdc'), 'utf-8');
    console.log('Trae generated rule:\n', pulledTrae);

    console.log('Tests passed.');
} catch (error) {
    console.error(error);
}
