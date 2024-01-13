import lume from "lume/mod.ts";
import blog from "../mod.ts";

const site = lume().use(blog());
export default site;
