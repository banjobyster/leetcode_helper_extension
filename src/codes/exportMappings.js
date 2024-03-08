import { mapping_cpp } from "./cpp/mapping";
import { mapping_java } from "./java/mapping";
import { mapping_python } from "./python/mapping";
import { mapping_python3 } from "./python3/mapping";
import { mapping_mysql } from "./mysql/mapping";
import { mapping_mssql } from "./mssql/mapping";
import { mapping_oraclesql } from "./oraclesql/mapping";
import { mapping_c } from "./c/mapping";
import { mapping_csharp } from "./csharp/mapping";
import { mapping_javascript } from "./javascript/mapping";
import { mapping_typescript } from "./typescript/mapping";
import { mapping_bash } from "./bash/mapping";
import { mapping_php } from "./php/mapping";
import { mapping_swift } from "./swift/mapping";
import { mapping_kotlin } from "./kotlin/mapping";
import { mapping_dart } from "./dart/mapping";
import { mapping_golang } from "./golang/mapping";
import { mapping_ruby } from "./ruby/mapping";
import { mapping_scala } from "./scala/mapping";
import { mapping_html } from "./html/mapping";
import { mapping_pythonml } from "./pythonml/mapping";
import { mapping_rust } from "./rust/mapping";
import { mapping_racket } from "./racket/mapping";
import { mapping_erlang } from "./erlang/mapping";
import { mapping_elixir } from "./elixir/mapping";
import { mapping_pythondata } from "./pythondata/mapping";
import { mapping_react } from "./react/mapping";
import { mapping_vanillajs } from "./vanillajs/mapping";
import { mapping_postgresql } from "./postgresql/mapping";

export const mappings = {
    "cpp": mapping_cpp,
    "java": mapping_java,
    "python": mapping_python,
    "python3": mapping_python3,
    "mysql": mapping_mysql,
    "mssql": mapping_mssql,
    "oraclesql": mapping_oraclesql,
    "c": mapping_c,
    "csharp": mapping_csharp,
    "javascript": mapping_javascript,
    "typescript": mapping_typescript,
    "bash": mapping_bash,
    "php": mapping_php,
    "swift": mapping_swift,
    "kotlin": mapping_kotlin,
    "dart": mapping_dart,
    "golang": mapping_golang,
    "ruby": mapping_ruby,
    "scala": mapping_scala,
    "html": mapping_html,
    "pythonml": mapping_pythonml,
    "rust": mapping_rust,
    "racket": mapping_racket,
    "erlang": mapping_erlang,
    "elixir": mapping_elixir,
    "pythondata": mapping_pythondata,
    "react": mapping_react,
    "vanillajs": mapping_vanillajs,
    "postgresql": mapping_postgresql,
};
