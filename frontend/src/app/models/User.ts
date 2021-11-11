

export class User {
    pseudo?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    birthDate?: string;

    constructor(data: any) {
        if (data) {
            this.pseudo = data.pseudo;
            this.password = data.password;
            this.firstname = data.firstname;
            this.lastname = data.lastanem;
            this.birthDate = data.birthDate &&
                data.birthDate.length > 10 ? data.birthDate.substring(0, 10) : data.birthDate;
        }
    }
}