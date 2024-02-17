import React from "react";
import {
  Listbox,
  ListboxItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Input,
  Button,
} from "@nextui-org/react";
import { ListboxWrapper } from "./ListboxWrapper";

interface Props {
  name: string;
  age: number;
}

export const languageOptions = [
  {
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
    label: "JavaScript (Node.js 12.14.0)",
    value: "javascript",
    boilerplateCode: 'console.log("Hello, world!");',
  },
  {
    id: 45,
    name: "Assembly (NASM 2.14.02)",
    label: "Assembly (NASM 2.14.02)",
    value: "assembly",
    boilerplateCode:
      "section .data\n    hello db 'Hello, world!', 0\n\nsection .text\n    global _start\n\n_start:\n    ; write Hello, world! to stdout\n    mov eax, 4\n    mov ebx, 1\n    mov ecx, hello\n    mov edx, 13\n    int 0x80\n\n    ; exit\n    mov eax, 1\n    xor ebx, ebx\n    int 0x80\n",
  },
  {
    id: 46,
    name: "Bash (5.0.0)",
    label: "Bash (5.0.0)",
    value: "bash",
    boilerplateCode: "",
  },
  {
    id: 47,
    name: "Basic (FBC 1.07.1)",
    label: "Basic (FBC 1.07.1)",
    value: "basic",
    boilerplateCode: "",
  },
  {
    id: 75,
    name: "C (Clang 7.0.1)",
    label: "C (Clang 7.0.1)",
    value: "c",
    boilerplateCode:
      '#include <stdio.h>\n\nint main() {\n  printf("Hello, world!");\n  return 0;\n}',
  },
  {
    id: 76,
    name: "C++ (Clang 7.0.1)",
    label: "C++ (Clang 7.0.1)",
    value: "cpp",
    boilerplateCode:
      '#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!" << std::endl;\n  return 0;\n}',
  },
  {
    id: 48,
    name: "C (GCC 7.4.0)",
    label: "C (GCC 7.4.0)",
    value: "c",
    boilerplateCode:
      '#include <stdio.h>\n\nint main() {\n  printf("Hello, world!");\n  return 0;\n}',
  },
  {
    id: 52,
    name: "C++ (GCC 7.4.0)",
    label: "C++ (GCC 7.4.0)",
    value: "cpp",
    boilerplateCode:
      '#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!" << std::endl;\n  return 0;\n}',
  },
  {
    id: 49,
    name: "C (GCC 8.3.0)",
    label: "C (GCC 8.3.0)",
    value: "c",
    boilerplateCode:
      '#include <stdio.h>\n\nint main() {\n  printf("Hello, world!");\n  return 0;\n}',
  },
  {
    id: 53,
    name: "C++ (GCC 8.3.0)",
    label: "C++ (GCC 8.3.0)",
    value: "cpp",
    boilerplateCode:
      '#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!" << std::endl;\n  return 0;\n}',
  },
  {
    id: 50,
    name: "C (GCC 9.2.0)",
    label: "C (GCC 9.2.0)",
    value: "c",
    boilerplateCode:
      '#include <stdio.h>\n\nint main() {\n  printf("Hello, world!");\n  return 0;\n}',
  },
  {
    id: 54,
    name: "C++ (GCC 9.2.0)",
    label: "C++ (GCC 9.2.0)",
    value: "cpp",
    boilerplateCode:
      '#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!" << std::endl;\n  return 0;\n}',
  },
  {
    id: 86,
    name: "Clojure (1.10.1)",
    label: "Clojure (1.10.1)",
    value: "clojure",
    boilerplateCode: '(println "Hello, world!")',
  },
  {
    id: 51,
    name: "C# (Mono 6.6.0.161)",
    label: "C# (Mono 6.6.0.161)",
    value: "csharp",
    boilerplateCode:
      'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello, world!");\n    }\n}',
  },
  {
    id: 77,
    name: "COBOL (GnuCOBOL 2.2)",
    label: "COBOL (GnuCOBOL 2.2)",
    value: "cobol",
    boilerplateCode:
      'IDENTIFICATION DIVISION.\nPROGRAM-ID. HelloWorld.\n\nPROCEDURE DIVISION.\n  DISPLAY "Hello, world!".\n  STOP RUN.',
  },
  {
    id: 55,
    name: "Common Lisp (SBCL 2.0.0)",
    label: "Common Lisp (SBCL 2.0.0)",
    value: "lisp",
    boilerplateCode:
      '(defun hello-world ()\n(format t "Hello, world!~%"))\n\n(hello-world)',
  },
  {
    id: 57,
    name: "D (DMD 2.089.1)",
    label: "D (DMD 2.089.1)",
    value: "d",
    boilerplateCode: "",
  },
  {
    id: 58,
    name: "Elixir (1.9.4)",
    label: "Elixir (1.9.4)",
    value: "elixir",
    boilerplateCode:
      'defmodule HelloWorld do\n  def hello do\n    IO.puts "Hello, world!"\n  end\nend\n\nHelloWorld.hello()',
  },
  {
    id: 59,
    name: "Erlang (OTP 22.2)",
    label: "Erlang (OTP 22.2)",
    value: "erlang",
    boilerplateCode: "",
  },
  {
    id: 44,
    label: "Executable",
    name: "Executable",
    value: "exe",
    boilerplateCode: "",
  },
  {
    id: 87,
    name: "F# (.NET Core SDK 3.1.202)",
    label: "F# (.NET Core SDK 3.1.202)",
    value: "fsharp",
    boilerplateCode:
      'open System\n\nlet helloWorld () =\n    printfn "Hello, world!"\n  \nhelloWorld()',
  },
  {
    id: 59,
    name: "Fortran (GFortran 9.2.0)",
    label: "Fortran (GFortran 9.2.0)",
    value: "fortran",
    boilerplateCode: "",
  },
  {
    id: 60,
    name: "Go (1.13.5)",
    label: "Go (1.13.5)",
    value: "go",
    boilerplateCode:
      'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, world!")\n}',
  },
  {
    id: 88,
    name: "Groovy (3.0.3)",
    label: "Groovy (3.0.3)",
    value: "groovy",
    boilerplateCode: "",
  },
  {
    id: 61,
    name: "Haskell (GHC 8.8.1)",
    label: "Haskell (GHC 8.8.1)",
    value: "haskell",
    boilerplateCode: "",
  },
  {
    id: 62,
    name: "Java (OpenJDK 13.0.1)",
    label: "Java (OpenJDK 13.0.1)",
    value: "java",
    boilerplateCode:
      'public class HelloWorld {\n  public static void main(String[] args) {\n      System.out.println("Hello, world!");\n  }\n}',
  },
  {
    id: 78,
    name: "Kotlin (1.3.70)",
    label: "Kotlin (1.3.70)",
    value: "kotlin",
    boilerplateCode: 'fun main() {\n  println("Hello, world!")\n}',
  },
  {
    id: 64,
    name: "Lua (5.3.5)",
    label: "Lua (5.3.5)",
    value: "lua",
    boilerplateCode: "",
  },
  {
    id: 79,
    name: "Objective-C (Clang 7.0.1)",
    label: "Objective-C (Clang 7.0.1)",
    value: "objectivec",
    boilerplateCode:
      '#import <Foundation/Foundation.h>\n\nint main(int argc, const char * argv[]) {\n    @autoreleasepool {\n        NSLog(@"Hello, world!");\n    }\n    return 0;\n}',
  },
  {
    id: 65,
    name: "OCaml (4.09.0)",
    label: "OCaml (4.09.0)",
    value: "ocaml",
    boilerplateCode: "",
  },
  {
    id: 66,
    name: "Octave (5.1.0)",
    label: "Octave (5.1.0)",
    value: "octave",
    boilerplateCode: "",
  },
  {
    id: 67,
    name: "Pascal (FPC 3.0.4)",
    label: "Pascal (FPC 3.0.4)",
    value: "pascal",
    boilerplateCode: "",
  },
  {
    id: 85,
    name: "Perl (5.28.1)",
    label: "Perl (5.28.1)",
    value: "perl",
    boilerplateCode:
      '#!/usr/bin/perl\n\nuse strict;\nuse warnings;\n\nprint "Hello, world!\\n";',
  },
  {
    id: 68,
    name: "PHP (7.4.1)",
    label: "PHP (7.4.1)",
    value: "php",
    boilerplateCode: '<?php\n\necho "Hello, world!\\n";',
  },
  {
    id: 43,
    label: "Plain Text",
    name: "Plain Text",
    value: "text",
    boilerplateCode: "Hello",
  },
  {
    id: 69,
    name: "Prolog (GNU Prolog 1.4.5)",
    label: "Prolog (GNU Prolog 1.4.5)",
    value: "prolog",
    boilerplateCode: "Hello, world!",
  },
  {
    id: 70,
    name: "Python (2.7.17)",
    label: "Python (2.7.17)",
    value: "python",
    boilerplateCode: 'print "(Hello, world!)"',
  },
  {
    id: 71,
    name: "Python (3.8.1)",
    label: "Python (3.8.1)",
    value: "python",
    boilerplateCode: 'print("Hello, world!")',
  },
  {
    id: 80,
    name: "R (4.0.0)",
    label: "R (4.0.0)",
    value: "r",
    boilerplateCode: 'print("Hello, world!")',
  },
  {
    id: 72,
    name: "Ruby (2.7.0)",
    label: "Ruby (2.7.0)",
    value: "ruby",
    boilerplateCode: 'puts "Hello, world!"',
  },
  {
    id: 73,
    name: "Rust (1.40.0)",
    label: "Rust (1.40.0)",
    value: "rust",
    boilerplateCode: 'println!("Hello, world!");',
  },
  {
    id: 81,
    name: "Scala (2.13.2)",
    label: "Scala (2.13.2)",
    value: "scala",
    boilerplateCode: 'println("Hello, world!")',
  },
  {
    id: 82,
    name: "SQL (SQLite 3.27.2)",
    label: "SQL (SQLite 3.27.2)",
    value: "sql",
    boilerplateCode: "SELECT * FROM table;",
  },
  {
    id: 83,
    name: "Swift (5.2.3)",
    label: "Swift (5.2.3)",
    value: "swift",
    boilerplateCode: 'print("Hello, world!")',
  },
  {
    id: 74,
    name: "TypeScript (3.7.4)",
    label: "TypeScript (3.7.4)",
    value: "typescript",
    boilerplateCode: 'console.log("Hello, world!");',
  },
  {
    id: 84,
    name: "Visual Basic.Net (vbnc 0.0.0.5943)",
    label: "Visual Basic.Net (vbnc 0.0.0.5943)",
    value: "vbnet",
    boilerplateCode: 'Console.WriteLine("Hello, world!");',
  },
];
function generate(id: number, name: string, des: string): JSX.Element {
  return (
    <ListboxItem key={id}>
      <Card fullWidth={true} className="w-full">
        <CardHeader className="flex gap-3">
          {/* <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          /> */}
          <div className="flex flex-col">
            <p className="text-md">language</p>
            <p className="text-small text-default-500">{name}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className="h-12 text-wrap overflow-auto scrollbar-hide">{des}</p>
        </CardBody>
        <Divider />
        <CardFooter>
          {/* <Link
            isExternal
            showAnchorIcon
            href="https://github.com/nextui-org/nextui"
          >
            Website
          </Link> */}
          <div className="flex gap-3">
            <Button size="sm">enable</Button>
            <Button size="sm">disable</Button>
          </div>
        </CardFooter>
      </Card>
    </ListboxItem>
  );
}
export default function Extension() {
  return (
    <main>
      <div>
        <Input
          label="Search"
          isClearable
          radius="lg"
          classNames={{
            base: "sticky top-0",
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default/60",
              "!cursor-text",
              "rounded-r-lg",
              "rounded-l-none",
            ],
          }}
          placeholder="Type to search..."
        />
      </div>

      <ListboxWrapper>
        <Listbox
          aria-label="Example with disabled actions"
          disabledKeys={["edit", "delete"]}
          className="w-full overflow-auto scrollbar-hide"
        >
          <ListboxItem key="search"></ListboxItem>
          {languageOptions.map(({ id, name, label }) =>
            generate(id, name, label)
          )}
        </Listbox>
      </ListboxWrapper>
    </main>
  );
}
