import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { ref, get, child } from "firebase/database";

import illustrationImg from "../assets/img/illustration.svg";
import logoImg from "../assets/img/logo.svg";
import googleIconImg from "../assets/img/google-icon.svg";

import "../styles/home.scss";
import { Button } from "../components/Button";

export function Home() {
  const history = useNavigate();
  const { user, singInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await singInWithGoogle();
    }
    history("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await get(child(ref(database), `rooms/${roomCode}`));

    if (!roomRef.exists()) {
      alert("Esta sala não existe.");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Esta sala já foi fechada.");
      return;
    }

    if (roomRef.val().authorId.trim() === user?.id.trim()) {
      history(`admin/rooms/${roomCode}`);
      return;
    }

    history(`rooms/${roomCode}`);
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
          <button onClick={handleCreateRoom} className="create-room">
            <img
              src={googleIconImg}
              alt="Logo do Google"
              title="Logo do Google"
            />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
              }}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </section>
  );
}
