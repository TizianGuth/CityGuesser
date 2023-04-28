import "./loading.css"
import Symbol from "./../LoadingImg.svg"
import Popup from 'reactjs-popup';

const Loading = (props) => {

    return (
        <div
          style={{
            //visibility: show ? "visible" : "hidden",
            //opacity: show ? "1" : "0"
          }}
            className="overlay"

        >
        <img src={Symbol} id="symbol" alt="loading" />

        </div>
    );
};


export default Loading;