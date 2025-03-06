import { Item as PkmItem } from "@pkmn/data";
import React from "react";

interface IItemProps {
  item: PkmItem;
  onData?: (item: PkmItem) => void;
}

const Item: React.FunctionComponent<IItemProps> = ({ item, onData }) => {
  const name = item.name;
  // const itemImg = import.meta.glob(`../assets/images/items/${name.replace(/\s+/g, "_")}_SV.png`);
  const imagePath = `/pokemon-vgc-tools/images/items/${name.replace(/\s+/g, "_")}_SV.png`;
  const selectedItem = () => {
    if (onData) {
      onData(item);
    }
  };

  return (
    <div className="cursor-pointer w-screen sm:w-xl " onClick={selectedItem}>
      <div className={`text-gray-200 flex h-20`}>
        <div className="h-20 w-30 flex">
          <img src={imagePath} className="max-h-20 px-2 m-auto" loading="lazy" />
        </div>
        <div className="text-2xl my-auto">{name}</div>
      </div>
      <hr className="w-screen ms:w-xl border-gray-700" />
    </div>
  );
};

export default Item;
