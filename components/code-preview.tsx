'use server';
import fs from "fs";
import path from "path";

export const getComponentPreviewCode = async (name: string) => {
    console.log('name:', name);
    const filePath = path.join(process.cwd(), 'app', 'docs', 'registry', 'components', `${name}.tsx`);
    const code = fs.readFileSync(filePath, 'utf8');
    return code;
};