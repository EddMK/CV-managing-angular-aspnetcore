



export class User {
    pseudo?: string;
    password?: string;
    lastname?: string;
    firstname?: string;
    email?: string;
    birthDate?: string;
    role?: string;

    constructor(data: any) {
        if (data) {
            this.pseudo = data.pseudo;
            this.password = data.password;
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.email = data.email;
            this.birthDate = data.birthDate &&
                data.birthDate.length > 10 ? data.birthDate.substring(0, 10) : data.birthDate;
            this.role = data.role;    
        }
    }
}