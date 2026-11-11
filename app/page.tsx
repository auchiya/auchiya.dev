import Link from "next/link";
import { Prose } from "./components/Prose";
import { site } from "@/content/site";

export default function Home() {
  return (
    <div className="flex flex-1 items-start">
      <div className="-mt-[5px] w-full md:w-9/12">
        <Prose className="[&_p]:m-3 text-xl">
          <p>
            I'm a full-stack software engineer based in {site.location}. I currently work at{" "}
            <a href="https://www.derivco.com/" target="_blank">
              Derivco
            </a>
            , where I focus on growing the AI development workflow.
          </p>
          <p>
            I'm the maintainer and co-owner of{" "}
            <a href="https://calculadorasolartermica.ar/" target="_blank">
              Calculadora Solar Térmica
            </a>
            , an app I started in 2022, built from scratch, and that's now used by engineers and
            technicians across Argentina.
          </p>
          <p>
            I've been writing software professionally since 2016. I worked at{" "}
            <a href="https://www.chevron.com/" target="_blank">
              Chevron
            </a>{" "}
            in the Oil & Gas industry and{" "}
            <a href="https://www.asince.com.ar/" target="_blank">
              Asince S.R.L.
            </a>{" "}
            in the logistics industry. Before that, I was a PC repair technician and a freelancer
            building websites for small clients.
          </p>
          <p>
            I care about what the product I work on is helping people to get their job done. I like
            to think of the underlying problems behind features, make things work first, deliver and
            iterate, balancing pace & quality.
          </p>
          <p>
            I've built some things — a selection lives on the <Link href="/projects">Projects</Link>{" "}
            page, and I keep a running list of random stuff under <Link href="/misc">Misc</Link>.
          </p>
          <p>
            Outside of work, I'm a dog person 🐕. I've been climbing indoors since 2023 — and
            counting.
          </p>
        </Prose>
      </div>
    </div>
  );
}
