import { Card } from "../../schemas/card.model";

export class UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    avatarDataUri?: string;
    createdCards?: string[];
    assignedCards?: string[];
}