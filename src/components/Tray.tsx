import React from "react";
import { Item } from "../classes/item";

const Tray: React.FC = ({children}) => {
    return (
        <div className="tray">{children}</div>
    )
}

export default Tray