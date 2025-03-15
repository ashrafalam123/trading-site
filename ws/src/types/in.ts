export const SUBSCRIBE = "SUBSCRIBE"
export const UNSUBSCRIBE = "UNSUBSCRIBE"

export type SubscribeMessage = {
    method : typeof SUBSCRIBE
    params : string[]
}

export type UnSubscribeMessage = {
    method : typeof UNSUBSCRIBE
    params : string[]
}

export type INCOMING_MESSAGE = SubscribeMessage | UnSubscribeMessage