
export class CreateUserDto {
    username: string;
    email: string;
    password: string;
    avatarDataUri: string;
    createdCards: string[];
    assignedCards?: string[]; 
}