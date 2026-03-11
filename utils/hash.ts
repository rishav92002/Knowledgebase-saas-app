import bcypt from "bcrypt";

export const hashPassword = async (password: string, saltRounds: number): Promise<string> => {
    return await bcypt.hash(password, saltRounds);
}
export const comparePassword = async (password:string, hashedPassword: string): Promise<boolean> => {
    return await bcypt.compare(password, hashedPassword);
}