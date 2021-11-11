import { Component } from '@angular/core';
import { User } from '../../models/User';
import { MemberService } from '../../services/user.service';

@Component({
    selector: 'app-userlist',
    templateUrl: './userlist.component.html'
})
export class UserListComponent {
    users: User[] = [];

    constructor(private memberService: MemberService) {
        memberService.getAll().subscribe(users => {
            this.users = users;
        })
    }
}
