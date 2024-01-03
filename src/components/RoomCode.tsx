import copyImg from "../assets/img/copy.svg";

import "../styles/roomCode.scss";

type RoomCodeProps = {
  code: string | undefined;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    if (!props.code) {
      return;
    }
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button className="roomCode" onClick={copyRoomCodeToClipboard}>
      <div>
        <img
          src={copyImg}
          alt="Copiar código da sala"
          title="Copiar código da sala"
        />
      </div>
      <span> Sala #{props.code || "Error"}</span>
    </button>
  );
}
