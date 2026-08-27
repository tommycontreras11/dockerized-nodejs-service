import dotenv from "dotenv"

dotenv.config({
    quiet: true
})

const requiredEnv = (env) => {
    const name = process.env[env]

    if(!name) throw new Error(`This env ${env} is required`)

    return name
}

export default {
    PORT: requiredEnv("PORT"),
    SECRET_MESSAGE: requiredEnv("SECRET_MESSAGE"),
    USERNAME: requiredEnv("USERNAME"),
    PASSWORD: requiredEnv("PASSWORD")
}