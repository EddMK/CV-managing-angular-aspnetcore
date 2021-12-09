

export enum Role {
    Manager = 0,
    Consultant = 1
  }



export class User {
    pseudo?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    title?: string;
    birthDate?: string;
    role?: Role;
    token?:string;

    constructor(data: any) {
        if (data) {
        
            this.pseudo = data.pseudo;
            this.password = data.password;
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.email = data.email;
            this.title = data.title;
            this.birthDate = data.birthDate &&
                data.birthDate.length > 10 ? data.birthDate.substring(0, 10) : data.birthDate;
            this.token = data.token; 
            this.role = data.role;
        }
    }

    Constructor(){
        
    }
    
    /*public get roleAsString(): string {
        return Role[this.role];
    }*/




    
}