import { icons } from "@/assets/icons";
import React from "react";

interface ITypeTagProps {
  type: string;
}

const TypeTag: React.FunctionComponent<ITypeTagProps> = ({ type }) => {
  return (
    <div className={`flex h-5 sm:h-6 w-18 sm:w-22 bg-${type} rounded-2xl text-white`}>
      <div className={`flex mx-auto text-sm sm:text-md`}>
        <img src={icons[type as keyof typeof icons]} className="h-4 sm:h-5 my-auto" />
        <div className="my-auto">{type}</div>
      </div>
    </div>
  );
};

export default TypeTag;
