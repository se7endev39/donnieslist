import { WifiLoader } from "react-awesome-loaders";
import './WifiLoader.css'

const WifiLoaderComponent = ({ text = "Loading...", style }) => {
  return (
    <div>
      <div className="WifiLoaderOverlay">
      </div>
      <div className="WifiLoader" style={style}>
        <WifiLoader
            background={"transparent"}
            desktopSize={"100px"}
            mobileSize={"100px"}
            text={text}
            backColor="white"
            frontColor="#444"
            textColor="white"
        />
      </div>
    </div>
  );
};

export default WifiLoaderComponent