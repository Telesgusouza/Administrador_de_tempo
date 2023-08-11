"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import styles from "./styles/page.module.css";

import imgtest from "../../public/images/image-jeremy.png";
import Image from "next/image";

export default function Home() {
  const [toggleForm, setToggleForm] = useState<boolean>(false);

  function handleToggleForm() {
    setToggleForm((p) => !p);
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerContent} >
        <form>
          {toggleForm && (
            <>
              <div className={styles.photo}>
                <input type="file" />
                <Image src={imgtest} loading="lazy" alt="avatar user" />
              </div>
              <input type="text" placeholder="Digite seu nome" />
            </>
          )}
          <input type="email" placeholder="Digite seu e-mail" />
          <input type="password" placeholder="Digite sua senha" />
          <button>Logar</button>
          <p>
            {toggleForm ? (
              <>
                Já tem conta? <strong onClick={handleToggleForm}>entre</strong>
              </>
            ) : (
              <>
                Ainda não tem conta?{" "}
                <strong onClick={handleToggleForm}>cadastre-se</strong>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
