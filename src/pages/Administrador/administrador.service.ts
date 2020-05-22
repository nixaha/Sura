import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AdminService {

    constructor(
        private angfireAuth: AngularFireAuth,
        private angfireDB: AngularFireDatabase
    ){}

}