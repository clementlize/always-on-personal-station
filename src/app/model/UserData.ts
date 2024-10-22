import { ContentModule } from "./ContentModule";
import { CredentialName } from "./Credentials";

export interface UserData {

    modules: ContentModule[];

    // The key is type of Credentials
    credentials?: { [key in CredentialName]?: string };

    deployment_utils?: {
        has_updated_to_version_1_1_0?: boolean;
    }
}