import "./label-button.css";

interface LabelButtonProps {
    name: string;
    cssProps?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
}

function LabelButton({ name, cssProps, type = "button", disabled = false, onClick }: LabelButtonProps) {
    return (
        <button className={` ${cssProps} label-button`} onClick={onClick} type={type} disabled={disabled}>
            {name}
        </button>
    );
}

export default LabelButton;