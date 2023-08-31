"use client";
import styles from "./styles.module.css";
import { useSelector } from 'react-redux'

import imgNoUser from "../../../public/images/noUser.webp";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function settings() {
  const [toggleForm, setToggleForm] = useState<boolean>(false);

  const [gmail, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const { currentUser } = useSelector((rootReducer: any) => rootReducer.userData);

  console.log("=======================")
  console.log(currentUser);

  useEffect(() => {

  }, []);

  function redirect() {
    window.location.replace("/dashboard");
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerButton}>
        <button onClick={redirect}>Voltar</button>
      </div>
      <main>
        <h1>Suas informações</h1>
        <p>
          <span onClick={() => setToggleForm(p=>!p)} > Edite </span>suas informações
        </p>

        <form>
          <div className={styles.photo}>
            {/* <div className={styles.loadingPhoto} /> */}

            <Image src={imgNoUser} loading="lazy" alt="no user" />
          </div>

          <input
            type="email"
            value={"gustavo@gmail.com"}
            disabled={!toggleForm}
          />
          <input type="text" value={"gustavo"} disabled={!toggleForm} />

          <button>Editar</button>

          <p onClick={() => setToggleForm(p=>!p)} >Edite suas informações</p>
        </form>
      </main>
    </div>
  );
}
