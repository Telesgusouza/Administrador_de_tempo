import Image from "next/image";
import styles from "./styles.module.css";

import imgTest from "../../../public/images/image-jeremy.png";

import imgWork from "../../../public/images/icon-work.svg";

export default function dashboard() {
  return (
    <div className={styles.container}>
      <main>
        <menu>
          <div className={styles.contentUser}>
            <Image src={imgTest} alt="avatar" />
            <div>
              <span>Relatório para</span>
              <h1>Jeremy Robson Jeremy Robson Jeremy Robson</h1>
            </div>
          </div>

          <ul>
            <li className={styles.selected}>Diária</li>
            <li>semanalmente</li>
            <li>Dalily</li>
          </ul>
        </menu>
        {/*  */}
        <section className={styles.containerSection}>
          <article>
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

              <h2>100hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article>
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

              <h2>4 hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article>
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

              <h2>4 hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article>
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

              <h2>4 hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article>
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

              <h2>4 hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>

          <article>
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

              <h2>4 hrs</h2>

              <span>Semana passada - 5h</span>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
