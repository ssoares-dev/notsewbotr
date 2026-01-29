import "./action_button.css";

const ActionButton = ({
  title,
  icon,
  onClick,
  buttonColor, 
  titleColor,     
}) => {
  return (
    <div
      className="action-button-container"
      onClick={onClick}
      style={{ backgroundColor: buttonColor }}
    >
      <img className="action-button-icon" src={icon} alt="" />
      <div className="action-button-title" style={{ color: titleColor }}>
        {title}
      </div>
    </div>
  );
};

export default ActionButton;