import { ReactNode } from "react";
import "../styles/question.scss";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighLighted: boolean;
  isAnswered: boolean;
  children?: ReactNode;
};

export function Question({
  content,
  author,
  children,
  isHighLighted = false,
  isAnswered = false,
}: QuestionProps) {
  return (
    <div
      className={`question ${isHighLighted && !isAnswered ? "highLighted" : ""} 
      ${isAnswered ? "answered" : ""} `}
    >
      <p>{content}</p>
      <footer>
        <div className="userInfo">
          <img src={author.avatar} alt={author.name} title={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
