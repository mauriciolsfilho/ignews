import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export function SignInButton() {
  const userLoggedIn = true;
  return (
    <button className={styles.signInButton} type="button">
      <FaGithub color={userLoggedIn ? "#04D361" : "#EBA417"} />
      {userLoggedIn ? "Mauricio Linhares" : "Sign in with github"}
      {userLoggedIn && <FiX color="#737380" className={styles.closeIcon} />}
    </button>
  );
}
