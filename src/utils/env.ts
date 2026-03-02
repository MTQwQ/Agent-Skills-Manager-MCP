/**
 * Checks if the environment flag to allow deletion of skills is explicitly enabled.
 */
export function isDeletionEnabled(): boolean {
    return process.env.AGENT_SKILLS_ENABLE_DELETE === 'true';
}
