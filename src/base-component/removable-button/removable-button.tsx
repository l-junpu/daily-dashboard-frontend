import "./removable-button.css";

interface RemovableButtonProps {
  idx: number;
  name: string;
  removeItem: (name: string) => void;
}

const RemovableButton = ({ idx, name, removeItem }: RemovableButtonProps) => {
  return (
    <div key={idx} className="removable-button">
      <p className="button-name">{name}</p>
      <button className="remove-button" onClick={() => removeItem(name)}>
        X
      </button>
    </div>
  );
};

export default RemovableButton;
