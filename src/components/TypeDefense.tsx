import TypeTag from "@/components/TypeTag";
import React from "react";

interface ITypeDefenseProps {
  typeDefense: object;
  times: number;
}

const TypeDefense: React.FunctionComponent<ITypeDefenseProps> = ({ typeDefense, times }) => {
  return (
    <div className="flex sm:justify-center">
      {Object.values(typeDefense).includes(times) && (
        <div className="flex flex-col px-5 py-1">
          <div className="py-1">{times}x damage</div>
          <div className="flex gap-3 w-full sm:w-110 flex-wrap">
            {Object.keys(typeDefense)
              .filter((key) => typeDefense[key as keyof typeof typeDefense] === times)
              .map((type) => {
                return <TypeTag type={type} />;
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeDefense;
