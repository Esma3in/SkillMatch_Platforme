import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export const ContentByAnima = () => {
  // Data for problem titles
  const problems = [
    "Concatenation of Arrays",
    "Cards Partition",
    "Iris and Game on the Tree",
    "Permutation Counting",
    "Candy Party (Hard Version)",
    "Range Sorting (Hard Version)",
    "LuoTianyi and the Floating Islands (Hard Version)",
    "C+K+S",
    "Tree Pruning",
    "Eri and Expanded Sets",
  ];

  // Data for programming languages with their colors
  const skills = [
    {
      name: "JavaScript",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    { name: "Ruby", bgColor: "bg-[#d0ffc2]", textColor: "text-[#367622]" },
    { name: "C#", bgColor: "bg-[#d0ffe7]", textColor: "text-[#298c5b]" },
    { name: "Java", bgColor: "bg-[#d7baf5]", textColor: "text-[#5d3b7f]" },
    { name: "Python", bgColor: "bg-[#ffcdd8]", textColor: "text-[#7f3a4a]" },
    { name: "C++", bgColor: "bg-[#bde3ff]", textColor: "text-[#375870]" },
    { name: "PHP", bgColor: "bg-[#d8d1fa]", textColor: "text-[#3a2689]" },
    { name: "Rust", bgColor: "bg-[#cde3ff]", textColor: "text-[#2e3d7a]" },
    { name: "C", bgColor: "bg-[#cdffff]", textColor: "text-[#1b7980]" },
    { name: "Swift", bgColor: "bg-[#ffe6cd]", textColor: "text-[#7e6728]" },
  ];

  // Data for difficulty levels with their colors
  const levels = [
    [
      {
        name: "Intermediate",
        bgColor: "bg-[#fffac7]",
        textColor: "text-[#988d3f]",
      },
    ],
    [
      {
        name: "Intermediate",
        bgColor: "bg-[#fffac7]",
        textColor: "text-[#988d3f]",
      },
      {
        name: "Advanced",
        bgColor: "bg-[#ffbaba]",
        textColor: "text-[#9f4242]",
      },
    ],
    [
      {
        name: "Advanced",
        bgColor: "bg-[#ffbaba]",
        textColor: "text-[#9f4242]",
      },
    ],
    [
      {
        name: "Beginner",
        bgColor: "bg-[#baffdc]",
        textColor: "text-[#4c9f44]",
      },
      {
        name: "Intermediate",
        bgColor: "bg-[#fffac7]",
        textColor: "text-[#988d3f]",
      },
    ],
    [
      {
        name: "Beginner",
        bgColor: "bg-[#baffdc]",
        textColor: "text-[#4c9f44]",
      },
    ],
    [
      {
        name: "Advanced",
        bgColor: "bg-[#ffbaba]",
        textColor: "text-[#9f4242]",
      },
    ],
    [
      {
        name: "Beginner",
        bgColor: "bg-[#baffdc]",
        textColor: "text-[#4c9f44]",
      },
      {
        name: "Intermediate",
        bgColor: "bg-[#fffac7]",
        textColor: "text-[#988d3f]",
      },
    ],
    [
      {
        name: "Beginner",
        bgColor: "bg-[#baffdc]",
        textColor: "text-[#4c9f44]",
      },
    ],
    [
      {
        name: "Intermediate",
        bgColor: "bg-[#fffac7]",
        textColor: "text-[#988d3f]",
      },
      {
        name: "Advanced",
        bgColor: "bg-[#ffbaba]",
        textColor: "text-[#9f4242]",
      },
    ],
    [
      {
        name: "Advanced",
        bgColor: "bg-[#ffbaba]",
        textColor: "text-[#9f4242]",
      },
    ],
  ];

  // Data for user counts
  const userCounts = [
    "11504",
    "9992",
    "6677",
    "12503",
    "2422",
    "1894",
    "2693",
    "890",
    "6052",
    "1619",
  ];

  return (
    <div className="w-full bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="h-11 px-6 py-3 text-xs font-text-xs-medium text-gray-500">
              Title
            </TableHead>
            <TableHead className="h-11 px-6 py-3 text-xs font-text-xs-medium text-[#788194]">
              description
            </TableHead>
            <TableHead className="h-11 px-6 py-3 text-xs font-text-xs-medium text-gray-500">
              skill
            </TableHead>
            <TableHead className="h-11 px-6 py-3 text-xs font-text-xs-medium text-gray-500">
              level
            </TableHead>
            <TableHead className="h-11 px-6 py-3 text-xs font-text-xs-medium text-[#667085] text-center">
              number users resolved
            </TableHead>
            <TableHead className="h-11 px-6 py-3 text-xs font-text-xs-medium text-[#667085] text-center">
              action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem, index) => (
            <TableRow key={index} className="border-b border-[#eaecf0]">
              <TableCell className="h-[72px] px-6 py-4 font-text-sm-medium text-gray-900">
                {problem}
              </TableCell>
              <TableCell className="h-[72px] px-6 py-4">
                <div className="relative w-[186px] h-8">
                  <div className="text-xs font-text-xs-medium text-[#82899b] text-center">
                    A problem the must solved by using js to solve , the
                  </div>
                  <div className="flex w-[22px] h-4 items-center justify-center absolute top-4 right-0">
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-700 rounded-2xl px-2 py-0.5"
                    >
                      ...
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell className="h-[72px] px-6 py-4">
                <Badge
                  className={`${skills[index].bgColor} ${skills[index].textColor} rounded-2xl px-2 py-0.5 font-text-xs-medium`}
                >
                  {skills[index].name}
                </Badge>
              </TableCell>
              <TableCell className="h-[72px] px-6 py-4">
                <div className="flex gap-2">
                  {levels[index].map((level, levelIndex) => (
                    <Badge
                      key={levelIndex}
                      className={`${level.bgColor} ${level.textColor} rounded-2xl px-2 py-0.5 font-text-xs-medium`}
                    >
                      {level.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="h-[72px] px-6 py-4 text-center">
                <Badge className="bg-gray-100 text-gray-700 rounded-2xl px-2 py-0.5 font-text-xs-medium">
                  {userCounts[index]}
                </Badge>
              </TableCell>
              <TableCell className="h-[72px] px-6 py-4 text-center">
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-[10px] h-8 w-[93px] font-bold">
                  resolve
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
