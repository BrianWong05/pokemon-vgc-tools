import { icons } from "@/assets/icons";

function TypeTag({ type }) {
  return (
    <div className={`flex h-6 w-22 bg-${type} rounded-2xl `}>
      <div className={`flex mx-auto`}>
        <img src={icons[type]} className="h-5 my-auto" />
        <div className="my-auto">{type}</div>
      </div>
    </div>
  );
}

export default TypeTag;
