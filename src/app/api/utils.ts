import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"

export async function checkConnected() {
    const user = await new Promise<User | null>((result) => {
        onAuthStateChanged(auth, user => {
            result(user);
        })
    })

    if(!user) {
        window.location.replace("/")
    }
}