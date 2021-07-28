import React from "react";

import HeaderTemplate from "./template/header";
import FooterTemplate from "./template/footer";

const App = (props) => {
  return (
    <div>
      <HeaderTemplate logo="Donnie's List" />
      {props.children}
      <FooterTemplate />
    </div>
  );
};

export default App;