export interface ICommand {
    name: string;
    description: string;
    handler(args: string): string | Promise<string>;
}
