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
  getDocs,
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
    current: "monthly",
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
  const [inputSwitch, setInputSwitch] = useState<boolean>(false);
  const [sleepCurrent, setSleepCurrent] = useState<number>(8);

  const [workValue, setWorkValue] = useState<number>(0);
  const [playValue, setPlayValue] = useState<number>(0);
  const [studyValue, setStudyValue] = useState<number>(0);
  const [exerciseValue, setExerciseValue] = useState<number>(0);
  const [socialValue, setSocialValue] = useState<number>(0);
  const [selfcareValue, setSelfcareValue] = useState<number>(0);

  const [shouldWork, setShouldWork] = useState<number>(0);
  const [shouldPlay, setShouldPlay] = useState<number>(0);
  const [shouldStudy, setShouldStudy] = useState<number>(0);
  const [shouldExercise, setShouldExercise] = useState<number>(0);
  const [shouldSocial, setShouldSocial] = useState<number>(0);
  const [shouldSelfcare, setShouldSelfcare] = useState<number>(0);

  const [showShouldValue, setShowShouldValue] = useState<{
    value: number;
    toggle: boolean;
  }>({ value: 0, toggle: false });

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

    async function handleData() {
      const uid = await getUid();
      const baseUrl = `data/${uid}/dataWeekly`;
      const baseUrlMonth = `/data/${uid}/${currentOptionMonth}`;

      // /*     Monthly      */
      if (periodOption.current === "weekly") {
        getDoc(doc(db, baseUrl + "/work")).then((resp) => {
          if (!resp.data()) {
            handleHittingDice(baseUrl + "/work", "work", String(uid));
          } else {
            rightAmount(setShouldWork, "work", String(uid));
          }
        });

        getDoc(doc(db, baseUrl + "/play")).then((resp) => {
          if (!resp.data()) {
            handleHittingDice(baseUrl + "/play", "play", String(uid));
          } else {
            rightAmount(setShouldPlay, "play", String(uid));
          }
        });

        getDoc(doc(db, baseUrl + "/study")).then((resp) => {
          if (!resp.data()) {
            handleHittingDice(baseUrl + "/study", "study", String(uid));
          } else {
            rightAmount(setShouldStudy, "study", String(uid));
          }
        });

        getDoc(doc(db, baseUrl + "/exercise")).then((resp) => {
          if (!resp.data()) {
            handleHittingDice(baseUrl + "/exercise", "exercise", String(uid));
          } else {
            rightAmount(setShouldExercise, "exercise", String(uid));
          }
        });

        getDoc(doc(db, baseUrl + "/social")).then((resp) => {
          if (!resp.data()) {
            handleHittingDice(baseUrl + "/social", "social", String(uid));
          } else {
            rightAmount(setShouldSocial, "social", String(uid));
          }
        });

        getDoc(doc(db, baseUrl + "/selfcare")).then((resp) => {
          if (!resp.data()) {
            handleHittingDice(baseUrl + "/selfcare", "selfcare", String(uid));
          } else {
            rightAmount(setShouldSelfcare, "selfcare", String(uid));
          }
        });
      } else if (periodOption.current === "monthly") {
        getDoc(doc(db, baseUrlMonth + "/work")).then((resp) => {
          rightAmount(setShouldWork, "work", String(uid));
        });

        getDoc(doc(db, baseUrlMonth + "/play")).then((resp) => {
          rightAmount(setShouldPlay, "play", String(uid));
        });

        getDoc(doc(db, baseUrlMonth + "/study")).then((resp) => {
          rightAmount(setShouldStudy, "study", String(uid));
        });

        getDoc(doc(db, baseUrlMonth + "/exercise")).then((resp) => {
          rightAmount(setShouldExercise, "exercise", String(uid));
        });

        getDoc(doc(db, baseUrlMonth + "/social")).then((resp) => {
          rightAmount(setShouldSocial, "social", String(uid));
        });

        getDoc(doc(db, baseUrlMonth + "/selfcare")).then((resp) => {
          rightAmount(setShouldSelfcare, "selfcare", String(uid));
        });
      }
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

    handleData();
  }, []);

  useEffect(() => {
    async function getDataTime() {
      const uid = await getUid();

      clearValue();

      /*       VOLTAR AQUI        */
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
      } else if (periodOption.current === "monthly") {
        getDocs(collection(db, `data/${uid}/${currentOptionMonth}`)).then(
          (resp) => {
            resp.docChanges().forEach((element) => {
              const task = element.doc.id;
              handleSetTask(task, element.doc.data().time);
            });
          }
        );
      }
    }

    getDataTime();

    return () => {};
  }, [currentOptionDayWeek, currentOptionMonth, periodOption]);

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
    } else if (periodOption.current === "weekly") {
      const sumOfValue =
        workValue +
        playValue +
        studyValue +
        exerciseValue +
        socialValue +
        selfcareValue;
      limit = 168 - (sleepCurrent * 7 + sumOfValue);
      setTimeLeft(limit);
    } else if (periodOption.current === "monthly") {
      const sumOfValue =
        workValue +
        playValue +
        studyValue +
        exerciseValue +
        socialValue +
        selfcareValue;
      limit = 672 - (sleepCurrent * 28 + sumOfValue);
      setTimeLeft(limit);
    }

    return () => {};
  });

  function clearValue() {
    setWorkValue(0);
    setPlayValue(0);
    setStudyValue(0);

    setExerciseValue(0);
    setSocialValue(0);
    setSelfcareValue(0);
  }

  function handleSetTask(task: string, data: number) {
    switch (task) {
      case "work": {
        setWorkValue(data);
        break;
      }

      case "play": {
        setPlayValue(data);
        break;
      }

      case "study": {
        setStudyValue(data);
        break;
      }

      case "exercise": {
        setExerciseValue(data);
        break;
      }

      case "social": {
        setSocialValue(data);
        break;
      }

      case "selfcare": {
        setSelfcareValue(data);
        break;
      }
    }
  }

  async function rightAmount(setHook: any, urlTask: string, uid: string) {
    // voltar aqui
    let totalHours = 0;
    for (let i = 1; i <= 7; i++) {
      const data = await getDoc(
        doc(db, `/data/${uid}/${dayOfTheWeek[1 + i]}/${urlTask}`)
      );
      if (data.data()) {
        totalHours += data.data()?.time;
      }
    }

    /// voltar aqui
    if (periodOption.current === "weekly") {
      setHook(totalHours);
    } else if (periodOption.current === "monthly") {
      setHook(4 * totalHours);
    }
  }

  async function handleHittingDice(url: string, urlTask: string, uid: string) {
    // dayOfTheWeek
    let totalHours = 0;
    for (let i = 1; i <= 7; i++) {
      const data = await getDoc(
        doc(db, `/data/${uid}/${dayOfTheWeek[1 + i]}/${urlTask}`)
      );
      if (data.data()) {
        totalHours += data.data()?.time;
      }
    }

    setDoc(doc(db, url), {
      date: new Date(),
      time: totalHours,
    });
  }

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
    setShowShouldValue({ value: 0, toggle: false });
  }

  function openCard(
    card: string = "",
    name: string = "",
    sleep: boolean = false,
    value: number = 0,
    shoudvalue: number = 0
  ) {
    if (sleep) {
      setInputValue(sleepCurrent);
    } else {
      setInputValue(value);
    }

    if (shoudvalue != value) {
      setShowShouldValue({ value: shoudvalue, toggle: true });
    } else {
      setShowShouldValue({ value: 0, toggle: false });
    }

    // setShowShouldValue();
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

      if (
        (Number(e) <= timeLeft + Number(taskCurrentValue) && Number(e) >= 0) ||
        e === ""
      ) {
        if (toggleInfoCard) {
          setInputValue(Number(e));
        }
      }
    } else if (periodOption.current === "weekly") {
      const taskCurrentValue = getCurrentValue();

      if (
        (Number(e) <= timeLeft + Number(taskCurrentValue) && Number(e) >= 0) ||
        e === ""
      ) {
        if (toggleInfoCard) {
          setInputValue(Number(e));
        }
      }
    } else if (periodOption.current === "monthly") {
      const taskCurrentValue = getCurrentValue();

      if (
        (Number(e) <= timeLeft + Number(taskCurrentValue) && Number(e) >= 0) ||
        e === ""
      ) {
        if (toggleInfoCard) {
          setInputValue(Number(e));

          console.log(timeLeft);
        }
      }

      setInputValue(Number(e));
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

        switch (toggleInfoCard.card) {
          case "work": {
            rightAmount(
              setShouldWork,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "play": {
            rightAmount(
              setShouldPlay,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "study": {
            rightAmount(
              setShouldStudy,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "exercise": {
            rightAmount(
              setShouldExercise,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "social": {
            rightAmount(
              setShouldSocial,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "selfcare": {
            rightAmount(
              setShouldSelfcare,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }
        }

        setTimeout(() => {
          handleCloseCard();
        }, 700);
      });
    } else if (periodOption.current === "monthly") {
      const refData = doc(
        db,
        `data/${uid}/${currentOptionMonth}/${toggleInfoCard.card}`
      );
      setDoc(refData, {
        date: new Date(),
        time: inputValue,
      }).then(() => {
        toast.success("Atualizado com sucesso");
        updateData(String(toggleInfoCard.card), inputValue);

        switch (toggleInfoCard.card) {
          case "work": {
            rightAmount(
              setShouldWork,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "play": {
            rightAmount(
              setShouldPlay,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "study": {
            rightAmount(
              setShouldStudy,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "exercise": {
            rightAmount(
              setShouldExercise,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "social": {
            rightAmount(
              setShouldSocial,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }

          case "selfcare": {
            rightAmount(
              setShouldSelfcare,
              String(toggleInfoCard.card),
              String(uid)
            );
            break;
          }
        }

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
              {(periodOption.current === "weekly" ||
                periodOption.current === "monthly") &&
                showShouldValue.toggle && (
                  <p className={styles.valueShouldBe}>
                    o Valor deveria ser {showShouldValue.value}
                  </p>
                )}
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
          <div className={styles.toggleMessage}>
            {(periodOption.current === "weekly" ||
              periodOption.current === "monthly") && (
              <>
                <p>desativar mensagem no card</p>{" "}
                <div className={styles.inputSwitch}>
                  {" "}
                  <div
                    className={
                      inputSwitch ? styles.switchLeft : styles.switchRight
                    }
                  />{" "}
                  <input
                    type="checkbox"
                    checked={inputSwitch}
                    onClick={() => setInputSwitch((p) => !p)}
                  />{" "}
                </div>{" "}
              </>
            )}
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
            onClick={() =>
              openCard("work", "trabalho", false, workValue, shouldWork)
            }
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
                {(periodOption.current === "weekly" ||
                  periodOption.current === "monthly") &&
                  inputSwitch && (
                    <>
                      {shouldWork < workValue && (
                        <p className={styles.above}>valor ultrapassa</p>
                      )}{" "}
                      {shouldWork > workValue && (
                        <p className={styles.below}>o valor está menor</p>
                      )}{" "}
                    </>
                  )}

                <h2>{workValue}hrs</h2>
              </div>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secPlay}
            onClick={() =>
              openCard("play", "Jogos", false, playValue, shouldPlay)
            }
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

              <div className={styles.DifferentValue}>
                {(periodOption.current === "weekly" ||
                  periodOption.current === "monthly") &&
                  inputSwitch && (
                    <>
                      {shouldPlay < playValue && (
                        <p className={styles.above}>valor ultrapassa</p>
                      )}{" "}
                      {shouldPlay > playValue && (
                        <p className={styles.below}>o valor está menor</p>
                      )}{" "}
                    </>
                  )}

                <h2>{playValue}hrs</h2>
              </div>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secStudy}
            onClick={() =>
              openCard("study", "estudos", false, studyValue, shouldStudy)
            }
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

              <div className={styles.DifferentValue}>
                {(periodOption.current === "weekly" ||
                  periodOption.current === "monthly") &&
                  inputSwitch && (
                    <>
                      {shouldStudy < studyValue && (
                        <p className={styles.above}>valor ultrapassa</p>
                      )}{" "}
                      {shouldStudy > studyValue && (
                        <p className={styles.below}>o valor está menor</p>
                      )}{" "}
                    </>
                  )}

                <h2>{studyValue}hrs</h2>
              </div>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secExercise}
            onClick={() =>
              openCard(
                "exercise",
                "exercicios",
                false,
                exerciseValue,
                shouldExercise
              )
            }
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

              <div className={styles.DifferentValue}>
                {(periodOption.current === "weekly" ||
                  periodOption.current === "monthly") &&
                  inputSwitch && (
                    <>
                      {shouldExercise < exerciseValue && (
                        <p className={styles.above}>valor ultrapassa</p>
                      )}{" "}
                      {shouldExercise > exerciseValue && (
                        <p className={styles.below}>o valor está menor</p>
                      )}{" "}
                    </>
                  )}

                <h2>{exerciseValue}hrs</h2>
              </div>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secSocial}
            onClick={() =>
              openCard("social", "social", false, socialValue, shouldSocial)
            }
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

              <div className={styles.DifferentValue}>
                {(periodOption.current === "weekly" ||
                  periodOption.current === "monthly") &&
                  inputSwitch && (
                    <>
                      {shouldSocial < socialValue && (
                        <p className={styles.above}>valor ultrapassa</p>
                      )}{" "}
                      {shouldSocial > socialValue && (
                        <p className={styles.below}>o valor está menor</p>
                      )}{" "}
                    </>
                  )}

                <h2>{socialValue}hrs</h2>
              </div>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article
            className={styles.secSelfCare}
            onClick={() =>
              openCard(
                "selfcare",
                "sáude",
                false,
                selfcareValue,
                shouldSelfcare
              )
            }
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

              <div className={styles.DifferentValue}>
                {(periodOption.current === "weekly" ||
                  periodOption.current === "monthly") &&
                  inputSwitch && (
                    <>
                      {shouldSelfcare < selfcareValue && (
                        <p className={styles.above}>valor ultrapassa</p>
                      )}{" "}
                      {shouldSelfcare > selfcareValue && (
                        <p className={styles.below}>o valor está menor</p>
                      )}{" "}
                    </>
                  )}

                <h2>{selfcareValue}hrs</h2>
              </div>

              <span>Semana passada - 5h</span>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
