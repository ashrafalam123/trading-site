import { createClient } from "redis";
import { Engine } from "./trade/Engine"

async function main() {
    const engine = new Engine()
    const client = createClient()
    await client.connect()
    console.log("Connected to redis")

    while(true) {
        const response = await client.rPop("message" as string)
        if( !response ) {

        } else {
            engine.process(JSON.parse(response))
        }
    }
}

main()