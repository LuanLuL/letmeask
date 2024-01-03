import { useState, useEffect, FormEvent } from "react";
import { database } from "../services/firebase";
import { ref, push, onValue, remove, update } from "firebase/database";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type FirebaseQuestions = Record<
  string,
  {
    content: string;
    author: {
      name: string;
      avatar: string;
    };
    isHighLighted: boolean;
    isAnswered: boolean;
    likes: Record<string, { authorId: string }>;
  }
>;

type QuestionType = {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighLighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export function useRoom(roomId: string | undefined) {
  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");
  const history = useNavigate();

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (room) => {
      const firebseQuestions: FirebaseQuestions = room.val().questions ?? {};
      const parsedQuestions = Object.entries(firebseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value?.author,
            isHighLighted: value.isHighLighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );
      console.log(parsedQuestions);
      setQuestions(parsedQuestions);
      setTitle(room.val().title);
    });
    return () => {
      unsubscribe();
    };
  }, [roomId, user?.id]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("Você deve estar logado no sistema");
    }

    await push(ref(database, `rooms/${roomId}/questions`), {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighLighted: false,
      isAnswered: false,
    });

    setNewQuestion("");
  }

  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (!user) {
      throw new Error("Você deve estar logado no sistema");
    }
    if (likeId) {
      await remove(
        ref(database, `rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
      );
      return;
    }
    await push(ref(database, `rooms/${roomId}/questions/${questionId}/likes`), {
      authorId: user.id,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja remover esta pergunta?")) {
      await remove(ref(database, `rooms/${roomId}/questions/${questionId}`));
    }
  }

  async function handleDeleteRoom() {
    if (window.confirm("Tem certeza que deseja remover esta sala?")) {
      await update(ref(database, `rooms/${roomId}`), {
        endedAt: new Date(),
      });
    }
    history("/");
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      isHighLighted: true,
    });
  }

  return {
    questions,
    title,
    handleSendQuestion,
    newQuestion,
    setNewQuestion,
    handleLikeQuestion,
    handleDeleteQuestion,
    handleDeleteRoom,
    handleCheckQuestionAsAnswered,
    handleHighlightQuestion,
  };
}
