import * as fs from 'fs';

/**
 * Strips the standard skill frontmatter (name, description etc) from a file content.
 */
export function stripStandardFrontmatter(content: string): string {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    if (frontmatterRegex.test(content)) {
        return content.replace(frontmatterRegex, '');
    }
    return content;
}

/**
 * Tries to extract a short description from standard skill frontmatter or the first meaningful text line.
 */
export function extractDescription(filePath: string): string {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

        if (frontmatterMatch) {
            const fm = frontmatterMatch[1];
            // Match `description: "..."` or `description: '...'` or `description: ...`
            const descMatch = fm.match(/description:\s*(?:["']?)(.*?)(?:["']?)\s*(?:\r?\n|$)/);
            if (descMatch && descMatch[1]) {
                return descMatch[1].trim();
            }
        }

        // Fallback: Try to find the first meaningful text line
        let inFrontmatter = false;
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
            const pt = line.trim();
            if (pt === '---') {
                inFrontmatter = !inFrontmatter;
                continue;
            }
            if (!inFrontmatter && pt && !pt.startsWith('#')) {
                return pt.substring(0, 80) + (pt.length > 80 ? '...' : '');
            }
        }
    } catch (e) {
        console.error(`Failed to extract description from file: ${filePath}`, e);
    }

    return "No description available";
}

/**
 * Builds the standard skill frontmatter block for a given skill name.
 */
export function buildStandardFrontmatter(skillName: string): string {
    return `---\nname: ${skillName}\ndescription: "Auto-generated skill from project"\n---\n\n`;
}
