export default class Config {
    static USER_LOGIN = 0;
    static ADMIN_LOGIN = 1;
    static SUPER_ADMIN_LOGIN = 2;

    static REGISTER_DIALOG = 9;
    static FORGET_PASSWORD_DIALOG = 10;

    static ADD_OPERATE = 11;
    static DELETE_OPERATE = 12;
    static UPDATE_OPERATE = 13;
    static SELECT_OPERATE = 14;

    static OK = 200;
    static SERVER_ERROR = 500;

    static ACCOUNT_PSD_ERROR = 301;
    static USER_NOT_EXIST = 302;
    static VERIFY_CODE_ERROR = 303;
    static ACCOUNT_REGISTERED = 304;
    static TOKEN_TIME_OUT = 311;
    static VERIFY_CODE_TIME_OUT = 312;

    static ILLEGAL_OPERATE = 401;
    static ADD_OPERATE_FAILED = 411;
    static DELETE_OPERATE_FAILED = 412;
    static UPDATE_OPERATE_FAILED = 413;
    static SELECT_OPERATE_FAILED = 414;

}