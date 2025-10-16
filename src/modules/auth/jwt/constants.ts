export const jwtConstants = {
    secret: process.env.JWT_SECRET as string,
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
};
