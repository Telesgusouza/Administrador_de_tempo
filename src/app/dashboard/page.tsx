"use client";
import Image from "next/image";
import styles from "./styles.module.css";

import imgNoUser from "../../../public/images/noUser.webp";

import imgWork from "../../../public/images/icon-work.svg";
import imgPlay from "../../../public/images/icon-play.svg";
import imgStudy from "../../../public/images/icon-study.svg";

import imgExercise from "../../../public/images/icon-exercise.svg";
import imgSocial from "../../../public/images/icon-social.svg";
import imgSelfCare from "../../../public/images/icon-self-care.svg";
import React, { useEffect, useState } from "react";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../api/firebase";
import { toast } from "react-toastify";

interface IPeriodOption {
  current: "daily" | "weekly" | "monthly";
}

interface IToggleCard {
  toggle?: boolean;
  card?: string;
  name?: string;
  sleep?: boolean;
}

export default function dashboard() {
  const [inputValue, setInputValue] = useState<number>(0);
  const [dataUser, setDataUser] = useState<DocumentData | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const [periodOption, setPeriodOption] = useState<IPeriodOption>({
    current: "daily",
  });
  const [currentOptionMonth, setCurrentOptionMonth] = useState<string>("jan");
  const [currentOptionDayWeek, setCurrentOptionDayWeek] =
    useState<string>("seg");

  const [toggleInfoCard, setToggleInfoCard] = useState<IToggleCard>({
    card: "",
    name: "",
    sleep: false,
  });
  const [toggleCard, setToggleCard] = useState<boolean>(false);
  const [sleepCurrent, setSleepCurrent] = useState<number>(8);

  const [workValue, setWorkValue] = useState<number>(0);
  const [playValue, setPlayValue] = useState<number>(0);
  const [studyValue, setStudyValue] = useState<number>(0);
  const [exerciseValue, setExerciseValue] = useState<number>(0);
  const [socialValue, setSocialValue] = useState<number>(0);
  const [selfcareValue, setSelfcareValue] = useState<number>(0);

  const dayOfTheWeek = [
    "todos",
    "seg a sex",
    "dom",
    "seg",
    "ter",
    "qua",
    "qui",
    "sex",
    "sab",
  ];
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "maio",
    "jun",

    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  useEffect(() => {
    function getDateCurrent() {
      const date = new Date();
      const dayWeek = date.getDay();
      const month = date.getMonth();

      setCurrentOptionMonth(months[month]);
      setCurrentOptionDayWeek(dayOfTheWeek[2 + dayWeek]);
    }

    async function getDataUser() {
      const uid = await getUid();
      const urlUser = `/dataUser/${uid}`;
      const data: DocumentData = await getDoc(doc(db, urlUser));
      setDataUser(data.data());
    }

    async function getSleep() {
      const uid = await getUid();

      const getHours = await getDoc(doc(db, `data-${uid}/timeSleep`));
      if (getHours.data()?.sleep) {
        setSleepCurrent(getHours.data()?.sleep);
      }
    }

    getDateCurrent();
    getSleep();
    getDataUser();
  }, []);

  useEffect(() => {
    async function getDataTime() {
      const uid = await getUid();

      if (periodOption.current === "daily") {
        if (currentOptionDayWeek === "seg a sex") {
          getDoc(doc(db, `data/${uid}/segasex/work`)).then((resp) => {
            setWorkValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/segasex/play`)).then((resp) => {
            setPlayValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/segasex/study`)).then((resp) => {
            setStudyValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/segasex/exercise`)).then((resp) => {
            setExerciseValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/segasex/social`)).then((resp) => {
            setSocialValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/segasex/selfcare`)).then((resp) => {
            setSelfcareValue(resp.data()?.time ? resp.data()?.time : 0);
          });
        } else if (currentOptionDayWeek === "todos") {
          getDoc(doc(db, `data/${uid}/all/work`)).then((resp) => {
            setWorkValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/all/play`)).then((resp) => {
            setPlayValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/all/study`)).then((resp) => {
            setStudyValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/all/exercise`)).then((resp) => {
            setExerciseValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/all/social`)).then((resp) => {
            setSocialValue(resp.data()?.time ? resp.data()?.time : 0);
          });

          getDoc(doc(db, `data/${uid}/all/selfcare`)).then((resp) => {
            setSelfcareValue(resp.data()?.time ? resp.data()?.time : 0);
          });
        } else {
          getDoc(doc(db, `data/${uid}/${currentOptionDayWeek}/work`)).then(
            (resp) => {
              setWorkValue(resp.data()?.time ? resp.data()?.time : 0);
            }
          );

          getDoc(doc(db, `data/${uid}/${currentOptionDayWeek}/play`)).then(
            (resp) => {
              setPlayValue(resp.data()?.time ? resp.data()?.time : 0);
            }
          );

          getDoc(doc(db, `data/${uid}/${currentOptionDayWeek}/study`)).then(
            (resp) => {
              setStudyValue(resp.data()?.time ? resp.data()?.time : 0);
            }
          );

          getDoc(doc(db, `data/${uid}/${currentOptionDayWeek}/exercise`)).then(
            (resp) => {
              setExerciseValue(resp.data()?.time ? resp.data()?.time : 0);
            }
          );

          getDoc(doc(db, `data/${uid}/${currentOptionDayWeek}/social`)).then(
            (resp) => {
              setSocialValue(resp.data()?.time ? resp.data()?.time : 0);
            }
          );

          getDoc(doc(db, `data/${uid}/${currentOptionDayWeek}/selfcare`)).then(
            (resp) => {
              setSelfcareValue(resp.data()?.time ? resp.data()?.time : 0);
            }
          );
        }
      } else if (periodOption.current === "weekly") {
        getDoc(doc(db, `data/${uid}/dataWeekly/work`)).then((resp) => {
          setWorkValue(resp.data()?.time ? resp.data()?.time : 0);
        });

        getDoc(doc(db, `data/${uid}/dataWeekly/play`)).then((resp) => {
          setPlayValue(resp.data()?.time ? resp.data()?.time : 0);
        });

        getDoc(doc(db, `data/${uid}/dataWeekly/study`)).then((resp) => {
          setStudyValue(resp.data()?.time ? resp.data()?.time : 0);
        });

        getDoc(doc(db, `data/${uid}/dataWeekly/exercise`)).then((resp) => {
          setExerciseValue(resp.data()?.time ? resp.data()?.time : 0);
        });

        getDoc(doc(db, `data/${uid}/dataWeekly/social`)).then((resp) => {
          setSocialValue(resp.data()?.time ? resp.data()?.time : 0);
        });

        getDoc(doc(db, `data/${uid}/dataWeekly/selfcare`)).then((resp) => {
          setSelfcareValue(resp.data()?.time ? resp.data()?.time : 0);
        });
      }
    }

    getDataTime();

    return () => {};
  }, [currentOptionDayWeek]);

  useEffect(() => {
    let limit: number;

    if (periodOption.current === "daily") {
      const sumOfValue =
        workValue +
        playValue +
        studyValue +
        exerciseValue +
        socialValue +
        selfcareValue;
      limit = 24 - (sleepCurrent + sumOfValue);
      setTimeLeft(limit);
    } else if (periodOption.current === "monthly") {
      // limitTest
    }

    return () => {};
  });

  function handleOption(
    month: string,
    index: number,
    setHook: React.Dispatch<React.SetStateAction<string>>
  ) {
    setHook(month);
  }

  function handleCloseCard() {
    setToggleInfoCard({ card: "", name: "" });
    setToggleCard(false);
    setInputValue(0);
  }

  function openCard(
    card: string = "",
    name: string = "",
    sleep: boolean = false
  ) {
    if (sleep) {
      setInputValue(sleepCurrent);
    }
    setToggleInfoCard({ card, name, sleep });
    setToggleCard(true);
  }

  function getCurrentValue() {
    switch (toggleInfoCard.card) {
      case "work": {
        return workValue;
      }

      case "play": {
        return playValue;
      }

      case "study": {
        return studyValue;
      }

      case "exercise": {
        return exerciseValue;
      }

      case "social": {
        return socialValue;
      }

      case "selfcare": {
        return selfcareValue;
      }
    }
  }

  function handleInputTime(e: string) {
    if (periodOption.current === "daily") {
      const taskCurrentValue = getCurrentValue();
      console.log(taskCurrentValue);

      /*
      
      voltar aqui
      
      */

      if ((Number(e) <= timeLeft && Number(e) >= 0) || e === "") {
        if (toggleInfoCard) {
          setInputValue(Number(e));
        }
      }
    } else if (periodOption.current === "monthly") {
    }
  }

  function submitForm(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    if (toggleInfoCard.sleep) {
      handleSubmitSleep();
    } else {
      handelSubmitTime();
    }
  }

  function updateData(card: string, value: number) {
    switch (card) {
      case "work": {
        setWorkValue(value);
        break;
      }

      case "play": {
        setPlayValue(value);
        break;
      }

      case "study": {
        setStudyValue(value);
        break;
      }

      case "exercise": {
        setExerciseValue(value);
        break;
      }

      case "social": {
        setSocialValue(value);
        break;
      }

      case "selfcare": {
        setSelfcareValue(value);
        break;
      }
    }
  }

  async function handleSubmitSleep() {
    const uid = await getUid();
    setDoc(doc(db, `data-${uid}/timeSleep`), {
      sleep: inputValue,
    });
  }

  async function handelSubmitTime() {
    const uid = await getUid();

    if (periodOption.current === "daily") {
      if (currentOptionDayWeek === "seg a sex") {
        try {
          await setDoc(doc(db, `data/${uid}/segasex/${toggleInfoCard.card}`), {
            date: new Date(),
            time: inputValue,
          });

          for (let i = 1; i <= 5; i++) {
            const refData = doc(
              db,
              `data/${uid}/${dayOfTheWeek[2 + i]}/${toggleInfoCard.card}`
            );
            await setDoc(refData, {
              date: new Date(),
              time: inputValue,
            }).catch((err) => {
              console.error("Erro ao atualizar dados ", err);
            });
          }

          updateData(String(toggleInfoCard.card), inputValue);

          setTimeout(() => {
            handleCloseCard();
          }, 700);
        } catch (err) {
          console.error("Erro ao atualizar dados ", err);
          toast.error("Ocorreu um erro ao atualizar dados de segunda a sexta.");
        }
      } else if (currentOptionDayWeek === "todos") {
        try {
          await setDoc(doc(db, `data/${uid}/all/${toggleInfoCard.card}`), {
            date: new Date(),
            time: inputValue,
          }).catch((err) => {
            console.error("Erro ao atualizar dados ", err);
          });

          await setDoc(doc(db, `data/${uid}/segasex/${toggleInfoCard.card}`), {
            date: new Date(),
            time: inputValue,
          }).catch((err) => {
            console.error("Erro ao atualizar dados ", err);
          });

          for (let i = 1; i <= 7; i++) {
            const refData = doc(
              db,
              `data/${uid}/${dayOfTheWeek[1 + i]}/${toggleInfoCard.card}`
            );
            await setDoc(refData, {
              date: new Date(),
              time: inputValue,
            }).catch((err) => {
              console.error("Erro ao atualizar dados ", err);
            });
          }

          updateData(String(toggleInfoCard.card), inputValue);

          setTimeout(() => {
            handleCloseCard();
          }, 700);
        } catch (err) {
          console.error("Erro ao atualizar dados ", err);
          toast.error("Ocorreu um erro ao atualizar todos os dados.");
        }
      } else {
        const refData = doc(
          db,
          `data/${uid}/${currentOptionDayWeek}/${toggleInfoCard.card}`
        );
        setDoc(refData, {
          date: new Date(),
          time: inputValue,
        })
          .then(() => {
            toast.success("Atualizado com sucesso");
            updateData(String(toggleInfoCard.card), inputValue);

            setTimeout(() => {
              handleCloseCard();
            }, 700);
          })
          .catch((err) => {
            console.error("Erro ao atualizar dados >>> ", err);
            toast.error(
              "Houve um erro ao atualizar dados, por favor tente novamente."
            );
          });
      }
    } else if (periodOption.current === "weekly") {
      const refData = doc(db, `data/${uid}/dataWeekly/${toggleInfoCard.card}`);
      setDoc(refData, {
        date: new Date(),
        time: inputValue,
      }).then(() => {
        toast.success("Atualizado com sucesso");
        updateData(String(toggleInfoCard.card), inputValue);

        setTimeout(() => {
          handleCloseCard();
        }, 700);
      });
    }
  }

  async function getUid() {
    const user = await new Promise<User | null>((result) => {
      onAuthStateChanged(auth, (user) => {
        result(user);
      });
    });

    if (user?.uid) {
      return user.uid;
    } else {
      return new Error("Erro ao puxar o id do usuario ");
    }
  }

  return (
    <div className={styles.container}>
      {toggleCard && (
        <div className={styles.containerEditCard}>
          <div className={styles.containerEditBtn}>
            <button onClick={handleCloseCard}>Voltar</button>
          </div>

          <div className={styles.containerEdit}>
            <div>
              <h3>Edite</h3>
              <p>
                Edite o tempo para{" "}
                {toggleInfoCard.sleep ? "dormir" : <>{toggleInfoCard.name}</>}
                {toggleInfoCard.sleep && (
                  <>
                    <br />
                    recomendado de 8hr
                  </>
                )}
                {!toggleInfoCard.sleep && (
                  <>
                    <br /> tempo restante {timeLeft}hrs
                  </>
                )}
              </p>
            </div>

            <form onSubmit={submitForm}>
              <input
                onChange={(e) => handleInputTime(e.target.value)}
                value={inputValue}
                placeholder="Quantidade de horas"
                type="number"
              />

              <button type="submit">Editar</button>
            </form>
          </div>
        </div>
      )}
      {/* 
      {cardSleep && (
        <div className={styles.containerEditCard}>
          <div className={styles.containerEditBtn}>
            <button onClick={handleCloseCard}>Voltar</button>
          </div>

          <div className={styles.containerEdit}>
            <div>
              <h3>Edite</h3>
              <p>
                Edite o tempo para dormir <br /> O recomendado no minimo 7h
              </p>
            </div>

            <form onSubmit={handleSubmitSleep}>
              <input
                type="number"
                onChange={(e) => handleInputLimitSleep(e.target.value)}
                value={limitValue}
                placeholder="Horas para dormir"
              />

              <button type="submit" disabled={btnDisabled}>
                Editar
              </button>
            </form>
          </div>
        </div>
      )} */}

      <main>
        <menu>
          <div className={styles.contentUser}>
            <Image
              src={dataUser?.photoUser ? dataUser.photoUser : imgNoUser}
              alt="avatar"
            />
            <div>
              <span>Relatório para</span>
              <h1>{dataUser?.name}</h1>
            </div>
          </div>
          <div className={styles.containerSleep}>
            <button onClick={() => openCard("", "", true)}>Dormir</button>
            <strong>{sleepCurrent}hrs de sono</strong>
            <strong>Em torno de {timeLeft}hrs restantes </strong>
          </div>
          <ul>
            <li
              onClick={() => setPeriodOption({ current: "daily" })}
              className={
                periodOption.current === "daily" ? styles.selected : ""
              }
            >
              Diária
            </li>
            <li
              onClick={() => setPeriodOption({ current: "weekly" })}
              className={
                periodOption.current === "weekly" ? styles.selected : ""
              }
            >
              semanalmente
            </li>
            <li
              onClick={() => setPeriodOption({ current: "monthly" })}
              className={
                periodOption.current === "monthly" ? styles.selected : ""
              }
            >
              por mês
            </li>
          </ul>
          {periodOption.current === "daily" && (
            <ul className={styles.containerOption}>
              {dayOfTheWeek.map((month, index) => (
                <li
                  onClick={() =>
                    handleOption(month, index, setCurrentOptionDayWeek)
                  }
                  className={
                    currentOptionDayWeek === month ? styles.selected : ""
                  }
                >
                  {month}
                </li>
              ))}
            </ul>
          )}{" "}
          {periodOption.current === "monthly" && (
            <ul className={styles.containerOption}>
              {months.map((month, index) => (
                <li
                  onClick={() =>
                    handleOption(month, index, setCurrentOptionMonth)
                  }
                  className={
                    currentOptionMonth === month ? styles.selected : ""
                  }
                >
                  {month}
                </li>
              ))}
            </ul>
          )}
        </menu>

        <section className={styles.containerSection}>
          <article
            className={styles.secWork}
            onClick={() => openCard("work", "trabalho")}
          >
            <Image src={imgWork} loading="lazy" alt="icon" />
            <div className={styles.contentArticle}>
              <div>
                <strong>Trabalho</strong>
                <div className={styles.dots}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              <div className={styles.DifferentValue}>
                {/* {periodOption.current === "weekly" && (
                  <>
                    {listHoursWeekly.work != 0 && (
                      <>
                        {listHoursWeekly.work < workCurrentValue && (
                          <p className={styles.above}>valor ultrapassa</p>
                        )}

                        {listHoursWeekly.work > workCurrentValue && (
                          <p className={styles.below}>o valor é menor</p>
                        )}
                      </>
                    )}
                  </>
                )} */}

                {/* <h2>{listTask.work}hrs</h2> */}
                <h2>{workValue}hrs</h2>
              </div>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secPlay}
            onClick={() => openCard("play", "Jogos")}
          >
            <Image src={imgPlay} loading="lazy" alt="icon" />
            <div className={styles.contentArticle}>
              <div>
                <strong>Jogos</strong>
                <div className={styles.dots}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              <h2>{playValue}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secStudy}
            onClick={() => openCard("study", "estudos")}
          >
            <Image src={imgStudy} loading="lazy" alt="icon" />
            <div className={styles.contentArticle}>
              <div>
                <strong>Estudos</strong>
                <div className={styles.dots}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              <h2>{studyValue}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secExercise}
            onClick={() => openCard("exercise", "exercicios")}
          >
            <Image src={imgExercise} loading="lazy" alt="icon" />
            <div className={styles.contentArticle}>
              <div>
                <strong>Exercicio</strong>
                <div className={styles.dots}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              <h2>{exerciseValue}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secSocial}
            onClick={() => openCard("social", "social")}
          >
            <Image src={imgSocial} loading="lazy" alt="icon" />
            <div className={styles.contentArticle}>
              <div>
                <strong>Social</strong>
                <div className={styles.dots}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              <h2>{socialValue}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secSelfCare}
            onClick={() => openCard("selfcare", "sáude")}
          >
            <Image src={imgSelfCare} loading="lazy" alt="icon" />
            <div className={styles.contentArticle}>
              <div>
                <strong>Sáude</strong>
                <div className={styles.dots}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              <h2>{selfcareValue}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
