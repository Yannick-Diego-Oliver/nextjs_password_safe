"use client";
import { cn, genPw } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ClipboardCopy, Info, RefreshCcw } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Checkbox } from "./ui/Checkbox";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Progress } from "./ui/Progress";
import { RadioGroup, RadioGroupItem } from "./ui/RadioGroup";
import { Slider } from "./ui/Slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip";

interface GeneratorProps {}

const Generator: FC<GeneratorProps> = ({}) => {
  const [length, setLength] = useState(8);
  const [radio, setRadio] = useState<"all" | "read" | "say">("all");
  const [checked, setChecked] = useState<{
    upperCase: boolean;
    lowerCase: boolean;
    numbers: boolean;
    symbols: boolean;
  }>({
    upperCase: true,
    lowerCase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState(genPw(8, "all", checked));
  const [animate, setAnimate] = useState(false);

  const handleCheckbox = (
    cs: CheckedState,
    value: keyof typeof checked
  ): void => {
    setChecked((prevState) => {
      if (
        Object.entries({ ...prevState, [value]: cs }).every(
          ([_, v]) => v === false
        )
      )
        return prevState;
      return {
        ...prevState,
        [value]: cs,
      };
    });
    console.log(checked);
  };

  useEffect(() => {
    setPassword(genPw(length, radio, checked));
  }, [checked, length, radio]);

  return (
    <div className="w-full h-full flex flex-col gap-10">
      <div className="w-full flex flex-row rounded-md shadow-lg h-fit p-5 pb-7 relative">
        <p className="text-3xl font-semibold truncate">{password}</p>
        <div className="flex flex-row ml-auto my-auto gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ClipboardCopy
                  className="hover:text-blue-500 transition-colors duration-300 cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(password)}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-white">
                <p>Click to copy</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <RefreshCcw
                  className={cn(
                    "hover:text-blue-500 transition-all duration-300 cursor-pointer",
                    { "animate-rotate": animate }
                  )}
                  onClick={() => {
                    setPassword(genPw(length, radio, checked));
                    setAnimate(true);
                  }}
                  onAnimationEnd={() => setAnimate(false)}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-white">
                <p>Refresh</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Progress
          value={
            length >= 12
              ? 100
              : length >= 9
              ? 75
              : length >= 6
              ? 50
              : length >= 4
              ? 25
              : 0
          }
          className="absolute inset-x-0 bottom-0 bg-slate-300 rounded-none rounded-b-md"
        />
      </div>
      <div className="w-full rounded-md shadow-lg p-10 flex-grow">
        <p className="text-4xl font-extrabold border-b-2 border-gray-100 pb-2">
          Customize your password
        </p>
        <div className="w-full h-full flex flex-row gap-4 justify-between">
          <div className="w-1/2 h-10 flex flex-row gap-4 my-auto relative">
            <Label htmlFor="password" className="text-xl absolute -top-full">
              Password Length
            </Label>
            <Input
              type="number"
              id="password"
              min={1}
              max={50}
              step={1}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-fit my-auto"
            />
            <Slider
              min={1}
              max={50}
              step={1}
              value={[length]}
              onValueChange={(e) => setLength(e[0])}
              className="flex-grow"
            />
          </div>
          <div className="h-fit w-1/3 my-auto">
            <RadioGroup
              defaultValue="all"
              onValueChange={(e: typeof radio) => {
                setRadio(e);
                switch (e) {
                  case "all":
                    setChecked({
                      upperCase: true,
                      lowerCase: true,
                      numbers: true,
                      symbols: true,
                    });
                    break;
                  case "say":
                    if (!checked.lowerCase && !checked.upperCase) {
                      setChecked({
                        lowerCase: true,
                        upperCase: true,
                        numbers: false,
                        symbols: false,
                      });
                    }
                    break;
                }
              }}
            >
              <TooltipProvider delayDuration={10}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    className="text-blue-500"
                    value="say"
                    id="r1"
                  />
                  <Label htmlFor="r1" className="text-xl">
                    Easy to say
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-white w-52">
                      <p>Avoid numbers and special characters</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    className="text-blue-500"
                    value="read"
                    id="r2"
                  />
                  <Label htmlFor="r2" className="text-xl">
                    Easy to read
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-white w-56">
                      <p>Avoid ambiguous characters like l, 1, O, and 0</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    className="text-blue-500"
                    value="all"
                    id="r3"
                  />
                  <Label htmlFor="r3" className="text-xl">
                    All characters
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-white w-56">
                      <p>Any character combinations like !, 7, h, K, and l1</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </RadioGroup>
          </div>
          <div className="h-fit w-1/3 my-auto flex flex-col gap-2">
            <div>
              <Checkbox
                id="uppercase"
                checked={checked.upperCase}
                onCheckedChange={(e) => handleCheckbox(e, "upperCase")}
              />
              <Label htmlFor="uppercase" className="text-xl pl-1">
                Uppercase
              </Label>
            </div>
            <div>
              <Checkbox
                id="lowercase"
                checked={checked.lowerCase}
                onCheckedChange={(e) => handleCheckbox(e, "lowerCase")}
              />
              <Label htmlFor="lowercase" className="text-xl pl-1">
                Lowercase
              </Label>
            </div>
            <div>
              <Checkbox
                id="numbers"
                checked={checked.numbers}
                disabled={radio === "say"}
                onCheckedChange={(e) => handleCheckbox(e, "numbers")}
              />
              <Label htmlFor="numbers" className="text-xl pl-1">
                Numbers
              </Label>
            </div>
            <div>
              <Checkbox
                id="symbols"
                checked={checked.symbols}
                disabled={radio === "say"}
                onCheckedChange={(e) => handleCheckbox(e, "symbols")}
              />
              <Label htmlFor="symbols" className="text-xl pl-1">
                Symbols
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
