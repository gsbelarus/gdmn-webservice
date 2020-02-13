export declare const readFile: (filename: string) => Promise<any>;
export declare const writeFile: (filename: string, data: string) => Promise<void>;
export declare const removeFile: (filename: string) => Promise<"OK" | "ERROR">;
