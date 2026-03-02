export interface IDEConfig {
    [ideName: string]: {
        project: string;
        global: string;
    }
}

export interface QueryLibrarySkillsArgs {
    skill_name?: string;
}

export interface PushSkillToLibraryArgs {
    project_file_path: string;
    target_skill_name: string;
}

export interface PushSkillFromGlobalArgs {
    skill_name: string;
    ide_name: string;
}

export interface PullSkillToProjectArgs {
    skill_name: string;
    ide_name: string;
    project_path: string;
}

export interface PullSkillToGlobalArgs {
    skill_name: string;
    ide_name: string;
}

export interface DeleteSkillFromLibraryArgs {
    skill_name: string;
}
