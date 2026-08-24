import fs from "fs";
import path from "path";
import { AppException } from "../core/errors/AppException";

export default function readFile(url: string): string {
    const certificatePath = path.resolve(process.cwd(), url);

    try {
        return fs.readFileSync(certificatePath, {
            encoding: "utf-8",
        });
    } catch (error) {
        throw new AppException({
            message: `An error occured while attempting to read file ${certificatePath}.`,
            code: "E5002",
        });
    }
}
