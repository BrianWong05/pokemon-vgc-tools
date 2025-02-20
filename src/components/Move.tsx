import { icons } from "../assets/icons";
import physical from "../assets/images/Physical_SV_icon.png"
import special from "../assets/images/Special_SV_icon.png"
import status from "../assets/images/Status_SV_icon.png"

const categoryIcons = {
  physical: physical,
  special: special,
  status: status,
};

const targetMap = {
  any: "Any",
  normal: "Any",
  allAdjacentFoes: "All foes",
  allAdjacent: "All",
  self: "Self",
  adjacentAllyOrSelf: "Ally or self",
  adjacentAlly: "Ally",
  allySide: "All allies",
  foeSide: "All foes"
};

function Move({move, onData, id}) {

  const props = ["contact", "heal", "power", "bite", "bullet", "slicing", "wind", "dance", "pulse", "sound", "punch"];
  const flags = Object.keys(move.flags);
  const moveProp = flags.filter((item) =>
    props.some((prop) => item.toLowerCase().includes(prop))
  );
  
  const type = move.type.toLocaleLowerCase();
  const category = move.category.toLocaleLowerCase();
  const basePower = (move.basePower ? move.basePower : '-');
  const accuracy = (move.accuracy===true ? '-' : move.accuracy);
  const priority = (move.priority ? (move.priority > 0 ? `+${move.priority}` : move.priority) : '-');
  const icon = icons[type];
  const categoryIcon = categoryIcons[category];
  const target = targetMap[move.target];
  // console.log(move);

  const selectedMove = () => {
    if (onData) {
      onData(move, id);
    }
  }

  return (
    <>
    <div onClick={selectedMove}>
      <div className={`text-gray-200 flex w-xl`}>
        <div className="block pl-5 py-5 justify-between w-full">
          <div className="flex justify-between">
            <img src={categoryIcon} className="h-9" />
            <div className="text-2xl my-auto">{move.name}</div>
            <img src={icon} className="h-9" /> 
          </div>
          <div className="flex justify-space my-2">
            <div className="text-sm text-gray-400 m-1 px-2 py-auto rounded-xl border-2 border-gray-400">Target: {target}</div>
            {moveProp.map((prop) => {
              return <div key={prop} className="text-sm text-gray-400 m-1 px-2 py-auto rounded-xl border-2 border-gray-400">{prop} </div>
            })}
          </div>
          <div className="text-sm text-justify ml-2">{move.desc}</div>
        </div>
        <div className="h-50 w-30 content-center">
          <div className="text-center">
            <div className="text-xl">
              {basePower}
            </div>
            <div className="text-xs">
              Power
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl">
              {accuracy}
            </div>
            <div className="text-xs">
              Accurcay
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl">
              {priority}
            </div>
            <div className="text-xs">
              Priority
            </div>
          </div>
        </div>
      </div>
      <hr className="w-xl border-gray-700" />
      </div>
    </>
  )

};

export default Move