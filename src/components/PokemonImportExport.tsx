import React, { useState } from "react";
import { Pokemon } from "@smogon/calc";
import { Generations } from "@pkmn/data";

interface IPokemonImportExportProps {
  gens: Generations;
  atkPkm: Pokemon;
  defPkm: Pokemon;
  onImportAttacker: (pokemon: Pokemon) => void;
  onImportDefender: (pokemon: Pokemon) => void;
}

interface PokemonData {
  name: string;
  level: number;
  nature: string;
  ability: string;
  item?: string;
  teraType?: string;
  ivs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  evs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  moves: (string | null)[];
}

const PokemonImportExport: React.FunctionComponent<IPokemonImportExportProps> = ({
  gens,
  atkPkm,
  defPkm,
  onImportAttacker,
  onImportDefender,
}) => {
  const [importText, setImportText] = useState("");
  const [exportType, setExportType] = useState<"attacker" | "defender" | "both">("both");
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const gen = gens.get(9);

  const pokemonToShowdownFormat = (pokemon: Pokemon): string => {
    const lines: string[] = [];
    
    // Name and item
    const nameAndItem = pokemon.item 
      ? `${pokemon.name} @ ${pokemon.item}`
      : pokemon.name;
    lines.push(nameAndItem);
    
    // Level (only if not 50)
    if (pokemon.level !== 50) {
      lines.push(`Level: ${pokemon.level}`);
    }
    
    // Nature
    lines.push(`${pokemon.nature} Nature`);
    
    // Tera Type (if available)
    if (pokemon.teraType) {
      lines.push(`Tera Type: ${pokemon.teraType}`);
    }
    
    // Ability
    if (pokemon.ability) {
      lines.push(`Ability: ${pokemon.ability}`);
    }
    
    // EVs (only show non-zero values)
    const evEntries = Object.entries(pokemon.evs)
      .filter(([_, value]) => value > 0)
      .map(([stat, value]) => {
        const statNames: { [key: string]: string } = {
          hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe"
        };
        return `${value} ${statNames[stat]}`;
      });
    
    if (evEntries.length > 0) {
      lines.push(`EVs: ${evEntries.join(" / ")}`);
    }
    
    // IVs (only show non-31 values)
    const ivEntries = Object.entries(pokemon.ivs)
      .filter(([_, value]) => value !== 31)
      .map(([stat, value]) => {
        const statNames: { [key: string]: string } = {
          hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe"
        };
        return `${value} ${statNames[stat]}`;
      });
    
    if (ivEntries.length > 0) {
      lines.push(`IVs: ${ivEntries.join(" / ")}`);
    }
    
    // Moves
    pokemon.moves.forEach(move => {
      if (move) {
        lines.push(`- ${move}`);
      }
    });
    
    return lines.join('\n');
  };

  const parseShowdownFormat = (text: string): PokemonData | null => {
    try {
      const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line);
      if (lines.length === 0) return null;
      
      const pokemon: PokemonData = {
        name: "",
        level: 50,
        nature: "Hardy",
        ability: "",
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        moves: [null, null, null, null],
      };
      
      let moveIndex = 0;
      
      for (const line of lines) {
        // Name and item
        if (!pokemon.name && !line.includes(':') && !line.startsWith('-')) {
          const match = line.match(/^(.+?)(?:\s*@\s*(.+))?$/);
          if (match) {
            pokemon.name = match[1].trim();
            if (match[2]) {
              pokemon.item = match[2].trim();
            }
          }
        }
        // Level
        else if (line.startsWith('Level:')) {
          const level = parseInt(line.split(':')[1].trim());
          if (!isNaN(level)) pokemon.level = level;
        }
        // Nature
        else if (line.includes('Nature')) {
          const nature = line.replace('Nature', '').trim();
          pokemon.nature = nature;
        }
        // Tera Type
        else if (line.startsWith('Tera Type:')) {
          pokemon.teraType = line.split(':')[1].trim();
        }
        // Ability
        else if (line.startsWith('Ability:')) {
          pokemon.ability = line.split(':')[1].trim();
        }
        // EVs
        else if (line.startsWith('EVs:')) {
          const evString = line.split(':')[1].trim();
          const evPairs = evString.split('/').map(s => s.trim());
          
          for (const pair of evPairs) {
            const match = pair.match(/(\d+)\s+(HP|Atk|Def|SpA|SpD|Spe)/);
            if (match) {
              const value = parseInt(match[1]);
              const statMap: { [key: string]: keyof typeof pokemon.evs } = {
                'HP': 'hp', 'Atk': 'atk', 'Def': 'def', 
                'SpA': 'spa', 'SpD': 'spd', 'Spe': 'spe'
              };
              const stat = statMap[match[2]];
              if (stat) pokemon.evs[stat] = value;
            }
          }
        }
        // IVs
        else if (line.startsWith('IVs:')) {
          const ivString = line.split(':')[1].trim();
          const ivPairs = ivString.split('/').map(s => s.trim());
          
          for (const pair of ivPairs) {
            const match = pair.match(/(\d+)\s+(HP|Atk|Def|SpA|SpD|Spe)/);
            if (match) {
              const value = parseInt(match[1]);
              const statMap: { [key: string]: keyof typeof pokemon.ivs } = {
                'HP': 'hp', 'Atk': 'atk', 'Def': 'def', 
                'SpA': 'spa', 'SpD': 'spd', 'Spe': 'spe'
              };
              const stat = statMap[match[2]];
              if (stat) pokemon.ivs[stat] = value;
            }
          }
        }
        // Moves
        else if (line.startsWith('-')) {
          const move = line.substring(1).trim();
          if (moveIndex < 4) {
            pokemon.moves[moveIndex] = move;
            moveIndex++;
          }
        }
      }
      
      return pokemon;
    } catch (error) {
      return null;
    }
  };

  const showdownDataToPokemon = (data: PokemonData): Pokemon => {
    const pokemon = new Pokemon(gen, data.name, {
      level: data.level,
      nature: data.nature,
      ability: data.ability,
      item: data.item,
      ivs: data.ivs,
      evs: data.evs,
    });
    
    // Set moves
    data.moves.forEach((move, index) => {
      if (move && index < 4) {
        pokemon.moves[index] = move;
      }
    });

    return pokemon;
  };

  const handleExport = () => {
    let exportText = "";
    
    if (exportType === "attacker" || exportType === "both") {
      exportText += pokemonToShowdownFormat(atkPkm);
      if (exportType === "both") {
        exportText += "\n\n";
      }
    }
    
    if (exportType === "defender" || exportType === "both") {
      exportText += pokemonToShowdownFormat(defPkm);
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(exportText).then(() => {
      alert("Pokemon data copied to clipboard!");
    }).catch(() => {
      // Fallback: show in a text area for manual copying
      const textarea = document.createElement("textarea");
      textarea.value = exportText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Pokemon data copied to clipboard!");
    });
  };

  const handleImport = () => {
    try {
      const text = importText.trim();
      if (!text) {
        alert("Please paste Pokemon data to import.");
        return;
      }

      // Split by double newlines to handle multiple Pokemon
      const pokemonTexts = text.split(/\n\s*\n/).filter(t => t.trim());
      
      if (pokemonTexts.length === 1) {
        // Single Pokemon - ask which slot to import to
        const pokemonData = parseShowdownFormat(pokemonTexts[0]);
        if (pokemonData) {
          const choice = confirm("Import as Attacker? (Cancel for Defender)");
          const pokemon = showdownDataToPokemon(pokemonData);
          if (choice) {
            onImportAttacker(pokemon);
          } else {
            onImportDefender(pokemon);
          }
        } else {
          alert("Invalid Pokemon format. Please check your import data.");
          return;
        }
      } else if (pokemonTexts.length === 2) {
        // Two Pokemon - import as attacker and defender
        const attackerData = parseShowdownFormat(pokemonTexts[0]);
        const defenderData = parseShowdownFormat(pokemonTexts[1]);
        
        if (attackerData && defenderData) {
          onImportAttacker(showdownDataToPokemon(attackerData));
          onImportDefender(showdownDataToPokemon(defenderData));
        } else {
          alert("Invalid Pokemon format. Please check your import data.");
          return;
        }
      } else {
        alert("Please import 1 or 2 Pokemon at a time.");
        return;
      }
      
      setImportText("");
      setShowImport(false);
      alert("Pokemon imported successfully!");
    } catch (error) {
      alert("Error parsing Pokemon data. Please check the format.");
    }
  };

  const generateExportPreview = () => {
    let exportText = "";
    
    if (exportType === "attacker" || exportType === "both") {
      exportText += pokemonToShowdownFormat(atkPkm);
      if (exportType === "both") {
        exportText += "\n\n";
      }
    }
    
    if (exportType === "defender" || exportType === "both") {
      exportText += pokemonToShowdownFormat(defPkm);
    }

    return exportText;
  };

  return (
    <div className="mb-6 p-4 bg-gradient-to-br from-[#1a1d2e] to-[#24283B] rounded-xl border border-[#4e60b1] shadow-lg">
      <h3 className="text-gray-100 font-bold mb-4 text-center text-lg bg-gradient-to-r from-[#4e60b1] to-[#5a6bc4] bg-clip-text text-transparent">
        Import / Export Pokemon
      </h3>
      
      <div className="flex gap-4 justify-center mb-4">
        <button
          onClick={() => setShowExport(!showExport)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Export Pokemon
        </button>
        
        <button
          onClick={() => setShowImport(!showImport)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Import Pokemon
        </button>
      </div>

      {/* Export Section */}
      {showExport && (
        <div className="mb-4 p-4 bg-[#2a2f47] rounded-lg border border-[#3d4785]">
          <h4 className="text-green-300 font-semibold mb-3">Export Pokemon Data</h4>
          
          <div className="mb-3">
            <label className="block text-gray-300 font-medium mb-2">Export:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setExportType("attacker")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  exportType === "attacker"
                    ? "bg-[#4e60b1] text-white"
                    : "bg-[#333c67] text-gray-300 hover:bg-[#3d4785]"
                }`}
              >
                Attacker Only
              </button>
              <button
                onClick={() => setExportType("defender")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  exportType === "defender"
                    ? "bg-[#4e60b1] text-white"
                    : "bg-[#333c67] text-gray-300 hover:bg-[#3d4785]"
                }`}
              >
                Defender Only
              </button>
              <button
                onClick={() => setExportType("both")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  exportType === "both"
                    ? "bg-[#4e60b1] text-white"
                    : "bg-[#333c67] text-gray-300 hover:bg-[#3d4785]"
                }`}
              >
                Both
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-300 font-medium mb-2">Preview:</label>
            <textarea
              value={generateExportPreview()}
              readOnly
              className="w-full h-32 px-3 py-2 bg-[#333c67] border border-gray-600 rounded-lg text-gray-200 text-sm font-mono resize-none"
            />
          </div>

          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Copy to Clipboard
          </button>
        </div>
      )}

      {/* Import Section */}
      {showImport && (
        <div className="p-4 bg-[#2a2f47] rounded-lg border border-[#3d4785]">
          <h4 className="text-blue-300 font-semibold mb-3">Import Pokemon Data</h4>
          
          <div className="mb-3">
            <label className="block text-gray-300 font-medium mb-2">Paste JSON Data:</label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Paste Pokemon Showdown format here...\n\nExample:\nCharizard @ Choice Specs\nLevel: 50\nModest Nature\nAbility: Solar Power\nEVs: 4 HP / 252 SpA / 252 Spe\n- Flamethrower\n- Solar Beam\n- Focus Blast\n- Hidden Power Ice`}
              className="w-full h-40 px-3 py-2 bg-[#333c67] border border-gray-600 rounded-lg text-gray-200 text-sm font-mono resize-none focus:border-[#4e60b1] focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Import Pokemon
            </button>
            <button
              onClick={() => {
                setImportText("");
                setShowImport(false);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonImportExport;