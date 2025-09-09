interface LoginRequest {
    username: string;
    password: string;
}
interface LoginResponse {
    token: string;
    user: {
        username: string;
        password: string;
    };
}
declare const form: HTMLFormElement;
declare const usernameInput: HTMLInputElement;
declare const passwordInput: HTMLInputElement;
