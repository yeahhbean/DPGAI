import React from "react";

interface CommandExtractorProps {
  text: string;
  setCommands: (extractedCommands: string[]) => void;
}

const CommandExtractor: React.FC<CommandExtractorProps> = ({ text, setCommands }) => {
  const extractCommands = (text: string): string[] => {
    const commandPattern = /\[end\](.*?)\[\/end\]/g;
    const commands: string[] = [];
    let match;

    while ((match = commandPattern.exec(text)) !== null) {
      const extractedCommands = match[1]
        .split("]")
        .map(cmd => cmd.replace("[", "").trim())
        .filter(cmd => cmd.length > 0);
      commands.push(...extractedCommands);
    }
    return commands;
  };

  React.useEffect(() => {
    const commands = extractCommands(text);
    setCommands(commands);
  }, [text, setCommands]);

  return null;
};

export default CommandExtractor;
