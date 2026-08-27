import dotenv from "dotenv"

dotenv.config({
    quiet: true
})

const requiredEnv = (env) => {
    const value = process.env[env]

    if(!value) throw new Error(`This env ${env} is required`)

    return value
}

export default {
    PORT: requiredEnv("PORT"),
    SECRET_MESSAGE: requiredEnv("SECRET_MESSAGE"),
    USERNAME: requiredEnv("USERNAME"),
    PASSWORD: requiredEnv("PASSWORD")
}