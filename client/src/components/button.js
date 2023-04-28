import "./button.css"

const Button = (props) => {
    return (
        <div className="button">
            <button onClick={props.onClick}>
                {props.text}
            </button>
        </div>
    );  
};

export default Button;