export declare class CreateUserDto {
    user: {
        name: string;
        correo: string;
        username: string;
        password: string;
        tareas?: {
            nombre: string;
            hora: string;
            fecha: string;
            mensaje: string;
            estado: string;
        }[];
        recordatorios?: {
            nombre: string;
            hora: string;
            fecha: string;
            mensaje: string;
            estado: string;
        }[];
    };
}
