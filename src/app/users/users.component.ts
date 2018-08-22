import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user-service/user.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
      this.userService.getUsers()
          .subscribe(
          data => {
              this.users = _.filter(data, (item) => {
                  return !_.isNil(item) && !_.isNil(item.owner);
              });
          },
          (error) => {
             console.log('Can not load users.');
          });
  }
}
