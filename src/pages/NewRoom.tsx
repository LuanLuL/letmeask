import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { ref, push } from "firebase/database";
import { useNavigate } from "react-router-dom";

import illustrationImg from "../assets/img/illustration.svg";
import logoImg from "../assets/img/logo.svg";

import "../styles/home.scss";
import { Button } from "../components/Button";

export function NewRoom() {
  const [newRoom, setNewRoom] = useState("");
  const { user } = useAuth();
  const history = useNavigate();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const firebaseRoom = await push(ref(database, "rooms"), {
      title: newRoom,
      authorId: user?.id,
    });

    history(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <section id="page-home">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
          title="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="LetmeAsk" title="LetmeAsk" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(e) => setNewRoom(e.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente?{" "}
            <a href="https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md">
              Clique aqui!
            </a>
          </p>
        </div>
      </main>
    </section>
  );
}
