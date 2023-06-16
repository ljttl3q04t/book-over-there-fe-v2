import { axiosApi } from "../http-common"


export class AuthService {
    static login = function (
        username: any,
        password: any,
        onsuccess: any,
        onfailure: any
    ) {
        axiosApi
            .post("/users/login", { username, password })
            .then(function (token: { data: any }) {
                if (token.data) {
                    onsuccess && onsuccess(token);
                } else {
                    onfailure && onfailure();
                }
            })
            .catch((reason: any) => {
                onfailure && onfailure(reason);
            });
    };

    static register = (params: any) => {
        axiosApi.post('/services/user/register', params)
    }
}
