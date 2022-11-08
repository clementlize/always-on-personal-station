import { ContentModule } from "./ContentModule";

export interface UserData {

    modules: ContentModule[];

    // The key is type of Credentials
    credentials?: { [key: string]: string };
}