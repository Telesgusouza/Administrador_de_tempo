'use client';
import styles from './styles.module.css'

export default function settings() {

    function redirect() {
        window.location.replace("/dashboard")
    }

    return (
        <div className={styles.container} >
            <main>
                <div className={styles.containerButton} >
                    <button onClick={redirect} >Voltar</button>
                </div>
            </main>
        </div>
    )
}