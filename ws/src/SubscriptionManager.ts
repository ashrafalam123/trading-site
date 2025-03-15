import { RedisClientType , createClient } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager {
    private static instance : SubscriptionManager
    //(userId => subscriptions)
    private subscriptions : Map<string, string[]> = new Map()
    //(subscriptions => users)
    private reverseSubscription : Map<string, string[]> = new Map()
    private redisClient : RedisClientType

    private constructor() {
        this.redisClient = createClient()
        this.redisClient.connect()
    }

    public static getInstance() {
        if(!this.instance) 
            this.instance = new SubscriptionManager()
        return this.instance
    }

    public subscribe(userId : string, subscription : string) {
        if(this.subscriptions.get(userId)?.includes(subscription))
            return
        this.subscriptions.set(userId, (this.subscriptions.get(userId) || []).concat(subscription))
        this.reverseSubscription.set(subscription, (this.reverseSubscription.get(subscription) || []).concat(userId))
        if(this.reverseSubscription.get(subscription)?.length === 1) {
            this.redisClient.subscribe(subscription, this.redisCallbackHandler)
        }
    }

    private redisCallbackHandler = (message : string, channel : string) => {
        const parsed_message = JSON.parse(message)
        this.reverseSubscription.get(channel)?.forEach(s => UserManager.getInstance().getUser(s)?.emit(parsed_message))
    }

    public unsubscribe(userId : string, subscription : string) {
        const subscriptions = this.subscriptions.get(userId)
        if(subscriptions) {
            this.subscriptions.set(userId, subscriptions.filter(s => s !== subscription))
        }
        const users = this.reverseSubscription.get(subscription);
        if(users) {
            this.reverseSubscription.set(subscription, users.filter(u => u !== userId))
            if(this.reverseSubscription.get(subscription)?.length === 0){
                this.redisClient.unsubscribe(subscription)
            }
        }
    }

    public userLeft(userId : string) {
        console.log("user left " + userId)
        this.subscriptions.get(userId)?.forEach(channel => this.unsubscribe(userId, channel));
    }

    getSubsrciptions(userId : string) {
        return this.subscriptions.get(userId) || []
    }
}