export class UserInfo{
    constructor(
        public nombre?:string,
        public estado?:string,
        public rol = 'PARTICIPANTE'
    ){}
}