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
import { auth, db } from "../api/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

interface IToggleCard {
  name?: string;
  toggle?: boolean;
  card?: string;
}

interface IPeriod {
  current: "daily" | "weekly" | "monthly";
}

interface IMonths {
  current:
    | "jan"
    | "fev"
    | "mar"
    | "abr"
    | "maio"
    | "jun"
    | "jul"
    | "ago"
    | "set"
    | "out"
    | "nov"
    | "dez";
}

interface IListHoursWeekly {
  work?: number;
  play?: number;
  study?: number;
  exercise?: number;
  social?: number;
  selfcare?: number;
}

export default function dashboard() {
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [periodOption, setPeriodOption] = useState<IPeriod>({
    current: "weekly",
  });
  const [currentOptionMonth, setCurrentOptionMonth] = useState<string>("jan");
  const [currentOptionDayWeek, setCurrentOptionDayWeek] =
    useState<string>("qui");

  const [inputTime, setInputTime] = useState<string>("");

  const [infoUSer, setInfoUSer] = useState<DocumentData>({});
  const [toggleCard, setToggleCard] = useState<IToggleCard>({});

  const [playCurrentValue, setplayCurrentValue] = useState("");
  const [workCurrentValue, setworkCurrentValue] = useState("");
  const [studyCurrentValue, setstudyCurrentValue] = useState("");

  const [exerciseCurrentValue, setexerciseCurrentValue] = useState("");
  const [socialCurrentValue, setsocialCurrentValue] = useState("");
  const [selfcareCurrentValue, setselfcareCurrentValue] = useState("");

  const [limitValue, setLimitValue] = useState<number>(8);
  const [limit, setLimit] = useState<number>(0);
  const [cardSleep, setCardSleep] = useState<boolean>(false);

  const [listHoursWeekly, setListHoursWeekly] = useState<any>({
    work: 0,
    play: 0,
    study: 0,
    exercise: 0,
    social: 0,
    selfcare: 0,
  });

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
  const listOptions = [
    "work",
    "play",
    "study",
    "exercise",
    "social",
    "selfcare",
  ];

  useEffect(() => {
    async function getTimeSleep() {
      const userUid = await getUid();

      let baseUrl: string;

      if (periodOption.current === "weekly") {
        baseUrl = `data-${userUid}/${periodOption.current}/data/timesleep`;
      } else {
        baseUrl = `data-${userUid}/${periodOption.current}/${currentOptionDayWeek}/timesleep`;
      }

      const getSleep = await getDoc(doc(db, baseUrl));
      if (getSleep.data()?.sleep) {
        setLimitValue(getSleep.data()?.sleep);
      } else {
        setLimitValue(8);
      }
    }

    getTimeSleep();
  }, [periodOption, currentOptionDayWeek, currentOptionMonth, btnDisabled]);

  // hours
  useEffect(() => {
    getDataTime();
  }, [periodOption, currentOptionDayWeek, currentOptionMonth, btnDisabled]);

  // assimilando os horarios
  useEffect(() => {
    async function getHoursDaily() {
      const promises = listOptions.map(async (element) => {
        return totalHours({ current: "daily" }, element);
      });

      await Promise.all(promises);

      setListHoursWeekly((prevListHours: IListHoursWeekly) => ({
        ...prevListHours,
      }));
    }

    getHoursDaily();
  }, [currentOptionDayWeek, listHoursWeekly]);

  // user
  useEffect(() => {
    async function getDataUser() {
      const uid = await getUid();

      const dataUser: DocumentData = await getDoc(doc(db, `/dataUser/${uid}`));
      if (dataUser) {
        setInfoUSer(dataUser.data());
      }
    }

    getDataUser();
  }, []);

  // dia atual
  useEffect(() => {
    const currentDate = new Date();
    const getCurrentMonth = currentDate.getMonth();
    setCurrentOptionMonth(months[getCurrentMonth]);

    const getCurrentDay = currentDate.getDay();
    setCurrentOptionDayWeek(dayOfTheWeek[getCurrentDay + 2]);
  }, []);

  async function getDataTime() {
    const userUid = await getUid();

    let limit = 0;

    let valueUrl = `data-${userUid}/`;

    if (periodOption.current === "daily") {
      if (currentOptionDayWeek === "todos") {
        valueUrl += `${periodOption.current}/all/`;
      } else if (currentOptionDayWeek === "seg a sex") {
        valueUrl += `${periodOption.current}/segasex/`;
      } else {
        valueUrl += `${periodOption.current}/${currentOptionDayWeek}/`;
      }
      /*
      // await getDoc(doc(db, valueUrl + "work")).then((resp: DocumentData) => {
      //   if (resp.data()) {
      //     setworkCurrentValue(resp.data().time);
      //     limit += resp.data().time;
      //   } else {
      //     setworkCurrentValue("");
      //   }
      // });

      // await getDoc(doc(db, valueUrl + "play")).then((resp: DocumentData) => {
      //   if (resp.data()) {
      //     setplayCurrentValue(resp.data().time);
      //     limit += resp.data().time;
      //   } else {
      //     setplayCurrentValue("");
      //   }
      // });

      // await getDoc(doc(db, valueUrl + "study")).then((resp: DocumentData) => {
      //   if (resp.data()) {
      //     setstudyCurrentValue(resp.data().time);
      //     limit += resp.data().time;
      //   } else {
      //     setstudyCurrentValue("");
      //   }
      // });

      // await getDoc(doc(db, valueUrl + "exercise")).then(
      //   (resp: DocumentData) => {
      //     if (resp.data()) {
      //       setexerciseCurrentValue(resp.data().time);
      //       limit += resp.data().time;
      //     } else {
      //       setexerciseCurrentValue("");
      //     }
      //   }
      // );

      // await getDoc(doc(db, valueUrl + "social")).then((resp: DocumentData) => {
      //   if (resp.data()) {
      //     setsocialCurrentValue(resp.data().time);
      //     limit += resp.data().time;
      //   } else {
      //     setsocialCurrentValue("");
      //   }
      // });

      // await getDoc(doc(db, valueUrl + "selfcare")).then(
      //   (resp: DocumentData) => {
      //     if (resp.data()) {
      //       setselfcareCurrentValue(resp.data().time);
      //       limit += resp.data().time;
      //     } else {
      //       setselfcareCurrentValue("");
      //     }
      //   }
      // ); */
    } else if (periodOption.current === "weekly") {
      console.log("Semanas");

      valueUrl += `${periodOption.current}/data/`;

      await getDoc(doc(db, valueUrl + "work")).then((resp: DocumentData) => {
        if (resp.data()) {
          setworkCurrentValue(resp.data().time);
          limit += resp.data().time;
        } else {
          setworkCurrentValue("");
        }
      });

      await getDoc(doc(db, valueUrl + "play")).then((resp: DocumentData) => {
        if (resp.data()) {
          setplayCurrentValue(resp.data().time);
          limit += resp.data().time;
        } else {
          setplayCurrentValue("");
        }
      });

      await getDoc(doc(db, valueUrl + "study")).then((resp: DocumentData) => {
        if (resp.data()) {
          setstudyCurrentValue(resp.data().time);
          limit += resp.data().time;
        } else {
          setstudyCurrentValue("");
        }
      });

      await getDoc(doc(db, valueUrl + "exercise")).then(
        (resp: DocumentData) => {
          if (resp.data()) {
            setexerciseCurrentValue(resp.data().time);
            limit += resp.data().time;
          } else {
            setexerciseCurrentValue("");
          }
        }
      );

      await getDoc(doc(db, valueUrl + "social")).then((resp: DocumentData) => {
        if (resp.data()) {
          setsocialCurrentValue(resp.data().time);
          limit += resp.data().time;
        } else {
          setsocialCurrentValue("");
        }
      });

      await getDoc(doc(db, valueUrl + "selfcare")).then(
        (resp: DocumentData) => {
          if (resp.data()) {
            setselfcareCurrentValue(resp.data().time);
            limit += resp.data().time;
          } else {
            setselfcareCurrentValue("");
          }
        }
      );
    } else if (periodOption.current === "monthly") {
      console.log("Meses");
    }

    await getDoc(doc(db, valueUrl + "work")).then((resp: DocumentData) => {
      if (resp.data()) {
        setworkCurrentValue(resp.data().time);
        limit += resp.data().time;
      } else {
        setworkCurrentValue("");
      }
    });

    await getDoc(doc(db, valueUrl + "play")).then((resp: DocumentData) => {
      if (resp.data()) {
        setplayCurrentValue(resp.data().time);
        limit += resp.data().time;
      } else {
        setplayCurrentValue("");
      }
    });

    await getDoc(doc(db, valueUrl + "study")).then((resp: DocumentData) => {
      if (resp.data()) {
        setstudyCurrentValue(resp.data().time);
        limit += resp.data().time;
      } else {
        setstudyCurrentValue("");
      }
    });

    await getDoc(doc(db, valueUrl + "exercise")).then((resp: DocumentData) => {
      if (resp.data()) {
        setexerciseCurrentValue(resp.data().time);
        limit += resp.data().time;
      } else {
        setexerciseCurrentValue("");
      }
    });

    await getDoc(doc(db, valueUrl + "social")).then((resp: DocumentData) => {
      if (resp.data()) {
        setsocialCurrentValue(resp.data().time);
        limit += resp.data().time;
      } else {
        setsocialCurrentValue("");
      }
    });

    await getDoc(doc(db, valueUrl + "selfcare")).then((resp: DocumentData) => {
      if (resp.data()) {
        setselfcareCurrentValue(resp.data().time);
        limit += resp.data().time;
      } else {
        setselfcareCurrentValue("");
      }
    });

    limit = limit + limitValue;
    if (periodOption.current === "daily") limit = 24 - limit;
    if (periodOption.current === "weekly") limit = 120 - limit;
    if (periodOption.current === "monthly") limit = 480 - limit;

    setLimit(limit);
  }

  function handleCard(card: string, name: string) {
    setToggleCard({
      name,
      toggle: true,
      card: card,
    });
  }

  function handleInputTime(e: string) {
    if ((Number(e) <= limit && Number(e) >= 0) || e === "") {
      setInputTime(e);
    }
  }

  function handleCloseCard() {
    setBtnDisabled(false);

    setToggleCard({});

    setCardSleep(false);
    setLimitValue(8);
  }

  function handleOption(index: number) {
    if (periodOption.current === "monthly") {
      setCurrentOptionMonth(months[index]);
      console.log("Meses ");
    } else if (periodOption.current === "daily") {
      setCurrentOptionDayWeek(dayOfTheWeek[index]);
    }
  }

  function handleSleepCard() {
    console.log("ola mundo");
  }

  function handleInputLimitSleep(e: string) {
    const value = Number(e);
    const limit = 16;

    const regNumber = /^[0-9]+$/;
    if ((regNumber.test(e) || e === "") && value >= 4 && value <= limit) {
      setLimitValue(value);
    }
  }

  async function getUid() {
    const user = await new Promise<null | User>((result) => {
      onAuthStateChanged(auth, (user) => {
        result(user);
      });
    });

    if (user) {
      return user.uid;
    } else {
      return new Error("Error ao buscar uid");
    }
  }

  async function getHistory(url: string) {
    const userUid = await getUid();
    const baseUrl = `data-${userUid}/${url}`;
    const data = await getDoc(doc(db, baseUrl));
    // if(!!data.data()) {
    //     await addDoc(collection(db, `data/${userUid}/history/${url}`), data);
    // };
  }

  async function handleSubmitTime(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setBtnDisabled(true);
    const userUid = await getUid();
    const baseUrl = `data-${userUid}/`;

    if (periodOption.current === "daily") {
      if (currentOptionDayWeek === "todos") {
        const urlAll =
          baseUrl + `${periodOption.current}/all/${toggleCard.card}`;
        await getHistory(`${periodOption.current}/all/${toggleCard.card}`);

        await setDoc(doc(db, urlAll), {
          date: new Date(),
          time: Number(inputTime),
        });

        const urlSegAsex =
          baseUrl + `${periodOption.current}/segasex/${toggleCard.card}`;

        await getHistory(`${periodOption.current}/segasex/${toggleCard.card}`);

        await setDoc(doc(db, urlSegAsex), {
          date: new Date(),
          time: Number(inputTime),
        });

        for (let i = 1; i <= 7; i++) {
          const refUrl =
            baseUrl +
            `${periodOption.current}/${dayOfTheWeek[1 + i]}/${toggleCard.card}`;

          await getHistory(
            `${periodOption.current}/${dayOfTheWeek[2 + i]}/${toggleCard.card}`
          );

          await setDoc(doc(db, refUrl), {
            date: new Date(),
            time: Number(inputTime),
          });
        }
      } else if (currentOptionDayWeek === "seg a sex") {
        const urlSegAsex =
          baseUrl + `${periodOption.current}/segasex/${toggleCard.card}`;

        await getHistory(`${periodOption.current}/segasex/${toggleCard.card}`);

        await setDoc(doc(db, urlSegAsex), {
          date: new Date(),
          time: Number(inputTime),
        });

        for (let i = 1; i <= 5; i++) {
          const refUrl =
            baseUrl +
            `${periodOption.current}/${dayOfTheWeek[2 + i]}/${toggleCard.card}`;

          await getHistory(
            `${periodOption.current}/${dayOfTheWeek[2 + i]}/${toggleCard.card}`
          );

          await setDoc(doc(db, refUrl), {
            date: new Date(),
            time: Number(inputTime),
          });
        }
      } else {
        await getHistory(
          `${periodOption.current}/${currentOptionDayWeek}/${toggleCard.card}`
        );
        const refUrl =
          baseUrl +
          `${periodOption.current}/${currentOptionDayWeek}/${toggleCard.card}`;

        await setDoc(doc(db, refUrl), {
          date: new Date(),
          time: Number(inputTime),
        });
      }

      await matchWeekValues();
    } else if (periodOption.current === "weekly") {
      await getHistory(`${periodOption.current}/data/${toggleCard.card}`);

      const refUrl =
        baseUrl + `${periodOption.current}/data/${toggleCard.card}`;

      await setDoc(doc(db, refUrl), {
        date: new Date(),
        time: Number(inputTime),
      });
    } else if (periodOption.current === "monthly") {
      console.log("Meses");
    }

    setTimeout(() => {
      handleCloseCard();
      getDataTime();
    }, 1000);
  }

  async function handleSubmitSleep(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    setBtnDisabled(true);

    const userUid = await getUid();

    let baseUrl = `data-${userUid}/${periodOption.current}`;

    if (periodOption.current === "daily")
      baseUrl = `/${currentOptionDayWeek}/timesleep`;
    // if (periodOption.current === "weekly") ;
    // if (periodOption.current === "monthly") ;

    await setDoc(doc(db, baseUrl), {
      sleep: limitValue,
    }).then(() => {});

    setBtnDisabled(true);

    setTimeout(() => {
      handleCloseCard();
    }, 1500);
  }

  // total das horas
  async function totalHours(e: IPeriod, card: string) {
    const userUid = await getUid();
    let totalValue = 0;

    if (e.current === "daily") {
      for (let i = 1; i <= 7; i++) {
        const baseUrlDaily = `data-${userUid}/daily/${
          dayOfTheWeek[1 + i]
        }/${card}`;
        const dataCurrent = await getDoc(doc(db, baseUrlDaily));
        totalValue += dataCurrent.data()?.time ? dataCurrent.data()?.time : 0;
      }
      listHoursWeekly[card] = totalValue;
      setListHoursWeekly(listHoursWeekly);
    }
  }

  /*
  
  aonde sendo chamado
  useEffect(() => {
    function getHoursDaily() {
      listOptions.forEach(async (element) => {
        await totalHours({ current: "daily" }, element);
      });
    }

    getHoursDaily();
  }, [currentOptionDayWeek, listHoursWeekly]);

  
  local aonde esta sendo atualizado
  async function totalHours(e: IPeriod, card: string) {
    const userUid = await getUid();
    let totalValue = 0;

    if (e.current === "daily") {
      for (let i = 1; i <= 7; i++) {
        const baseUrlDaily = `data-${userUid}/daily/${
          dayOfTheWeek[1 + i]
        }/${card}`;
        const dataCurrent = await getDoc(doc(db, baseUrlDaily));
        totalValue += dataCurrent.data()?.time ? dataCurrent.data()?.time : 0;
      }
      listHoursWeekly[card] = totalValue;
      setListHoursWeekly(listHoursWeekly);
    }
  }

  os componentes
  <div className={styles.DifferentValue}>
                {periodOption.current === "weekly" && (
                  <>
                    
                    {listHoursWeekly.work === workCurrentValue && (
                      <p>o valor esta certo</p>
                    )}

                    {listHoursWeekly.work < workCurrentValue && (
                      <p>ultrapassa</p>
                    )}

                    {listHoursWeekly.work > workCurrentValue && (
                      <p>o valor é menor</p>
                    )}
                  
              </>
            )}

            <h2>{workCurrentValue ? workCurrentValue : 0}hrs</h2>
          </div>

  
  */

  // igualar valores com os dias
  async function matchWeekValues() {
    const userUid = await getUid();
    const baseUrl = `data-${userUid}/weekly/data/${toggleCard.card}`;

    const data = await getDoc(doc(db, baseUrl));
    if (!!!data.data()) {
      let totalValue = 0;

      for (let i = 1; i <= 7; i++) {
        const baseUrlDaily = `data-${userUid}/daily/${dayOfTheWeek[1 + i]}/${
          toggleCard.card
        }`;
        const dataCurrent = await getDoc(doc(db, baseUrlDaily));
        totalValue += dataCurrent.data()?.time ? dataCurrent.data()?.time : 0;
      }

      await setDoc(doc(db, baseUrl), {
        date: new Date(),
        time: totalValue,
      });
    }
  }

  console.log(listHoursWeekly.work === workCurrentValue);
  console.log(workCurrentValue);
  console.log(listHoursWeekly.work);

  return (
    <div className={styles.container}>
      {toggleCard.toggle && (
        <div className={styles.containerEditCard}>
          <div className={styles.containerEditBtn}>
            <button onClick={handleCloseCard}>Voltar</button>
          </div>

          <div className={styles.containerEdit}>
            <div>
              <h3>Edite</h3>
              <p>Edite o tempo para {toggleCard.name}</p>
            </div>

            <form onSubmit={handleSubmitTime}>
              <input
                onChange={(e) => handleInputTime(e.target.value)}
                value={inputTime}
                placeholder="Quantidade de horas"
                type="number"
              />

              <button type="submit" disabled={btnDisabled}>
                Editar
              </button>
            </form>
          </div>
        </div>
      )}

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
      )}

      <main>
        <menu>
          <div className={styles.contentUser}>
            <Image
              src={infoUSer.photoUser ? infoUSer.photoUser : imgNoUser}
              alt="avatar"
            />
            <div>
              <span>Relatório para</span>
              <h1>{infoUSer.name}</h1>
            </div>
          </div>
          <div className={styles.containerSleep}>
            <button onClick={() => setCardSleep(true)}>Dormir</button>
            <strong>{limitValue}hrs de sono</strong>
            <strong>Em torno de {limit}hrs restantes </strong>
          </div>
          <ul>
            <li
              className={
                periodOption.current === "daily" ? styles.selected : ""
              }
              onClick={() => setPeriodOption({ current: "daily" })}
            >
              Diária
            </li>
            <li
              className={
                periodOption.current === "weekly" ? styles.selected : ""
              }
              onClick={() => setPeriodOption({ current: "weekly" })}
            >
              semanalmente
            </li>
            <li
              className={
                periodOption.current === "monthly" ? styles.selected : ""
              }
              onClick={() => setPeriodOption({ current: "monthly" })}
            >
              por mês
            </li>
          </ul>
          {periodOption.current === "daily" && (
            <ul className={styles.containerOption}>
              {dayOfTheWeek.map((month, index) => (
                <li
                  onClick={() => handleOption(index)}
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
                  onClick={() => handleOption(index)}
                  className={
                    currentOptionMonth === month ? styles.selected : ""
                  }
                >
                  {month}
                </li>
              ))}
            </ul>
          )}{" "}
        </menu>

        <section className={styles.containerSection}>
          <article
            onClick={() => handleCard("work", "Trabalho")}
            className={styles.secWork}
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
                {periodOption.current === "weekly" && (
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
                )}

                <h2>{workCurrentValue ? workCurrentValue : 0}hrs</h2>
              </div>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            onClick={() => handleCard("play", "Jogos")}
            className={styles.secPlay}
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

              <h2>{playCurrentValue ? playCurrentValue : 0}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            onClick={() => handleCard("study", "Estudos")}
            className={styles.secStudy}
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

              <h2>{studyCurrentValue ? studyCurrentValue : 0}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            onClick={() => handleCard("exercise", "Exercicios")}
            className={styles.secExercise}
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

              <h2>{exerciseCurrentValue ? exerciseCurrentValue : 0}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            onClick={() => handleCard("social", "Social")}
            className={styles.secSocial}
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

              <h2>{socialCurrentValue ? socialCurrentValue : 0}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            onClick={() => handleCard("selfcare", "Saúde")}
            className={styles.secSelfCare}
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

              <h2>{selfcareCurrentValue ? selfcareCurrentValue : 0}hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
