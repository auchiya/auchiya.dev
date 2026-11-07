import Link from "next/link";
import { Prose } from "./components/Prose";
import { site } from "@/content/site";

export default function Home() {
  return (
    <div className="flex flex-1 items-start">
      <div className="-mt-[5px] w-full md:w-9/12">
        <Prose>
          <p>
            I'm a software engineer based in {site.location}. I currently work at [Company], where I
            focus on [what you work on].
          </p>
          <p>
            Previously, I [previous role or project]. I care about [the kinds of problems you like
            to solve] and [how you approach your work].
          </p>
          <p>
            I write about [topics you write about] on the <Link href="/writing">Writing</Link> page,
            and keep a running list of [things you collect] under <Link href="/misc">Misc</Link>.
          </p>
          <p>
            Outside of work, I [hobbies and interests]. You can reach me at{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </Prose>
      </div>
    </div>
  );
}
