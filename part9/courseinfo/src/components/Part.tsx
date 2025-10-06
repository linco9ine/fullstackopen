import type { CoursePart } from "./Content";

const assertNever = (value: never): never => {
    throw new Error(`Unhandled type: ${JSON.stringify(value)}`)
}

const Part = ({ part }: { part : CoursePart }) => {
    switch (part.kind) {
        case "basic":
            return (
                <>
                  <h4>{part.name} {part.exerciseCount}</h4>
                  <p>{part.description}</p>
                </>
            );
        case "group":
            return (
                <>
                  <h4>{part.name} {part.exerciseCount}</h4>
                  <p>project exercises {part.groupProjectCount}</p>
                </>
            );
        case "background":
            return (
                <>
                  <h4>{part.name} {part.exerciseCount}</h4>
                  <p>{part.description}</p>
                  <p>submit to {part.backgroundMaterial}</p>
                </>
            );
        case "special":
            return (
                <>
                <h4>{part.name} {part.exerciseCount}</h4>
                <p>{part.description}</p>
                <p>{part.requirements.join(",")}</p>
                </>
            )
        default:
            return assertNever(part);
    }
}

export default Part;