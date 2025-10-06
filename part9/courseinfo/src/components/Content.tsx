import Part from "./Part";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseWithDescription extends CoursePartBase {
    description: string;
}

interface CoursePartBasic extends CoursePartBaseWithDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBaseWithDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartWithRequirements extends CoursePartBaseWithDescription {
    requirements: string[]
    kind: "special"
}

export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartWithRequirements;


const Content = (prop: { courseParts: CoursePart[] } ) => {
    return (prop.courseParts.map(c => <Part key={c.name} part={c} />));
}

export default Content;