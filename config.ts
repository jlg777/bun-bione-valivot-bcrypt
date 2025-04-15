export const config = {
    jwtSecret: (process.env.JWT_SECRET || "my_secret_key") as string
  }
  