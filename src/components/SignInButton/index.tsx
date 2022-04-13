import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";

export function SignInButton() {
  const { data } = useSession();
  return (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => (!data ? signIn("github") : signOut())}
    >
      {data ? (
        <>
          <img src={data.user.image} alt="Profile image" />
          {data.user.name}
        </>
      ) : (
        <>
          <FaGithub color="#EBA417" />
          Sign in with github
        </>
      )}
      {data && <FiX color="#737380" className={styles.closeIcon} />}
    </button>
  );
}
